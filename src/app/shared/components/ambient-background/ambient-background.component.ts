import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-ambient-background',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="ambient-container">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="mesh-overlay"></div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
      overflow: hidden;
      background-color: #fcfcfc; /* Base soft white */
    }

    .ambient-container {
      position: absolute;
      width: 100%;
      height: 100%;
      filter: blur(80px); /* Heavy blur for soft fusion */
      opacity: 0.8; 
    }

    .orb {
      position: absolute;
      border-radius: 50%;
      mix-blend-mode: multiply; /* Blends nicely on light backgrounds */
      animation: float 20s infinite ease-in-out alternate;
    }

    /* Orb 1: Soft Silver/Mist */
    .orb-1 {
      width: 60vw;
      height: 60vw;
      top: -10%;
      left: -10%;
      background: #e8e8e8;
      animation-duration: 25s;
    }

    /* Orb 2: Warm Champagne/Gold (Very Subtle) */
    .orb-2 {
      width: 50vw;
      height: 50vw;
      top: 20%;
      right: -10%;
      background: rgba(197, 160, 89, 0.12); /* Branded Accent */
      animation-duration: 30s;
      animation-delay: -5s;
    }

    /* Orb 3: Pure White Light/Highlight */
    .orb-3 {
      width: 40vw;
      height: 40vw;
      bottom: -10%;
      left: 20%;
      background: #ffffff;
      animation-duration: 22s;
      animation-delay: -10s;
    }

    /* Optional Noise Overlay for texture */
    .mesh-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.4;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      mix-blend-mode: overlay;
      pointer-events: none;
    }

    @keyframes float {
      0% {
        transform: translate(0, 0) scale(1);
      }
      33% {
        transform: translate(30px, 50px) scale(1.1);
      }
      66% {
        transform: translate(-20px, 20px) scale(0.9);
      }
      100% {
        transform: translate(0, 0) scale(1);
      }
    }
  `],
    encapsulation: ViewEncapsulation.None
})
export class AmbientBackgroundComponent { }
