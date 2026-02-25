import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-sign-up',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    fullName = signal('');
    email = signal('');
    password = signal('');
    confirmPassword = signal('');

    isLoading = signal(false);
    errorMessage = signal('');

    onSubmit() {
        // Basic Validation
        if (!this.fullName() || !this.email() || !this.password() || !this.confirmPassword()) {
            this.errorMessage.set('Please fill in all fields.');
            return;
        }

        if (this.password() !== this.confirmPassword()) {
            this.errorMessage.set('Passwords do not match.');
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set('');

        // Simulate network delay
        setTimeout(() => {
            this.authService.signup(this.fullName(), this.email());
            this.isLoading.set(false);
            this.router.navigate(['/']); // Redirect to home on success
        }, 1000);
    }
}
