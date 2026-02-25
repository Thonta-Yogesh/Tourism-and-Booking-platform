import { Injectable, signal } from '@angular/core';

export interface User {
    id: string;
    name: string;
    avatar?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // Mock User State
    currentUser = signal<User | null>(null);

    constructor() { }

    login() {
        // Simulating a login
        this.currentUser.set({
            id: '1',
            name: 'Yogesh',
            avatar: 'https://ui-avatars.com/api/?name=Yogesh&background=c5a059&color=fff'
        });
    }

    signup(name: string, email: string) {
        this.currentUser.set({
            id: Math.random().toString(36).substr(2, 9),
            name: name,
            avatar: `https://ui-avatars.com/api/?name=${name}&background=c5a059&color=fff`
        });
    }

    loginWithGoogle() {
        this.currentUser.set({
            id: 'google-user',
            name: 'Google User',
            avatar: 'https://ui-avatars.com/api/?name=Google+User&background=db4437&color=fff'
        });
    }

    loginWithFacebook() {
        this.currentUser.set({
            id: 'facebook-user',
            name: 'Facebook User',
            avatar: 'https://ui-avatars.com/api/?name=Facebook+User&background=4267B2&color=fff'
        });
    }

    logout() {
        this.currentUser.set(null);
    }

    isLoggedIn() {
        return this.currentUser() !== null;
    }
}
