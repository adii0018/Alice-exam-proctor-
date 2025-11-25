# Theme Animations and Transitions

This document describes the animations and transitions implemented for the theme customization system.

## Overview

The theme system includes smooth, performant animations that enhance the user experience while respecting accessibility preferences. All animations automatically disable when the user enables "Reduced Motion" mode.

## Animation Types

### 1. Modal Animations

**Fade-in Effect for Theme Settings Modal**
- **Duration**: 200ms
- **Timing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Effect**: Backdrop fades in smoothly
- **Class**: `.theme-modal-backdrop`

**Slide-up Effect for Modal Content**
- **Duration**: 300ms
- **Timing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Effect**: Modal content slides up from below with fade
- **Class**: `.theme-modal-content`

### 2. Theme Toggle Animations

**Sun/Moon Icon Rotation**
- **Duration**: 300ms
- **Timing**: ease-in-out
- **Effect**: Icons rotate 180° while fading in/out and scaling
- **Classes**: `.theme-icon-sun`, `.theme-icon-moon`

**Features**:
- Sun icon rotates clockwise when switching to dark mode
- Moon icon rotates counter-clockwise when switching to light mode
- Smooth opacity and scale transitions
- Button press effect on click

**Button Hover Effect**
- **Duration**: 200ms
- **Effect**: Subtle glow shadow appears on hover
- **Class**: `.theme-toggle-button:hover`

### 3. Color Scheme Picker Animations

**Ripple Effect on Selection**
- **Duration**: 600ms
- **Timing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Effect**: Circular ripple emanates from center when scheme is selected
- **Class**: `.scheme-card.ripple-active::after`

**Pulse Animation on Selection**
- **Duration**: 400ms
- **Effect**: Selected card pulses briefly to confirm selection
- **Class**: `.scheme-card-selected`

**Hover Scale Effect**
- **Duration**: 200ms
- **Effect**: Color swatches scale up slightly on hover
- **Class**: `.scheme-swatch:hover`

### 4. Accessibility Panel Animations

**Staggered Slide-in**
- **Duration**: 300ms per item
- **Delay**: 50ms, 100ms, 150ms for each option
- **Effect**: Options slide up sequentially
- **Class**: `.a11y-option`

**Toggle Switch Animation**
- **Duration**: 200ms
- **Effect**: Smooth background color and handle position transition
- **Classes**: `.toggle-switch`, `.toggle-switch-handle`

### 5. Preview Panel Animations

**Update Pulse**
- **Duration**: 300ms
- **Effect**: Preview panel pulses when theme changes
- **Class**: `.theme-preview-update`

### 6. Button Animations

**Lift Effect**
- **Duration**: 200ms
- **Effect**: Button lifts up 2px with enhanced shadow on hover
- **Class**: `.btn-lift`

**Press Effect**
- **Duration**: 100ms
- **Effect**: Button scales down to 98% on click
- **Class**: `.btn-press`

### 7. Color Transitions

**Smooth Color Changes**
- **Duration**: 300ms
- **Timing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Properties**: background-color, border-color, color, box-shadow
- **Class**: `.theme-transition`

**Interactive Element Transitions**
- **Duration**: 200ms
- **Additional**: transform property for interactive feedback
- **Class**: `.theme-transition-interactive`

## Accessibility Features

### Reduced Motion Support

All animations respect the user's motion preferences through two mechanisms:

1. **System Preference Detection**
   ```css
   @media (prefers-reduced-motion: reduce) {
     /* All animations disabled */
   }
   ```

2. **Manual Setting**
   ```css
   [data-reduced-motion="true"] {
     /* All animations disabled */
   }
   ```

When reduced motion is enabled:
- Animation durations set to 0.01ms
- Transform effects disabled
- Only essential state changes remain (instant)

### Focus Indicators

All interactive elements maintain visible focus indicators that animate smoothly:
- **Duration**: 200ms
- **Effect**: Ring appears around focused element
- **Respects**: Reduced motion preference

## Performance Optimizations

### GPU Acceleration

Key animated elements use `will-change` property:
- Modal content
- Scheme cards
- Theme toggle button
- Lift buttons

### Cleanup

The `will-change` property is removed after animations complete using the `.animation-complete` class to prevent unnecessary GPU usage.

### Debouncing

Theme preview updates are debounced to prevent excessive re-renders during rapid changes.

## Usage Examples

### Adding Fade-in to Custom Components

```jsx
<div className="animate-fade-in">
  Your content here
</div>
```

### Adding Ripple Effect to Buttons

```jsx
<button className="scheme-card ripple-active">
  Click me
</button>
```

### Adding Lift Effect to Buttons

```jsx
<button className="btn-lift btn-press">
  Hover and click me
</button>
```

### Staggered Animations

```jsx
<div className="a11y-option animate-delay-100">Option 1</div>
<div className="a11y-option animate-delay-200">Option 2</div>
<div className="a11y-option animate-delay-300">Option 3</div>
```

## Animation Timing Reference

| Animation | Duration | Timing Function | Use Case |
|-----------|----------|----------------|----------|
| Modal backdrop | 200ms | ease-out | Quick fade-in |
| Modal content | 300ms | ease-out | Smooth slide-up |
| Icon rotation | 300ms | ease-in-out | Theme toggle |
| Ripple effect | 600ms | ease-out | Selection feedback |
| Pulse | 400ms | ease-in-out | Confirmation |
| Hover scale | 200ms | ease-out | Interactive feedback |
| Color transition | 300ms | ease-in-out | Theme changes |
| Button lift | 200ms | ease-out | Hover effect |
| Button press | 100ms | ease-out | Click feedback |
| Toggle switch | 200ms | ease-out | State change |

## Browser Compatibility

All animations use standard CSS properties with excellent browser support:
- `transform`: 99%+ support
- `opacity`: 99%+ support
- `transition`: 99%+ support
- `animation`: 99%+ support
- `@keyframes`: 99%+ support

## Testing

To test animations:

1. **Normal Mode**: All animations should be smooth and visible
2. **Reduced Motion**: Enable in system settings or theme panel - animations should be instant
3. **Performance**: Check DevTools Performance tab - animations should not cause layout thrashing
4. **Accessibility**: Test with keyboard navigation - focus indicators should animate smoothly

## Customization

To customize animation durations, modify the CSS variables in `theme-variables.css`:

```css
:root {
  --transition-duration: 300ms;
  --transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Future Enhancements

Potential additions for future versions:
- Spring physics for more natural motion
- Gesture-based animations for mobile
- Parallax effects for depth
- Micro-interactions for form elements
- Loading skeleton animations
