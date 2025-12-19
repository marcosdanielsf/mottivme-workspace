# MetroFlex Events - Premium Design System
**"Steel & Neon Championship Arena"**

## Color Palette

### Primary Colors
```css
:root {
  /* Deep Blacks (Surface Layers) */
  --mf-black-deepest: #000000;
  --mf-black-deep: #0A0E14;
  --mf-black-surface: #141414;
  --mf-black-elevated: #1F1F1F;

  /* MetroFlex Championship Red */
  --mf-red-primary: #C41E3A;      /* Primary brand red */
  --mf-red-light: #DC2626;        /* Hover/active state */
  --mf-red-dark: #991B2E;         /* Pressed state */
  --mf-red-glow: #FF1744;         /* Neon glow accent */
  --mf-red-alpha-10: rgba(196, 30, 58, 0.1);
  --mf-red-alpha-20: rgba(196, 30, 58, 0.2);
  --mf-red-alpha-40: rgba(196, 30, 58, 0.4);

  /* Steel Chrome Scale */
  --mf-steel-100: #FFFFFF;        /* Pure white */
  --mf-steel-95: #F5F5F5;         /* Off-white */
  --mf-steel-90: #E3E7EB;         /* Light steel */
  --mf-steel-80: #C2C8CF;         /* Steel */
  --mf-steel-70: #A8AFB6;         /* Mid steel */
  --mf-steel-60: #8E959D;         /* Dark steel */
  --mf-steel-50: #7B848E;         /* Darkest steel */

  /* Championship Gold (Accents) */
  --mf-gold: #FFD700;
  --mf-gold-dark: #DAA520;
  --mf-gold-alpha-20: rgba(255, 215, 0, 0.2);

  /* Semantic Colors */
  --mf-success: #10B981;          /* Green for confirmations */
  --mf-warning: #F59E0B;          /* Amber for alerts */
  --mf-error: #EF4444;            /* Red for errors */
  --mf-info: #3B82F6;             /* Blue for information */
}
```

### Gradient System
```css
/* Background Gradients */
--mf-gradient-hero: linear-gradient(135deg,
  var(--mf-red-primary) 0%,
  var(--mf-black-deep) 50%,
  var(--mf-black-surface) 100%);

--mf-gradient-card: linear-gradient(135deg,
  var(--mf-black-surface) 0%,
  var(--mf-black-elevated) 100%);

--mf-gradient-metal: linear-gradient(135deg,
  var(--mf-steel-80) 0%,
  var(--mf-steel-60) 50%,
  var(--mf-steel-80) 100%);

--mf-gradient-gold: linear-gradient(135deg,
  var(--mf-gold) 0%,
  var(--mf-gold-dark) 100%);

--mf-gradient-red-glow: radial-gradient(circle,
  var(--mf-red-alpha-40) 0%,
  transparent 70%);
```

### Shadow System
```css
/* Elevation Shadows */
--mf-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.4);
--mf-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.5);
--mf-shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.6);
--mf-shadow-xl: 0 16px 64px rgba(0, 0, 0, 0.7);
--mf-shadow-2xl: 0 24px 96px rgba(0, 0, 0, 0.8);

/* Glow Effects */
--mf-glow-red-sm: 0 0 10px var(--mf-red-alpha-40);
--mf-glow-red-md: 0 0 20px var(--mf-red-alpha-40);
--mf-glow-red-lg: 0 0 40px var(--mf-red-alpha-40);
--mf-glow-gold: 0 0 30px var(--mf-gold-alpha-20);
```

## Typography System

### Font Families
```css
/* Headline Font - Athletic, Bold */
--mf-font-display: 'Bebas Neue', 'Arial Black', 'Impact', sans-serif;

/* Alternative Headlines - Premium, Tech */
--mf-font-alt: 'Eurostile', 'Bank Gothic', 'Orbitron', sans-serif;

/* Body Font - Clean, Readable */
--mf-font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace - Data, Stats */
--mf-font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

### Type Scale
```css
/* Display Sizes (Headlines) */
--mf-text-display-xl: 96px;   /* Hero headlines */
--mf-text-display-lg: 72px;   /* Section heroes */
--mf-text-display-md: 56px;   /* Page titles */
--mf-text-display-sm: 48px;   /* Card titles */

