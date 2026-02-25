import { Component, ElementRef, AfterViewInit, OnDestroy, Input, ViewChild, ViewEncapsulation, NgZone, Inject, PLATFORM_ID, input } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';

@Component({
  selector: 'app-galaxy-background',
  standalone: true,
  imports: [CommonModule],
  template: `<div #galaxyContainer class="galaxy-container"></div>`,
  styles: [`
    .galaxy-container {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      pointer-events: none; /* Allow interaction via window events/passthrough if needed, but component handles mouse */
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class GalaxyBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('galaxyContainer') containerRef!: ElementRef<HTMLDivElement>;

  // Inputs
  starSpeed = input(0.5);
  density = input(1); // Reduced density for cleaner look
  opacity = input(1); // Adjust if needed

  private renderer: any;
  private gl: any;
  private animationId: number = 0;
  private program: any;
  private mesh: any;

  // Mouse State
  private targetMousePos = { x: 0.5, y: 0.5 };
  private smoothMousePos = { x: 0.5, y: 0.5 };
  private targetMouseActive = 0.0;
  private smoothMouseActive = 0.0;

  constructor(
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initWebGL();
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    // Cleanup OGL
    if (this.gl) {
      const ext = this.gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    }

    window.removeEventListener('resize', this.boundResize);
    window.removeEventListener('mousemove', this.boundMouseMove);
  }

  private boundResize = () => this.resize();
  private boundMouseMove = (e: MouseEvent) => this.handleMouseMove(e);

  private initWebGL() {
    const container = this.containerRef.nativeElement;

    this.renderer = new Renderer({
      alpha: false, // We want a solid white background
      dpr: Math.min(window.devicePixelRatio, 2)
    });

    this.gl = this.renderer.gl;
    // Clear to Black for the "Original Universe" theme
    this.gl.clearColor(0, 0, 0, 1);

    container.appendChild(this.gl.canvas);

    // Geometry
    const geometry = new Triangle(this.gl);

    // Shaders
    const vertexShader = `
      attribute vec2 uv;
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
      }
    `;

    // Original Dark Galaxy Fragment Shader
    const fragmentShader = `
      precision highp float;

      uniform float uTime;
      uniform vec3 uResolution;
      uniform float uStarSpeed;
      uniform float uDensity;
      uniform vec2 uMouse;
      uniform float uMouseActiveFactor;

      varying vec2 vUv;

      #define NUM_LAYER 4.0
      #define STAR_COLOR_CUTOFF 0.2
      #define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
      #define PERIOD 3.0

      float Hash21(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float tri(float x) {
        return abs(fract(x) * 2.0 - 1.0);
      }

      float tris(float x) {
        float t = fract(x);
        return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
      }

      float trisn(float x) {
        float t = fract(x);
        return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
      }

      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }

      float Star(vec2 uv, float flare) {
        float d = length(uv);
        float m = (0.05 * 0.5) / d; // 0.5 glow intensity
        float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
        m += rays * flare * 0.5;
        uv *= MAT45;
        rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
        m += rays * 0.3 * flare * 0.5;
        m *= smoothstep(1.0, 0.2, d);
        return m;
      }

      vec3 StarLayer(vec2 uv) {
        vec3 col = vec3(0.0);
        vec2 gv = fract(uv) - 0.5; 
        vec2 id = floor(uv);

        for (int y = -1; y <= 1; y++) {
          for (int x = -1; x <= 1; x++) {
            vec2 offset = vec2(float(x), float(y));
            vec2 si = id + vec2(float(x), float(y));
            float seed = Hash21(si);
            float size = fract(seed * 345.32);
            float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
            float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

            // Original Color Logic
            float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
            float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
            float grn = min(red, blu) * seed;
            vec3 base = vec3(red, grn, blu);
            
            // HSV adjust
            float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
            hue = fract(hue + 140.0 / 360.0); // uHueShift
            float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * 0.0; // Saturation 0 for white/gray stars, or variable
            float val = max(max(base.r, base.g), base.b);
            base = hsv2rgb(vec3(hue, sat, val));

            // Pad/Movement
            vec2 pad = vec2(tris(seed * 34.0 + uTime * 1.0 / 10.0), tris(seed * 38.0 + uTime * 1.0 / 30.0)) - 0.5;

            float star = Star(gv - offset - pad, flareSize);
            
            // Twinkle
            float twinkle = trisn(uTime * 1.0 + seed * 6.2831) * 0.5 + 1.0;
            twinkle = mix(1.0, twinkle, 0.3); 
            star *= twinkle;
            
            col += star * size * base;
          }
        }
        return col;
      }

      void main() {
        vec2 uv = (vUv * uResolution.xy - 0.5 * uResolution.xy) / uResolution.y;

        // Interaction
        vec2 mouseNorm = uMouse - vec2(0.5);
        vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor; // Parallax
        uv += mouseOffset;

        // Rotation
        float autoRotAngle = uTime * 0.05;
        mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
        uv = autoRot * uv;

        vec3 col = vec3(0.0);

        for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
          float depth = fract(i + uStarSpeed * 1.0);
          float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
          float fade = depth * smoothstep(1.0, 0.9, depth);
          col += StarLayer(uv * scale + i * 453.32) * fade;
        }

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    this.program = new Program(this.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Color(this.gl.canvas.width, this.gl.canvas.height, this.gl.canvas.width / this.gl.canvas.height) },
        uStarSpeed: { value: this.starSpeed() },
        uDensity: { value: this.density() },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uMouseActiveFactor: { value: 0 }
      }
    });

    this.mesh = new Mesh(this.gl, { geometry, program: this.program });

    // Events
    window.addEventListener('resize', this.boundResize);
    window.addEventListener('mousemove', this.boundMouseMove);

    // Initial size
    this.resize();

    // Loop
    this.ngZone.runOutsideAngular(() => {
      const update = (t: number) => {
        this.animationId = requestAnimationFrame(update);

        // Time
        this.program.uniforms.uTime.value = t * 0.001;
        this.program.uniforms.uStarSpeed.value = (t * 0.001 * this.starSpeed()) / 10.0;

        // Mouse Smoothing
        const lerpFactor = 0.05;
        this.smoothMousePos.x += (this.targetMousePos.x - this.smoothMousePos.x) * lerpFactor;
        this.smoothMousePos.y += (this.targetMousePos.y - this.smoothMousePos.y) * lerpFactor;
        this.smoothMouseActive += (this.targetMouseActive - this.smoothMouseActive) * lerpFactor;

        this.program.uniforms.uMouse.value[0] = this.smoothMousePos.x;
        this.program.uniforms.uMouse.value[1] = this.smoothMousePos.y;
        this.program.uniforms.uMouseActiveFactor.value = this.smoothMouseActive;

        this.renderer.render({ scene: this.mesh });
      };
      this.animationId = requestAnimationFrame(update);
    });
  }

  private resize() {
    if (!this.renderer) return;
    const scale = 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer.setSize(width * scale, height * scale);
    if (this.program) {
      this.program.uniforms.uResolution.value = new Color(
        this.gl.canvas.width,
        this.gl.canvas.height,
        this.gl.canvas.width / this.gl.canvas.height
      );
    }
  }

  private handleMouseMove(e: MouseEvent) {
    const x = e.clientX / window.innerWidth;
    const y = 1.0 - (e.clientY / window.innerHeight);
    this.targetMousePos = { x, y };
    this.targetMouseActive = 1.0;
  }
}
