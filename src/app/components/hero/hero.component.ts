import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  Inject,
  PLATFORM_ID,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  NgZone,
  viewChild
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Destination } from '../../pages/destinations/destination.model';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('heroCanvas');

  /** 0 = top, 1 = animation complete */
  scrollProgress = signal(0);

  /**
   * Derived text animation values — Jesko Jets style:
   * Text falls DOWN, scales UP, fades OUT on scroll.
   * Each element has slightly different timing for stagger.
   */

  // Center title: fades out fastest (by 15% scroll)
  titleOpacity = computed(() => Math.max(0, 1 - this.scrollProgress() * 7));
  titleScale = computed(() => 1 + this.scrollProgress() * 3);
  titleTranslateY = computed(() => this.scrollProgress() * 120);

  // Left heading: fades out by ~25% scroll
  leftOpacity = computed(() => Math.max(0, 1 - this.scrollProgress() * 4));
  leftScale = computed(() => 1 + this.scrollProgress() * 1.5);
  leftTranslateY = computed(() => this.scrollProgress() * 200);

  // Right heading: slightly delayed, fades by ~30%
  rightOpacity = computed(() => Math.max(0, 1 - this.scrollProgress() * 3.5));
  rightScale = computed(() => 1 + this.scrollProgress() * 1.2);
  rightTranslateY = computed(() => this.scrollProgress() * 180);

  // Bottom left text: fades by ~20%
  bottomLeftOpacity = computed(() => Math.max(0, 1 - this.scrollProgress() * 5));
  bottomLeftTranslateY = computed(() => this.scrollProgress() * 150);

  // Bottom right (scroll hint): fades by ~15%
  bottomRightOpacity = computed(() => Math.max(0, 1 - this.scrollProgress() * 6));

  // CTA button: fades out by ~12% scroll
  ctaOpacity = computed(() => Math.max(0, 1 - this.scrollProgress() * 8));
  ctaTranslateY = computed(() => this.scrollProgress() * 100);

  // Destinations list - we could ideally inject the DestinationsService but keeping it static here for animation sync
  readonly destinations: Pick<Destination, 'id' | 'name'>[] = [
    { id: 1, name: 'Bali' },
    { id: 2, name: 'Paris' },
    { id: 3, name: 'Kyoto' },
    { id: 4, name: 'Santorini' },
    { id: 5, name: 'Machu Picchu' },
    { id: 6, name: 'Grand Canyon' },
    { id: 7, name: 'Swiss Alps' },
    { id: 8, name: 'Dubai' },
    { id: 9, name: 'Rome' },
    { id: 10, name: 'New York' },
    { id: 11, name: 'Cairo' }
  ];

  // Duplicate the array many times so items keep scrolling until the very last frame
  readonly loopedDestinations = [
    ...this.destinations,
    ...this.destinations,
    ...this.destinations,
    ...this.destinations,
    ...this.destinations,
    ...this.destinations,
    ...this.destinations,
    ...this.destinations
  ];

  /**
   * Destination list: items appear during the tower phase (scroll 30% onwards).
   * A vertical list on the right side that moves up and fades at boundaries.
   * Stays visible until the very last scroll frame.
   */
  destContainerOpacity = computed(() => {
    const p = this.scrollProgress();
    // Start appearing after the clouds finish passing (around 30% scroll mark)
    if (p < 0.30) return 0;
    // Stay fully visible until the end — no early fade-out
    return Math.min(1, (p - 0.30) * 8);
  });

  // Vertical movement offset driven by scroll
  destTranslateY = computed(() => {
    const p = this.scrollProgress();
    // Map tower phase (0.30 to 1.00) to a progress from 0 to 1
    const phaseProgress = Math.min(1, Math.max(0, (p - 0.30) / 0.70));

    // With 8x duplicated array (88 items total), each ~80px high with gap.
    // Slow down the travel so items are still visible at the very last frame.
    return 300 - (phaseProgress * 6000);
  });

  /**
   * Discover More Button opacity: Fades in at the tower phase
   */
  discoverBtnOpacity = computed(() => {
    const p = this.scrollProgress();
    // Fade in between 65% and 80% scroll progress (later in the tower phase)
    if (p < 0.65) return 0;
    return Math.min(1, (p - 0.65) * 6);
  });

  private context: CanvasRenderingContext2D | null = null;
  private images: HTMLImageElement[] = [];
  private readonly totalFrames = 192;
  private displayedFrame = 1;
  private targetFrame = 1;
  private animationId: number | null = null;
  private resizeTimeout: ReturnType<typeof setTimeout> | undefined;
  private scrollHandler: (() => void) | null = null;
  private resizeHandler: (() => void) | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone
  ) { }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initCanvas();
      this.preloadImages();
      this.setupScrollListener();
      this.startRenderLoop();
    }
  }

  ngOnDestroy() {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private initCanvas() {
    const canvasEl = this.canvasRef();
    if (!canvasEl) return;
    this.context = canvasEl.nativeElement.getContext('2d');
    this.resizeCanvas();

    this.resizeHandler = () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.resizeCanvas();
        this.drawFrame(this.displayedFrame);
      }, 100);
    };

    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('resize', this.resizeHandler!);
    });
  }

  private resizeCanvas() {
    const canvasEl = this.canvasRef();
    if (!canvasEl) return;
    const canvas = canvasEl.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private preloadImages() {
    for (let i = 1; i <= this.totalFrames; i++) {
      const img = new Image();
      img.src = `home_animation_pics/${i.toString().padStart(5, '0')}.png`;
      if (i === 1) {
        img.onload = () => this.drawFrame(1);
      }
      this.images.push(img);
    }
  }

  private drawFrame(frameIndex: number) {
    if (!this.context) return;
    const canvasEl = this.canvasRef();
    if (!canvasEl) return;
    const canvas = canvasEl.nativeElement;
    const image = this.images[frameIndex - 1];

    if (image?.complete && image.naturalWidth !== 0) {
      const ratio = Math.max(canvas.width / image.width, canvas.height / image.height);
      const cx = (canvas.width - image.width * ratio) / 2;
      const cy = (canvas.height - image.height * ratio) / 2;

      this.context.clearRect(0, 0, canvas.width, canvas.height);
      this.context.drawImage(image, 0, 0, image.width, image.height,
        cx, cy, image.width * ratio, image.height * ratio);
    }
  }

  /**
   * Smooth render loop: advances toward target at adaptive speed.
   * Small gap = 1 frame/tick (smooth). Large gap = up to 4 frames/tick
   * (keeps up with fast scrolling, no stalling at clouds).
   */
  private startRenderLoop() {
    this.ngZone.runOutsideAngular(() => {
      const tick = () => {
        const gap = this.targetFrame - this.displayedFrame;
        if (gap !== 0) {
          // Adaptive step: advance faster when further behind
          const absGap = Math.abs(gap);
          const step = absGap > 20 ? 4 : absGap > 8 ? 3 : absGap > 3 ? 2 : 1;
          const direction = gap > 0 ? 1 : -1;

          this.displayedFrame += direction * Math.min(step, absGap);
          this.drawFrame(this.displayedFrame);
        }
        this.animationId = requestAnimationFrame(tick);
      };
      this.animationId = requestAnimationFrame(tick);
    });
  }

  /** Scroll listener: sets the TARGET frame + text animation progress */
  private setupScrollListener() {
    this.scrollHandler = () => {
      const scrollY = window.scrollY;
      const heroContainer = document.querySelector('.hero-scroll-container') as HTMLElement;
      if (!heroContainer) return;

      const scrollableDist = heroContainer.scrollHeight - window.innerHeight;
      if (scrollableDist <= 0) return;

      const fraction = Math.min(1, Math.max(0, scrollY / scrollableDist));

      // Update text animation progress
      this.ngZone.run(() => this.scrollProgress.set(fraction));

      // Set target frame (the render loop will smoothly catch up)
      this.targetFrame = Math.min(this.totalFrames,
        Math.max(1, Math.floor(fraction * this.totalFrames) + 1));
    };

    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.scrollHandler!, { passive: true });
    });
  }
}
