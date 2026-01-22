# Portfolio Website Structure

## Frame Breakdown (Based on Your Sketches)

### Total Frames: 1648 frames

### Section Mapping:

1. **Frames 0-187**: Auto-play intro animation (120 FPS)
   - Plays automatically on page load
   - Ultra-smooth animation

2. **Frames 0-347**: Hero Section
   - Initial landing view
   - Scroll starts here

3. **Frames 348-404**: About Section (57 frames)
   - Personal introduction
   - Avatar/profile display
   - Skills tags
   - GSAP animations: fade in, slide from left

4. **Frames 405-500**: Skills Section (95 frames)
   - Skill bars with percentages
   - Animated progress bars
   - GSAP animations: stagger effect, bar fill animation

5. **Frames 500-580**: Skills End Transition (80 frames)
   - Smooth transition space

6. **Frames 732-1135**: Projects Section (403 frames)
   - Project cards grid
   - Hover effects
   - GSAP animations: 3D card flip, scale on hover

7. **Frames 1135-1364**: Experience Section (229 frames)
   - Timeline layout
   - Work history
   - GSAP animations: timeline reveal, alternate sides

8. **Frames 1364-1429**: Hold for Contact (65 frames)
   - Transition space

9. **Frames 1430-1648**: Contact Section (218 frames)
   - Contact form
   - Social links
   - "Let's Connect" heading
   - GSAP animations: form slide up, social icons pop

## Components Structure

```
app/
├── components/
│   ├── sections/
│   │   ├── AboutSection.tsx       # Frames 348-404
│   │   ├── SkillsSection.tsx      # Frames 405-500
│   │   ├── ProjectsSection.tsx    # Frames 732-1135
│   │   ├── ExperienceSection.tsx  # Frames 1135-1364
│   │   └── ContactSection.tsx     # Frames 1430-1648
│   ├── Loading/
│   │   └── Loading_Name.tsx       # Initial loader
│   ├── IntroSequence.tsx          # Manages intro flow
│   ├── ScrollSequence.tsx         # Background frame animation
│   └── NavBar.tsx                 # Fixed navigation
├── page.tsx                       # Main page orchestration
└── layout.tsx                     # Root layout

public/
└── hero-intro/                    # 1648 frame images
    ├── 0001_0.jpeg
    ├── 0002_4.jpeg
    └── ... (all frames)
```

## GSAP Animations

### AboutSection
- Title: Fade in + slide up
- Content: Slide from left
- Avatar: Scale + fade in
- Trigger: ScrollTrigger at 70% viewport

### SkillsSection
- Title: Scale + rotate
- Skill bars: Stagger animation
- Progress fill: Width animation
- Percentages: Fade in
- Trigger: ScrollTrigger at 60% viewport

### ProjectsSection
- Title: Slide from top
- Cards: 3D rotate + fade in
- Hover: Scale up effect
- Stagger: 0.2s delay between cards
- Trigger: ScrollTrigger per card

### ExperienceSection
- Title: 3D rotate Y-axis
- Timeline items: Alternate left/right
- Dots: Pulse effect
- Stagger: 0.3s delay
- Trigger: ScrollTrigger per item

### ContactSection
- Title: Scale + rotate with bounce
- Form: Slide up
- Social links: Pop in with stagger
- Trigger: ScrollTrigger at 60% viewport

## Key Features

1. **Smooth Scroll-Driven Animation**
   - Background frames sync with scroll
   - 120 FPS auto-play intro
   - Smooth transitions between sections

2. **GSAP ScrollTrigger**
   - Each section animates on scroll
   - Reverse animations when scrolling up
   - Optimized performance

3. **Responsive Design**
   - Mobile-first approach
   - Tailwind CSS utilities
   - Glassmorphism effects

4. **Performance Optimized**
   - Image preloading strategy
   - Priority loading for auto-play frames
   - Canvas rendering for frames

## How to Run

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## Technologies Used

- **Next.js 16**: React framework
- **TypeScript**: Type safety
- **GSAP**: Advanced animations
- **Tailwind CSS**: Styling
- **Framer Motion**: Additional animations
- **Canvas API**: Frame rendering

## Design Philosophy

Based on your sketches:
- Clean, minimal design
- Focus on content
- Smooth animations
- Professional look
- Easy navigation
- Clear call-to-actions

## Notes

- All frame numbers are exact as per your breakdown
- GSAP animations are smooth and performant
- Sections are properly spaced
- Navigation is sticky and responsive
- Contact form is functional (needs backend integration)
