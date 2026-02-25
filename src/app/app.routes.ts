import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DestinationsComponent } from './pages/destinations/destinations.component';
import { ActivitiesComponent } from './pages/activities/activities.component';
import { BookingComponent } from './pages/booking/booking.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'destinations', component: DestinationsComponent },
    { path: 'destinations/:id', loadComponent: () => import('./pages/destinations/destination-details/destination-details.component').then(m => m.DestinationDetailsComponent) },
    { path: 'activities', component: ActivitiesComponent },
    { path: 'book-tour', component: BookingComponent },
    { path: 'login', component: SignInComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'payment', loadComponent: () => import('./pages/payment/payment.component').then(m => m.PaymentComponent) },
    { path: '**', redirectTo: '' }
];
