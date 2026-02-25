import { Component, ChangeDetectionStrategy, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onWindowScroll()'
  }
})
export class HeaderComponent {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  authService = inject(AuthService);

  isMenuOpen = signal(false);
  isScrolled = signal(false);
  isHome = signal(true);

  currentUser = this.authService.currentUser;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        const url = event.url;
        this.isHome.set(url === '/' || url === '/home' || url === '');
        this.checkScroll();
      });
    }
  }

  onWindowScroll() {
    this.checkScroll();
  }

  private checkScroll() {
    if (!isPlatformBrowser(this.platformId)) return;

    if (!this.isHome()) {
      // Non-home pages: always solid
      this.isScrolled.set(true);
    } else {
      // On home: stay transparent until the scroll animation container ends
      // The hero container is 300vh, scrollable distance is 300vh - 100vh = 200vh
      const heroContainer = document.querySelector('.hero-scroll-container') as HTMLElement;
      if (heroContainer) {
        const scrollableDist = heroContainer.scrollHeight - window.innerHeight;
        this.isScrolled.set(window.scrollY >= scrollableDist);
      } else {
        this.isScrolled.set(window.scrollY > 50);
      }
    }
  }

  toggleMenu() { this.isMenuOpen.update(v => !v); }
  closeMenu() { this.isMenuOpen.set(false); }

  login() { this.authService.login(); }
  logout() { this.authService.logout(); }
}