/* Heading Sizes */
--mf-text-h1: 40px;
--mf-text-h2: 32px;
--mf-text-h3: 24px;
--mf-text-h4: 20px;
--mf-text-h5: 18px;
--mf-text-h6: 16px;

/* Body Sizes */
--mf-text-body-lg: 18px;
--mf-text-body-md: 16px;
--mf-text-body-sm: 14px;
--mf-text-body-xs: 12px;

/* Line Heights */
--mf-leading-tight: 1.1;
--mf-leading-snug: 1.3;
--mf-leading-normal: 1.6;
--mf-leading-relaxed: 1.8;

/* Letter Spacing */
--mf-tracking-tighter: -0.05em;
--mf-tracking-tight: -0.025em;
--mf-tracking-normal: 0em;
--mf-tracking-wide: 0.05em;
--mf-tracking-wider: 0.1em;
--mf-tracking-widest: 0.2em;

/* Font Weights */
--mf-font-normal: 400;
--mf-font-medium: 500;
--mf-font-semibold: 600;
--mf-font-bold: 700;
--mf-font-black: 900;
```

### Typography Classes
```css
.mf-display-xl {
  font-family: var(--mf-font-display);
  font-size: var(--mf-text-display-xl);
  line-height: var(--mf-leading-tight);
  letter-spacing: var(--mf-tracking-wide);
  text-transform: uppercase;
}

.mf-display-lg {
  font-family: var(--mf-font-display);
  font-size: var(--mf-text-display-lg);
  line-height: var(--mf-leading-tight);
  letter-spacing: var(--mf-tracking-wide);
  text-transform: uppercase;
}

.mf-eyebrow {
  font-family: var(--mf-font-body);
  font-size: var(--mf-text-body-sm);
  font-weight: var(--mf-font-bold);
  letter-spacing: var(--mf-tracking-widest);
  text-transform: uppercase;
  color: var(--mf-red-primary);
}

.mf-body-lg {
  font-family: var(--mf-font-body);
  font-size: var(--mf-text-body-lg);
  line-height: var(--mf-leading-normal);
  color: var(--mf-steel-80);
}
```

## Spacing System (8px Grid)

```css
--mf-space-1: 8px;
--mf-space-2: 16px;
--mf-space-3: 24px;
--mf-space-4: 32px;
--mf-space-5: 40px;
--mf-space-6: 48px;
--mf-space-8: 64px;
--mf-space-10: 80px;
--mf-space-12: 96px;
--mf-space-16: 128px;
--mf-space-20: 160px;
--mf-space-24: 192px;
```

## Border Radius

```css
--mf-radius-sm: 4px;
--mf-radius-md: 8px;
--mf-radius-lg: 12px;
--mf-radius-xl: 16px;
--mf-radius-2xl: 24px;
--mf-radius-full: 9999px;
```

## Animation & Transitions

### Timing Functions
```css
--mf-ease-in: cubic-bezier(0.4, 0, 1, 1);
--mf-ease-out: cubic-bezier(0, 0, 0.2, 1);
--mf-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--mf-ease-elastic: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Durations
```css
--mf-duration-fast: 150ms;
--mf-duration-base: 300ms;
--mf-duration-slow: 500ms;
--mf-duration-slower: 800ms;
```

### Standard Transitions
```css
--mf-transition-base: all var(--mf-duration-base) var(--mf-ease-in-out);
--mf-transition-fast: all var(--mf-duration-fast) var(--mf-ease-out);
--mf-transition-slow: all var(--mf-duration-slow) var(--mf-ease-in-out);
```

## Component Patterns

### Button Styles

**Primary Button (CTA)**
```css
.btn-primary {
  background: var(--mf-red-primary);
  color: var(--mf-steel-100);
  padding: 16px 40px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: var(--mf-radius-md);
  border: none;
  box-shadow: var(--mf-glow-red-md);
  transition: var(--mf-transition-base);
  cursor: pointer;
}

.btn-primary:hover {
  background: var(--mf-red-light);
  transform: translateY(-2px);
  box-shadow: var(--mf-glow-red-lg);
}

.btn-primary:active {
  background: var(--mf-red-dark);
  transform: translateY(0);
}
```

