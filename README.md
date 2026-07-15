# ELEVÉ | Luxury Travel & Tourism Portal

An immersive, high-end travel booking web application built with **React** and **Vite**. **ELEVÉ** showcases elite global travel coordinates, featuring customized dark-aesthetic layouts, fluid micro-interactions, responsive sidebars, and high-performance canvas animations.

---

## 🌌 Key Highlights & Features

1. **Interactive Top Destinations Showcase (Home)**
   - **Shifting Charcoal & Gold Backdrops**: Features a luxury linear gradient (`#090909`, `#151515`, `#261f12`, `#0d0c0b`) matching the elite ELEVÉ theme.
   - **Atmospheric Glow Effects**: Incorporates radial gold light highlights behind active cards for visual depth.
   - **Glassmorphic Navigation Controls**: Circular arrow navigation blocks with gold outlines and animated fill transitions.

2. **Advanced Client Refinement System (Destinations)**
   - **Elongated Curved Search Bar**: Features pill-shaped search input wrappers with premium shadows and gold outlines on focus.
   - **Tabbed Categories**: Minimalist textual category navigation tabs with sliding gold underline transitions.
   - **Refinement Control Bar**: Side-by-side dropdown filter panels (Rating, Price, and Sorting Option) with mutual exclusion logic.

3. **High-End Details & Booking Action Cards**
   - **Widescreen Media Spacing**: Taller majestically proportioned details frames (`520px` height) with a `g-5` layout gutter to keep elements spacious and premium.
   - **Micro-Animations & Hover Zoom**: Subtle `1.03x` scale zooms on gallery cards and active gold outlines on thumbnails.
   - **Contrast & Legibility Fixes**: Features warm brand-gold (`#c5a059`) text overlays on dark backdrops, guaranteeing high contrast.
   - **Snug Non-Wrapping Layout**: Added `white-space: nowrap` filters to prevent CTA action labels from wrapping inside responsive columns.

4. **Fluid Canvas Scroll Animation**
   - Implements a frame-by-frame scroll animation in the hero section using 192 high-resolution image frames preloaded onto a dynamic HTML5 2D canvas, creating a cinematic parallax effect.

5. **Fluid Scrolling Text Banners**
   - Incorporates scroll-inertia based running text banners to enhance page engagement.

---

## 🛠 Tech Stack

- **Framework**: React 19 (Hooks, Suspense, Lazy Loading)
- **Routing**: React Router 7
- **Bundler**: Vite 8
- **Styling**: Vanilla CSS (CSS Variables Design Tokens) & Bootstrap 5
- **Icons**: Bootstrap Icons

---

## 📐 Project Structure & Architecture

- `src/components/`: Reusable modular elements (e.g., custom headers, footers, interactive scroll velocity, and canvas hero).
- `src/pages/`: Page containers (Home, Destinations, Details, Booking, Payment, Profile, Analytics, Auth).
- `src/data/`: Static client data mocks for destinations and analytics.
- `public/`: Public-served assets including the preloaded hero animation frames.

---

## ⚙️ Development & Build Specifications

### Local Setup
- Dependency installation: `npm install`
- Development environment: `npm run dev`
- Production compilation: `npm run build` (outputs optimized bundle to `dist/`)
