import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DestinationsService } from '../destinations/destinations.service';

interface PaymentBookingData {
    destinationId: number;
    destinationName: string;
    date: string;
    guests: number;
    name: string;
    email: string;
    phone: string;
    specialRequests: string;
    totalPrice: number;
    couponCode?: string;
    discountAmount?: number;
}

@Component({
    selector: 'app-payment',
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './payment.component.html',
    styleUrl: './payment.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentComponent implements OnInit {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private destinationsService = inject(DestinationsService);

    bookingData = signal<PaymentBookingData | null>(null);
    isProcessing = signal(false);
    paymentError = signal<string | null>(null);

    paymentForm = this.fb.group({
        cardholderName: ['', Validators.required],
        cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/)]],
        expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
        cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
    });

    ngOnInit() {
        const nav = this.router.getCurrentNavigation();
        const state = nav?.extras?.state ?? (typeof history !== 'undefined' ? history.state : null);

        if (state?.['bookingData']) {
            this.bookingData.set(state['bookingData'] as PaymentBookingData);
        } else {
            // No booking data — redirect back
            this.router.navigate(['/book-tour']);
        }
    }

    formatCardNumber(event: Event) {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, '');
        value = value.substring(0, 16);
        const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        input.value = formatted;
        this.paymentForm.get('cardNumber')?.setValue(formatted);
    }

    formatExpiry(event: Event) {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, '');
        value = value.substring(0, 4);
        if (value.length >= 3) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        input.value = value;
        this.paymentForm.get('expiryDate')?.setValue(value);
    }

    processPayment() {
        if (this.paymentForm.invalid) {
            this.paymentForm.markAllAsTouched();
            return;
        }

        const data = this.bookingData();
        if (!data) return;

        this.isProcessing.set(true);
        this.paymentError.set(null);

        const bookingRequest = {
            destinationId: data.destinationId,
            date: data.date,
            guests: data.guests,
            name: data.name,
            email: data.email,
            phone: data.phone,
            specialRequests: data.specialRequests
        };

        this.destinationsService.submitBooking(bookingRequest).subscribe({
            next: (success) => {
                this.isProcessing.set(false);
                if (success) {
                    this.router.navigate(['/book-tour'], { state: { paymentSuccess: true } });
                }
            },
            error: () => {
                this.isProcessing.set(false);
                this.paymentError.set('Payment failed. Please try again.');
            }
        });
    }
}
