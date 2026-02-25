import { Component, ChangeDetectionStrategy, inject, signal, computed, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DestinationsService } from '../destinations.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-destination-details',
    imports: [CommonModule, RouterLink],
    templateUrl: './destination-details.component.html',
    styleUrl: './destination-details.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DestinationDetailsComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private destinationsService = inject(DestinationsService);
    private intervalId: any;

    // Get ID from route params and fetch destination
    destination = toSignal(
        this.route.paramMap.pipe(
            map(params => Number(params.get('id'))),
            switchMap(id => this.destinationsService.getDestinationById(id))
        )
    );

    activeImageIndex = signal(0);
    isPaused = signal(false);
    isTransitioning = signal(false);

    activeImage = computed(() => {
        const dest = this.destination();
        if (!dest || !dest.images || dest.images.length === 0) return '';
        return dest.images[this.activeImageIndex()];
    });

    ngOnInit() {
        this.startSlideShow();
    }

    ngOnDestroy() {
        this.clearSlideShow();
    }

    startSlideShow() {
        this.intervalId = setInterval(() => {
            if (!this.isPaused()) {
                this.nextImage();
            }
        }, 4000); // 4 seconds per slide
    }

    clearSlideShow() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    nextImage() {
        const dest = this.destination();
        if (!dest || !dest.images) return;

        const nextIndex = (this.activeImageIndex() + 1) % dest.images.length;
        this.transitionToImage(nextIndex);
    }

    setActiveImage(index: number) {
        if (this.activeImageIndex() === index) return;

        this.isPaused.set(true);
        this.transitionToImage(index);

        // Resume after 5 seconds of inactivity
        setTimeout(() => {
            this.isPaused.set(false);
        }, 5000);
    }

    transitionToImage(index: number) {
        this.isTransitioning.set(true);

        // Wait for fade out
        setTimeout(() => {
            this.activeImageIndex.set(index);
            // Wait a tiny bit for render cycle then fade in
            requestAnimationFrame(() => {
                this.isTransitioning.set(false);
            });
        }, 500); // Match CSS transition duration
    }

    togglePause(paused: boolean) {
        this.isPaused.set(paused);
    }

}
