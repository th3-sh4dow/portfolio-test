# Premium Portfolio Website

A modern, Apple-inspired portfolio website with **cinematic scroll animations**, built with Next.js, TypeScript, and Framer Motion.

## 🎬 Cinematic Scroll Animation

Features a stunning **1648-frame** image sequence that plays smoothly as you scroll, creating an immersive Apple-style experience.

## ✨ Features

### Apple-Inspired Design
- **Premium Typography**: Inter font with Apple-style letter spacing and weights
- **Glass Morphism**: Subtle backdrop blur effects and transparency
- **Smooth Animations**: 60fps scroll-triggered animations with Framer Motion
- **Responsive Design**: Seamless experience across all devices
- **Cinematic Scroll**: 1648 high-quality frames for ultra-smooth scrolling

### Modern Tech Stack
- **Next.js 16**: Latest React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling with custom design system
- **Framer Motion**: Advanced animations and scroll effects
- **Canvas API**: High-performance image sequence rendering

### Key Improvements

#### 🎨 Visual Design
- Apple-inspired color palette (#007AFF blue, #5856D6 purple)
- Premium glass morphism effects
- Smooth gradient backgrounds
- Professional typography hierarchy
- Cinematic scroll experience with 1648 frames

#### 🚀 Performance
- Progressive image loading strategy
- Optimized canvas rendering with device pixel ratio
- Efficient frame caching
- Smooth 60fps animations
- Loading progress indicator

#### 📱 User Experience
- Smooth scroll-triggered animations
- Interactive navigation with mobile menu
- Hover effects and micro-interactions
- Real-time loading feedback
- Responsive across all devices

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Generate frame map** (if you update images)
   ```bash
   node generate-frame-map.js
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Build for production**
   ```bash
   pnpm build
   ```

### Project Structure

```
app/
├── components/
│   ├── NavBar.tsx          # Navigation with glass morphism
│   ├── HeroSection.tsx     # Landing hero section
│   ├── ScrollSequence.tsx  # 1648-frame scroll animation
│   ├── TextSection.tsx     # Scroll-triggered text sections
│   ├── FeatureCard.tsx     # Feature showcase cards
│   └── ProjectCard.tsx     # Portfolio project cards
├── globals.css             # Global styles and design system
├── layout.tsx              # Root layout with Inter font
└── page.tsx               # Main page composition

public/
├── hero-intro/             # 1648 image frames (0001_0.jpeg - 1648_4.jpeg)
└── frame-map.json          # Generated frame mapping file

generate-frame-map.js       # Script to map frame filenames
```

## 🎯 Image Sequence Setup

The scroll animation uses **1648 frames** for ultra-smooth playback:

1. Place your image sequence in `public/hero-intro/`
2. Run `node generate-frame-map.js` to create the frame mapping
3. The component automatically loads frames progressively

**Frame Loading Strategy:**
- First 150 frames: Immediate load (for instant playback)
- Frames 150-400: Early scroll section
- Frames 400-800: Quarter point
- Frames 800-1200: Mid point
- Frames 1200-1648: End section

## 🎨 Design Philosophy

This portfolio follows Apple's design principles:

- **Simplicity**: Clean, uncluttered interfaces
- **Clarity**: Clear visual hierarchy and typography
- **Depth**: Subtle shadows and layering with glass morphism
- **Motion**: Purposeful, smooth 60fps animations
- **Delight**: Cinematic scroll experience that engages users

## 🔧 Customization

### Colors
The design system uses CSS custom properties:

```css
--color-primary: #007AFF;     /* Apple Blue */
--color-secondary: #5856D6;   /* Apple Purple */
--color-accent: #FF9500;      /* Apple Orange */
```

### Typography
Three main text styles:
- `text-display`: Large headings with tight spacing (-0.02em)
- `text-headline`: Section headings (-0.01em)
- `text-body`: Body text with optimal line height (1.6)

### Animations
All animations use Apple's preferred easing:
```css
cubic-bezier(0.4, 0, 0.2, 1)
```

### Scroll Animation
Adjust smoothness in `ScrollSequence.tsx`:
```typescript
const smoothProgress = useSpring(scrollYProgress, {
  stiffness: 60,   // Higher = snappier
  damping: 20,     // Higher = less bounce
  mass: 0.5,       // Lower = more responsive
});
```

## 📊 Performance Tips

- **Image Optimization**: Use optimized JPEGs (quality 80-85)
- **Frame Count**: 1648 frames provides 60fps feel at 30 seconds
- **Loading Strategy**: Progressive loading prevents memory issues
- **Canvas Rendering**: Uses device pixel ratio for crisp display

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using Next.js, TypeScript, and Apple's design principles.
