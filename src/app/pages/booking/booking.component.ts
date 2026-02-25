import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DestinationsService } from '../destinations/destinations.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { computed } from '@angular/core';
import { ScrollVelocityComponent } from '../../shared/components/scroll-velocity/scroll-velocity.component';

interface CouponOffer {
  code: string;
  description: string;
  type: 'percent' | 'flat';
  value: number;
  minGuests?: number;
  exactGuests?: number;
  minDays?: number;
}

@Component({
  selector: 'app-booking',
  imports: [CommonModule, ReactiveFormsModule, ScrollVelocityComponent, RouterLink],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destinationsService = inject(DestinationsService);

  destinations = toSignal(this.destinationsService.getDestinations(), { initialValue: [] });
  isSubmitting = signal(false);
  submitSuccess = signal(false);
  showConfirmDialog = signal(false);

  // Coupling signals with form
  selectedDestinationId = signal<number | null>(null);
  guestCount = signal<number>(1);

  // Coupons
  couponCode = signal<string>('');
  appliedCoupon = signal<{ code: string, discount: number, type: 'percent' | 'flat' } | null>(null);
  couponError = signal<string | null>(null);

  availableOffers: CouponOffer[] = [
    { code: 'FAMILY5', description: '15% off for groups of 5+', type: 'percent', value: 15, minGuests: 5 },
    { code: 'HONEYMOON', description: '$200 off for couples', type: 'flat', value: 200, exactGuests: 2 },
    { code: 'EARLYBIRD', description: '10% off early bookings', type: 'percent', value: 10, minDays: 30 }
  ];

  bookingForm = this.fb.group({
    destinationId: [null as number | null, Validators.required],
    date: ['', Validators.required],
    guests: [1, [Validators.required, Validators.min(1)]],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    specialRequests: ['']
  });

  ngOnInit() {
    // Check for payment success from route state
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state ?? (typeof history !== 'undefined' ? history.state : null);
    if (state?.['paymentSuccess']) {
      this.submitSuccess.set(true);
    }

    // Sync signals with form
    this.bookingForm.get('destinationId')?.valueChanges.subscribe(val => this.selectedDestinationId.set(Number(val)));
    this.bookingForm.get('guests')?.valueChanges.subscribe(val => this.guestCount.set(Number(val)));

    this.route.queryParams.subscribe(params => {
      const destId = params['destinationId'];
      if (destId) {
        this.bookingForm.patchValue({ destinationId: Number(destId) });
      }
    });
  }

  selectedDestination = computed(() => {
    return this.destinations().find(d => d.id === this.selectedDestinationId());
  });

  destinationsText = computed(() => {
    return this.destinations().map(d => d.name).join(' • ');
  });

  totalPrice = computed(() => {
    const dest = this.selectedDestination();
    const guests = this.guestCount();
    if (!dest) return 0;

    let total = dest.price * guests;
    const coupon = this.appliedCoupon();

    if (coupon) {
      if (coupon.type === 'percent') {
        total = total * (1 - coupon.discount / 100);
      } else {
        total = Math.max(0, total - coupon.discount);
      }
    }
    return total;
  });

  discountAmount = computed(() => {
    const dest = this.selectedDestination();
    if (!dest) return 0;
    return (dest.price * this.guestCount()) - this.totalPrice();
  });

  applyCoupon(code: string) {
    this.couponError.set(null);
    const normalizedCode = code.toUpperCase().trim();
    const guests = this.guestCount();

    if (!normalizedCode) return;

    const offer = this.availableOffers.find(o => o.code === normalizedCode);

    if (!offer) {
      this.couponError.set('Invalid coupon code');
      this.appliedCoupon.set(null);
      return;
    }

    // Validation Logic
    if (offer.minGuests && guests < offer.minGuests) {
      this.couponError.set(`Minimum ${offer.minGuests} guests required for this offer.`);
      this.appliedCoupon.set(null);
      return;
    }
    if (offer.exactGuests && guests !== offer.exactGuests) {
      this.couponError.set(`This offer is valid only for exactly ${offer.exactGuests} guests.`);
      this.appliedCoupon.set(null);
      return;
    }

    // Success
    this.appliedCoupon.set({
      code: offer.code,
      discount: offer.value,
      type: offer.type as 'percent' | 'flat'
    });
    this.couponCode.set(normalizedCode);
  }

  removeCoupon() {
    this.appliedCoupon.set(null);
    this.couponCode.set('');
    this.couponError.set(null);
  }

  handleSpotlightMove(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    el.style.setProperty('--mouse-x', `${x}px`);
    el.style.setProperty('--mouse-y', `${y}px`);
    el.style.setProperty('--spotlight-color', 'rgba(255, 255, 255, 0.2)'); // Soft spotlight on dark bg
  }

  onSubmit() {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    this.showConfirmDialog.set(true);
  }

  cancelBooking() {
    this.showConfirmDialog.set(false);
  }

  confirmBooking() {
    this.showConfirmDialog.set(false);
    const formValue = this.bookingForm.getRawValue();
    const dest = this.selectedDestination();

    const bookingData = {
      destinationId: Number(formValue.destinationId),
      destinationName: dest?.name ?? '',
      date: String(formValue.date),
      guests: Number(formValue.guests),
      name: String(formValue.name),
      email: String(formValue.email),
      phone: String(formValue.phone),
      specialRequests: String(formValue.specialRequests || ''),
      totalPrice: this.totalPrice(),
      couponCode: this.appliedCoupon()?.code,
      discountAmount: this.discountAmount()
    };

    this.router.navigate(['/payment'], { state: { bookingData } });
  }
}
