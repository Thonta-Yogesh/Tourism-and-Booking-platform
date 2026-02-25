import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeroComponent } from '../../components/hero/hero.component';
import { Destination } from '../destinations/destination.model';
import { DestinationsService } from '../destinations/destinations.service';
import { Subject, Subscription, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, HeroComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  topDestinations = signal<Destination[]>([]);
  activeIndex = signal<number>(0);
  private destroy$ = new Subject<void>();
  private autoScrollSubscription?: Subscription;

  constructor(private destinationsService: DestinationsService) { }

  ngOnInit() {
    this.destinationsService.getTopDestinations().subscribe(destinations => {
      this.topDestinations.set(destinations);
      this.startAutoScroll();
    });
  }

  ngOnDestroy() {
    this.stopAutoScroll();
    this.destroy$.next();
    this.destroy$.complete();
  }

  startAutoScroll() {
    this.stopAutoScroll();
    // Emit every 3 seconds (2.5s view + 0.5s pause/transition)
    this.autoScrollSubscription = interval(3000).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.nextSlide();
    });
  }

  stopAutoScroll() {
    if (this.autoScrollSubscription) {
      this.autoScrollSubscription.unsubscribe();
    }
  }

  nextSlide() {
    this.activeIndex.update(index => (index + 1) % this.topDestinations().length);
  }

  prevSlide() {
    this.activeIndex.update(index =>
      index === 0 ? this.topDestinations().length - 1 : index - 1
    );
    this.resetAutoScroll();
  }

  setActiveIndex(index: number) {
    this.activeIndex.set(index);
    this.resetAutoScroll();
  }

  resetAutoScroll() {
    this.stopAutoScroll();
    this.startAutoScroll();
  }
}
