import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, NgZone, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

@Component({
    selector: 'app-earth',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div #container class="earth-container"></div>
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
    .earth-container {
      width: 100%;
      height: 100%;
    }
  `]
})
export class EarthComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;

    private renderer!: THREE.WebGLRenderer;
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private earthMesh!: THREE.Mesh;
    private animationId: number | null = null;

    constructor(
        private ngZone: NgZone,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() { }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
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

        // SCENE
        this.scene = new THREE.Scene();

        // CAMERA
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.z = 10;

        // RENDERER
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(this.renderer.domElement);

        // TEXTURE
        const textureLoader = new THREE.TextureLoader();
        const MAX_ANISOTROPY = this.renderer.capabilities.getMaxAnisotropy();

        const earthTexture = textureLoader.load('assets/images/earth-high-res.png');
        earthTexture.colorSpace = THREE.SRGBColorSpace;
        earthTexture.anisotropy = MAX_ANISOTROPY; // KEY for sharpness at oblique angles

        const spaceTexture = textureLoader.load('assets/images/space-background.png');
        spaceTexture.colorSpace = THREE.SRGBColorSpace;
        this.scene.background = spaceTexture;

        // MESH (Sphere) - High Poly
        const geometry = new THREE.SphereGeometry(5, 128, 128);
        const material = new THREE.MeshStandardMaterial({
            map: earthTexture,
            roughness: 0.4, // Glossier for sharper reflections
            metalness: 0.5, // Higher metalness for contrast
            emissive: new THREE.Color(0x111111), // Slight self-illumination for cities
            emissiveMap: earthTexture, // Use same texture for emissive to make cities pop
            emissiveIntensity: 0.5
        });
        this.earthMesh = new THREE.Mesh(geometry, material);

        // Position: Push it down so mainly the top arc is visible at the bottom of the screen
        this.earthMesh.position.y = -4.5;

        this.scene.add(this.earthMesh);

        // LIGHTING
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // Dim global light
        this.scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
        sunLight.position.set(5, 3, 5); // Side/Top lighting
        this.scene.add(sunLight);

        const rimLight = new THREE.PointLight(0x495057, 20, 100); // Slate glow
        rimLight.position.set(-5, 0, 5);
        this.scene.add(rimLight);

        // START LOOP
        this.ngZone.runOutsideAngular(() => {
            window.addEventListener('scroll', this.onScroll.bind(this));
            window.addEventListener('resize', this.onResize.bind(this));
            this.animate();
        });
    }

    private onScroll() {
        if (this.earthMesh) {
            const scrollY = window.scrollY;
            // Rotate Earth based on scroll
            this.earthMesh.rotation.y = scrollY * 0.002;
        }
    }

    private onResize() {
        if (!this.camera || !this.renderer || !this.containerRef) return;

        const container = this.containerRef.nativeElement;
        const width = container.clientWidth;
        const height = container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    private animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Optional: Slow idle rotation
        if (this.earthMesh) {
            this.earthMesh.rotation.y += 0.0002;
        }

        this.renderer.render(this.scene, this.camera);
    }

    private cleanup() {
        if (isPlatformBrowser(this.platformId)) {
            window.removeEventListener('scroll', this.onScroll);
            window.removeEventListener('resize', this.onResize);

            if (this.animationId) cancelAnimationFrame(this.animationId);

            if (this.renderer) {
                this.renderer.dispose();
                const domElement = this.renderer.domElement;
                if (domElement && domElement.parentNode) {
                    domElement.parentNode.removeChild(domElement);
                }
            }
        }
    }
}
