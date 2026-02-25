import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    username = signal('');
    password = signal('');
    errorMessage = signal('');
    isLoading = signal(false);

    onSubmit() {
        if (!this.username() || !this.password()) {
            this.errorMessage.set('Please enter both username and password.');
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set('');

        // Simulate network delay for "professional" feel
        setTimeout(() => {
            this.authService.login();
            this.isLoading.set(false);
            this.router.navigate(['/']); // Redirect to home on success
        }, 800);
    }

    onSocialLogin(provider: string) {
        this.isLoading.set(true);
        setTimeout(() => {
            if (provider === 'google') {
                this.authService.loginWithGoogle();
            } else if (provider === 'facebook') {
                this.authService.loginWithFacebook();
            }
            this.isLoading.set(false);
            this.router.navigate(['/']);
        }, 800);
    }
}
