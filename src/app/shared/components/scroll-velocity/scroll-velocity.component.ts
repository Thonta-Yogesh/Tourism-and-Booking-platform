import { Component, ElementRef, Input, ViewChild, AfterViewInit, OnDestroy, signal, computed, effect, NgZone, Inject, PLATFORM_ID, ChangeDetectionStrategy, ViewEncapsulation, input } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-scroll-velocity',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="parallax">
      <div class="scroller" #scrollerContainer>
        <span class="scroller-text">
          {{ text() }}&nbsp;
        </span>
        <span class="scroller-text">
          {{ text() }}&nbsp;
        </span>
        <span class="scroller-text">
          {{ text() }}&nbsp;
        </span>
        <span class="scroller-text">
          {{ text() }}&nbsp;
        </span>
      </div>
    </section>
  `,
  styles: [`
    .parallax {
      overflow: hidden;
      margin: 0;
      white-space: nowrap;
      display: flex;
      flex-wrap: nowrap;
      width: 100%;
    }

    .scroller {
      display: flex;
      white-space: nowrap;
      flex-wrap: nowrap;
      font-weight: 900;
      text-transform: uppercase;
      font-size: 2.5rem; 
      line-height: 1.1;
      will-change: transform;
    }
    
    .scroller-text {
      display: block;
      margin-right: 30px;
      flex-shrink: 0;
    }

    @media (min-width: 768px) {
      .scroller {
         font-size: 6rem;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ScrollVelocityComponent implements AfterViewInit, OnDestroy {
  text = input.required<string>();
  baseVelocity = input(2);
  scrollVelocityFactor = input(3);

  @ViewChild('scrollerContainer') scrollerContainer!: ElementRef<HTMLElement>;

  private animationFrameId: number | null = null;
  private currentX = 0;
  private velocity = 0;
  private lastScrollY = 0;
  private isBrowser: boolean;
  private directionFactor = 1;

  constructor(
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit() {
    if (!this.isBrowser) return;

    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
      this.loop();
    });
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - this.lastScrollY;

    // Smooth velocity impulse
    if (delta !== 0) {
      // Delta is usually between -20 and 20 roughly
      // We want to add significant speed impulse
      this.velocity += delta * (this.scrollVelocityFactor() / 100);

      // Update direction based on scroll? 
      // The original effect often changes direction based on scroll.
      // If delta > 0 (scrolling down), direction = 1
      // If delta < 0 (scrolling up), direction = -1
      if (delta > 0) this.directionFactor = 1;
      else if (delta < 0) this.directionFactor = -1;
    }

    this.lastScrollY = currentScrollY;
  }

  loop() {
    const el = this.scrollerContainer?.nativeElement;
    if (!el) return;

    // Dampen velocity back to 0
    this.velocity *= 0.9; // Fast decay

    // Calculate Movement
    // Base speed + Velocity impulse
    // The directionFactor here mainly dictates the 'impulse' direction if desired, 
    // or we can let baseVelocity always drive forward and scroll just speeds it up/reverses.
    // Let's make scroll influence direction entirely if the impulse is strong enough.

    let move = (this.baseVelocity() * this.directionFactor) + this.velocity;

    // Always move a bit in current direction
    // If velocity is high, it dominates. If 0, baseVelocity dominates.

    // For simpler implementation matching typical "scroll velocity":
    // Base move is always separate from scroll velocity.
    // Or: scroll direction *CHANGES* the base direction.

    // Let's stick to: 
    // Always move -baseVelocity (left).
    // Scroll adds velocity.

    let deltaMove = this.baseVelocity() + this.velocity;

    // Using direction from scroll?
    // If I scroll down, text moves faster left.
    // If I scroll up, text moves right?

    // Let's apply directionFactor to the whole movement for dynamic effect
    if (Math.abs(this.velocity) > 0.1) {
      // If scrolling fast, follow scroll direction
      // If velocity is positive (down), direction is 1. move = base + velocity
    }

    this.currentX -= deltaMove; // Move left by default

    // Infinite Wrap Logic
    // We have 4 spans. 
    // One "copy" width is roughly totalWidth / 4.
    const containerWidth = el.scrollWidth;
    const itemWidth = containerWidth / 4;

    if (itemWidth > 0) {
      // If moved left beyond -itemWidth (one full item gone), reset by adding itemWidth
      // This keeps it seamless
      if (this.currentX <= -itemWidth) {
        // We are too far left. Jump back right.
        // Use modulo to wrap perfectly
        // this.currentX = this.currentX % itemWidth; // Can cause jump if slightly off
        this.currentX += itemWidth;
      } else if (this.currentX > 0) {
        // We moved right (scrolled up fast). Jump back left.
        this.currentX -= itemWidth;
      }
    }

    el.style.transform = `translateX(${this.currentX}px)`;

    this.animationFrameId = requestAnimationFrame(() => this.loop());
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      window.removeEventListener('scroll', this.handleScroll.bind(this));
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
    }
  }
}
