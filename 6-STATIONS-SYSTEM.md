# 6 Stations Character Animation System

## Overview
The portfolio uses a 6-station system where the 3D character performs different actions based on scroll position. Each station corresponds to a section of the portfolio and specific frame ranges.

## Station Breakdown

### Station 1: Hero/Intro (Frames 0-347)
**Character Action:** `idle`
- **Behavior:** Character stands in center, breathing animation
- **Movement:** Stationary (no movement)
- **UI Elements:** Large "BICKY MUDULI" text, Sparkle icon
- **Trigger:** Page load → Auto-play intro animation

### Station 2: About (Frames 348-404)
**Character Action:** `walk_start`
- **Behavior:** Character transitions from idle to walking
- **Movement:** Center → Right side of screen
- **UI Elements:** Navbar slides down, "ABOUT ME" glass card reveals
- **Trigger:** First scroll after intro

### Station 3: Skills (Frames 405-580)
**Character Action:** `walking`
- **Behavior:** Character continues walking (walking loop)
- **Movement:** Right side → Further right/center focus
- **UI Elements:** Tech icons (React, Python, Shield) float around character
- **Scroll Sync:** Walking speed synced with scroll speed

### Station 4: Projects (Frames 732-1135)
**Character Action:** `stop_observe`
- **Behavior:** Character stops walking and observes project cards
- **Movement:** Stationary (stopped walking)
- **Pose:** Standing with confidence, looking at projects
- **UI Elements:** Project cards horizontal scroll

### Station 5: Experience (Frames 1135-1364)
**Character Action:** `attitude_pose`
- **Behavior:** Character crosses arms and puts on sunglasses
- **Movement:** Stationary (cool/hacker attitude pose)
- **Pose:** Confident, professional attitude
- **UI Elements:** Experience timeline/cards

### Station 6: Contact (Frames 1430-1648)
**Character Action:** `sit_work`
- **Behavior:** Character walks to desk and sits down
- **Movement:** Standing → Walking to desk → Sitting
- **Final State:** Typing on keyboard (working loop)
- **UI Elements:** Computer screens activate, Contact form appears

## Technical Implementation

### Frame Mapping
```javascript
const STATIONS = {
  HERO: { start: 0, end: 347, action: 'idle' },
  ABOUT: { start: 348, end: 404, action: 'walk_start' },
  SKILLS: { start: 405, end: 580, action: 'walking' },
  PROJECTS: { start: 732, end: 1135, action: 'stop_observe' },
  EXPERIENCE: { start: 1135, end: 1364, action: 'attitude_pose' },
  CONTACT: { start: 1430, end: 1648, action: 'sit_work' }
};
```

### Animation Speed
- **Auto-play (Intro):** 24 FPS (cinematic)
- **Scroll Animation:** 30 FPS (smooth)
- **Frame Throttling:** Prevents rapid frame jumps

### Visual Indicators
1. **Station Progress Bar:** Shows current station (1-6)
2. **Frame Counter:** Current frame / Total frames
3. **Character Action:** Current action being performed
4. **Station Name:** Which section user is viewing

## Character Flow Summary
1. **Idle** → Standing and breathing
2. **Walk Start** → Begins walking transition
3. **Walking** → Continuous walking loop
4. **Stop & Observe** → Stops and looks at content
5. **Attitude Pose** → Cool professional pose
6. **Sit & Work** → Final working state

## Benefits
- **Narrative Flow:** Character journey matches user journey
- **Visual Feedback:** Clear indication of progress through portfolio
- **Smooth Transitions:** Controlled animation between sections
- **Performance:** Optimized frame loading and rendering
- **Debug Info:** Real-time feedback for development

This system creates a cohesive, interactive experience where the character's actions enhance the storytelling aspect of the portfolio.