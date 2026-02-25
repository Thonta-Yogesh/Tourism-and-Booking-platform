import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
    name = signal('');
    email = signal('');
    subject = signal('');
    message = signal('');

    isSubmitting = signal(false);
    successMessage = signal('');

    onSubmit() {
        this.isSubmitting.set(true);

        // Simulate network request
        setTimeout(() => {
            this.isSubmitting.set(false);
            this.successMessage.set('Thank you for contacting us! We will get back to you shortly.');

            // Reset form
            this.name.set('');
            this.email.set('');
            this.subject.set('');
            this.message.set('');

            // Clear success message after 5 seconds
            setTimeout(() => this.successMessage.set(''), 5000);
        }, 1000);
    }
}