**Secondary Button**
```css
.btn-secondary {
  background: transparent;
  color: var(--mf-steel-95);
  padding: 16px 40px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: var(--mf-radius-md);
  border: 2px solid var(--mf-steel-95);
  transition: var(--mf-transition-base);
  cursor: pointer;
}

.btn-secondary:hover {
  background: var(--mf-red-alpha-10);
  border-color: var(--mf-red-primary);
  color: var(--mf-red-primary);
}
```

**Gold Button (Premium/Championship)**
```css
.btn-gold {
  background: var(--mf-gradient-gold);
  color: var(--mf-black-deepest);
  padding: 16px 40px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: var(--mf-radius-md);
  border: none;
  box-shadow: var(--mf-glow-gold);
  transition: var(--mf-transition-base);
  cursor: pointer;
}

.btn-gold:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 40px var(--mf-gold-alpha-20);
}
```

### Card Styles

**Standard Card**
```css
.mf-card {
  background: var(--mf-gradient-card);
  border: 2px solid var(--mf-red-alpha-20);
  border-radius: var(--mf-radius-xl);
  padding: var(--mf-space-6);
  transition: var(--mf-transition-base);
}

.mf-card:hover {
  border-color: var(--mf-red-primary);
  transform: translateY(-8px);
  box-shadow: var(--mf-shadow-xl), var(--mf-glow-red-md);
}
```

**3D Card (Premium)**
```css
.mf-card-3d {
  background: var(--mf-gradient-card);
  border: 2px solid var(--mf-red-alpha-20);
  border-radius: var(--mf-radius-xl);
  padding: var(--mf-space-6);
  transition: transform var(--mf-duration-slow) var(--mf-ease-in-out);
  transform-style: preserve-3d;
  perspective: 1000px;
}

.mf-card-3d:hover {
  transform: rotateY(5deg) rotateX(5deg) translateY(-8px);
  border-color: var(--mf-red-primary);
  box-shadow: var(--mf-shadow-2xl), var(--mf-glow-red-lg);
}
```

## Responsive Breakpoints

```css
/* Mobile First */
--mf-screen-sm: 640px;   /* Small tablets, large phones */
--mf-screen-md: 768px;   /* Tablets */
--mf-screen-lg: 1024px;  /* Laptops */
--mf-screen-xl: 1280px;  /* Desktops */
--mf-screen-2xl: 1536px; /* Large desktops */
```

## Special Effects

### Glitch Text Effect
```css
.mf-glitch {
  position: relative;
  animation: glitch 3s infinite;
}

@keyframes glitch {
  0%, 90%, 100% {
    transform: translate(0);
  }
  92% {
    transform: translate(-2px, 2px);
  }
  94% {
    transform: translate(2px, -2px);
  }
  96% {
    transform: translate(-2px, 2px);
  }
}
```

### Neon Pulse
```css
.mf-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: var(--mf-glow-red-md);
  }
  50% {
    box-shadow: var(--mf-glow-red-lg);
  }
}
```

### Shimmer Effect
```css
.mf-shimmer {
  background: linear-gradient(
    90deg,
    var(--mf-steel-70) 0%,
    var(--mf-steel-90) 50%,
    var(--mf-steel-70) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

## Usage Guidelines

### Do's ✅
- Use Bebas Neue for ALL headlines (uppercase, wide letter-spacing)
- Apply red glow effects to primary CTAs
- Maintain 8px spacing grid
- Use 3D card effects for premium content
- Add subtle animations on scroll/hover
- Keep backgrounds dark with high contrast text

### Don'ts ❌
- Never use lightweight fonts (minimum 400 weight)
- Avoid pure white backgrounds (use steel scale)
- Don't mix rounded and sharp corners
- Never use gradients on body text
- Avoid cluttered animations (subtle only)
- Don't break the 8px grid system

## Accessibility

- **Minimum contrast ratio**: 4.5:1 for body text, 3:1 for large text
- **Focus indicators**: 2px solid red outline
- **Touch targets**: Minimum 44x44px
- **Reduced motion**: Respect `prefers-reduced-motion` media query

---

**Design System Version**: 1.0
**Last Updated**: November 2025
**Brand**: MetroFlex Events - "Where Champions Are Made"
