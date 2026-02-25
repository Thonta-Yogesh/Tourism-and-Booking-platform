import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, NgZone, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

@Component({
    selector: 'app-light-pillar',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div #container class="light-pillar-container" [style.mix-blend-mode]="mixBlendMode">
      <div *ngIf="!webGLSupported" class="light-pillar-fallback">
        WebGL not supported
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    .light-pillar-container {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    .light-pillar-fallback {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.1);
      color: #888;
      font-size: 14px;
    }
  `]
})
export class LightPillarComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;

    @Input() topColor = '#5227FF';
    @Input() bottomColor = '#FF9FFC';
    @Input() intensity = 1.0;
    @Input() rotationSpeed = 0.3;
    @Input() interactive = false;
    @Input() glowAmount = 0.005;
    @Input() pillarWidth = 3.0;
    @Input() pillarHeight = 0.4;
    @Input() noiseIntensity = 0.5;
    @Input() mixBlendMode = 'normal'; // Changed to normal for background visibility
    @Input() pillarRotation = 0;
    @Input() quality: 'low' | 'medium' | 'high' = 'high';

    webGLSupported = true;

    private renderer: THREE.WebGLRenderer | null = null;
    private scene: THREE.Scene | null = null;
    private camera: THREE.OrthographicCamera | null = null;
    private material: THREE.ShaderMaterial | null = null;
    private geometry: THREE.PlaneGeometry | null = null;
    private rafId: number | null = null;
    private mouse = new THREE.Vector2(0, 0);
    private time = 0;
    private mouseMoveTimeout: any = null;
    private resizeTimeout: any = null;

    constructor(
        private ngZone: NgZone,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) {
                this.webGLSupported = false;
            }
        }
    }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId) && this.webGLSupported) {
            this.initThree();
        }
    }

    ngOnDestroy() {
        this.cleanup();
    }

    private initThree() {
        const container = this.containerRef.nativeElement;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Quality Settings
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLowEndDevice = isMobile || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

        let effectiveQuality = this.quality;
        if (isLowEndDevice && this.quality === 'high') effectiveQuality = 'medium';
        if (isMobile && this.quality !== 'low') effectiveQuality = 'low';

        const qualitySettings = {
            low: { iterations: 24, waveIterations: 1, pixelRatio: 0.5, precision: 'mediump', stepMultiplier: 1.5 },
            medium: { iterations: 40, waveIterations: 2, pixelRatio: 0.65, precision: 'mediump', stepMultiplier: 1.2 },
            high: {
                iterations: 80,
                waveIterations: 4,
                pixelRatio: Math.min(window.devicePixelRatio, 2),
                precision: 'highp',
                stepMultiplier: 1.0
            }
        };

        const settings = qualitySettings[effectiveQuality] || qualitySettings.medium;

        // SCENE
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        // RENDERER
        try {
            this.renderer = new THREE.WebGLRenderer({
                antialias: false,
                alpha: true,
                powerPreference: effectiveQuality === 'high' ? 'high-performance' : 'low-power',
                precision: settings.precision as 'highp' | 'mediump' | 'lowp',
                stencil: false,
                depth: false
            });
        } catch (error) {
            this.webGLSupported = false;
            return;
        }

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(settings.pixelRatio);
        container.appendChild(this.renderer.domElement);

        // SHADER
        const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

        const fragmentShader = `
      precision ${settings.precision} float;

      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform vec3 uTopColor;
      uniform vec3 uBottomColor;
      uniform float uIntensity;
      uniform bool uInteractive;
      uniform float uGlowAmount;
      uniform float uPillarWidth;
      uniform float uPillarHeight;
      uniform float uNoiseIntensity;
      uniform float uRotCos;
      uniform float uRotSin;
      uniform float uPillarRotCos;
      uniform float uPillarRotSin;
      uniform float uWaveSin;
      uniform float uWaveCos;
      varying vec2 vUv;

      const float STEP_MULT = ${settings.stepMultiplier.toFixed(1)};
      const int MAX_ITER = ${settings.iterations};
      const int WAVE_ITER = ${settings.waveIterations};

      void main() {
        vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
        uv = vec2(uPillarRotCos * uv.x - uPillarRotSin * uv.y, uPillarRotSin * uv.x + uPillarRotCos * uv.y);

        vec3 ro = vec3(0.0, 0.0, -10.0);
        vec3 rd = normalize(vec3(uv, 1.0));

        float rotC = uRotCos;
        float rotS = uRotSin;
        if(uInteractive && (uMouse.x != 0.0 || uMouse.y != 0.0)) {
          float a = uMouse.x * 6.283185;
          rotC = cos(a);
          rotS = sin(a);
        }

        vec3 col = vec3(0.0);
        float t = 0.1;
        
        for(int i = 0; i < MAX_ITER; i++) {
          vec3 p = ro + rd * t;
          p.xz = vec2(rotC * p.x - rotS * p.z, rotS * p.x + rotC * p.z);

          vec3 q = p;
          q.y = p.y * uPillarHeight + uTime;
          
          float freq = 1.0;
          float amp = 1.0;
          for(int j = 0; j < WAVE_ITER; j++) {
            q.xz = vec2(uWaveCos * q.x - uWaveSin * q.z, uWaveSin * q.x + uWaveCos * q.z);
            q += cos(q.zxy * freq - uTime * float(j) * 2.0) * amp;
            freq *= 2.0;
            amp *= 0.5;
          }
          
          float d = length(cos(q.xz)) - 0.2;
          float bound = length(p.xz) - uPillarWidth;
          float k = 4.0;
          float h = max(k - abs(d - bound), 0.0);
          d = max(d, bound) + h * h * 0.0625 / k;
          d = abs(d) * 0.15 + 0.01;

          float grad = clamp((15.0 - p.y) / 30.0, 0.0, 1.0);
          col += mix(uBottomColor, uTopColor, grad) / d;

          t += d * STEP_MULT;
          if(t > 50.0) break;
        }

        float wNorm = uPillarWidth / 3.0;
        col = tanh(col * uGlowAmount / wNorm);
        
        col -= fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) / 15.0 * uNoiseIntensity;
        
        gl_FragColor = vec4(col * uIntensity * 1.5, 1.0); // Boosted intensity for visibility
      }
    `;

        const pillarRotRad = (this.pillarRotation * Math.PI) / 180;
        const waveSin = Math.sin(0.4);
        const waveCos = Math.cos(0.4);

        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new THREE.Vector2(width, height) },
                uMouse: { value: this.mouse },
                uTopColor: { value: new THREE.Color(this.topColor) },
                uBottomColor: { value: new THREE.Color(this.bottomColor) },
                uIntensity: { value: this.intensity },
                uInteractive: { value: this.interactive },
                uGlowAmount: { value: this.glowAmount },
                uPillarWidth: { value: this.pillarWidth },
                uPillarHeight: { value: this.pillarHeight },
                uNoiseIntensity: { value: this.noiseIntensity },
                uRotCos: { value: 1.0 },
                uRotSin: { value: 0.0 },
                uPillarRotCos: { value: Math.cos(pillarRotRad) },
                uPillarRotSin: { value: Math.sin(pillarRotRad) },
                uWaveSin: { value: waveSin },
                uWaveCos: { value: waveCos }
            },
            transparent: true,
            depthWrite: false,
            depthTest: false
        });

        this.geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(mesh);

        // EVENTS
        if (this.interactive) {
            this.ngZone.runOutsideAngular(() => {
                container.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: true });
            });
        }
        this.ngZone.runOutsideAngular(() => {
            window.addEventListener('resize', this.handleResize.bind(this), { passive: true });
            this.animate();
        });
    }

    private handleMouseMove(event: MouseEvent) {
        if (this.mouseMoveTimeout) return;
        this.mouseMoveTimeout = setTimeout(() => { this.mouseMoveTimeout = null; }, 16);

        const rect = this.containerRef.nativeElement.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        this.mouse.set(x, y);
    }

    private handleResize() {
        if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            if (!this.renderer || !this.material || !this.containerRef) return;
            const container = this.containerRef.nativeElement;
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;
            this.renderer.setSize(newWidth, newHeight);
            this.material.uniforms['uResolution'].value.set(newWidth, newHeight);
        }, 150);
    }

    private animate() {
        // Loop
        this.rafId = requestAnimationFrame(() => this.animate());

        if (!this.material || !this.renderer || !this.scene || !this.camera) return;

        const currentTime = performance.now();
        // Simple time delta or just accum
        this.time += 0.016 * this.rotationSpeed;

        this.material.uniforms['uTime'].value = this.time;
        this.material.uniforms['uRotCos'].value = Math.cos(this.time * 0.3);
        this.material.uniforms['uRotSin'].value = Math.sin(this.time * 0.3);

        this.renderer.render(this.scene, this.camera);
    }

    private cleanup() {
        if (isPlatformBrowser(this.platformId)) {
            window.removeEventListener('resize', this.handleResize);
            if (this.interactive && this.containerRef) {
                this.containerRef.nativeElement.removeEventListener('mousemove', this.handleMouseMove);
            }
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
            }
            if (this.renderer) {
                this.renderer.dispose();
                this.renderer.forceContextLoss();
                const domElement = this.renderer.domElement;
                if (domElement && domElement.parentNode) {
                    domElement.parentNode.removeChild(domElement);
                }
            }
            if (this.material) this.material.dispose();
            if (this.geometry) this.geometry.dispose();
        }
    }
}
