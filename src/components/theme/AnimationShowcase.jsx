import { useState } from 'react';

/**
 * AnimationShowcase Component
 * Demonstrates all theme animations in an interactive way
 */
const AnimationShowcase = () => {
  const [rippleActive, setRippleActive] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);
  const [fadeInActive, setFadeInActive] = useState(false);
  const [slideUpActive, setSlideUpActive] = useState(false);

  const triggerRipple = () => {
    setRippleActive(true);
    setTimeout(() => setRippleActive(false), 600);
  };

  const triggerPulse = () => {
    setPulseActive(true);
    setTimeout(() => setPulseActive(false), 400);
  };

  const triggerFadeIn = () => {
    setFadeInActive(false);
    setTimeout(() => setFadeInActive(true), 10);
  };

  const triggerSlideUp = () => {
    setSlideUpActive(false);
    setTimeout(() => setSlideUpActive(true), 10);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text mb-2">Animation Showcase</h2>
        <p className="text-sm text-text-secondary">
          Interactive demonstrations of all theme animations
        </p>
      </div>

      {/* Ripple Effect */}
      <div className="p-6 bg-surface rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-text mb-3">Ripple Effect</h3>
        <p className="text-sm text-text-secondary mb-4">
          Used when selecting color schemes. Click the card to see the ripple.
        </p>
        <button
          onClick={triggerRipple}
          className={`
            scheme-card relative w-full p-6 rounded-lg border-2 border-primary
            bg-gradient-to-br from-primary to-secondary
            transition-all duration-300
            ${rippleActive ? 'ripple-active' : ''}
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          `}
        >
          <span className="text-white font-semibold">Click to see ripple effect</span>
        </button>
      </div>

      {/* Pulse Animation */}
      <div className="p-6 bg-surface rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-text mb-3">Pulse Animation</h3>
        <p className="text-sm text-text-secondary mb-4">
          Confirms selection. Click the button to see the pulse.
        </p>
        <button
          onClick={triggerPulse}
          className={`
            w-full p-4 rounded-lg border-2 border-accent
            bg-accent bg-opacity-10
            transition-all duration-300
            ${pulseActive ? 'animate-pulse' : ''}
            focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
          `}
        >
          <span className="text-accent font-semibold">Click to see pulse</span>
        </button>
      </div>

      {/* Fade In Animation */}
      <div className="p-6 bg-surface rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-text mb-3">Fade In Animation</h3>
        <p className="text-sm text-text-secondary mb-4">
          Used for modal backdrops. Click to trigger.
        </p>
        <button
          onClick={triggerFadeIn}
          className="mb-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
        >
          Trigger Fade In
        </button>
        {fadeInActive && (
          <div className="animate-fade-in p-4 bg-background rounded-lg border border-border">
            <p className="text-text">This element faded in smoothly!</p>
          </div>
        )}
      </div>

      {/* Slide Up Animation */}
      <div className="p-6 bg-surface rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-text mb-3">Slide Up Animation</h3>
        <p className="text-sm text-text-secondary mb-4">
          Used for modal content. Click to trigger.
        </p>
        <button
          onClick={triggerSlideUp}
          className="mb-4 px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Trigger Slide Up
        </button>
        {slideUpActive && (
          <div className="animate-slide-up p-4 bg-background rounded-lg border border-border">
            <p className="text-text">This element slid up from below!</p>
          </div>
        )}
      </div>

      {/* Button Animations */}
      <div className="p-6 bg-surface rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-text mb-3">Button Animations</h3>
        <p className="text-sm text-text-secondary mb-4">
          Hover and click these buttons to see lift and press effects.
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="btn-lift btn-press px-6 py-3 bg-primary text-white rounded-lg font-medium transition-all duration-200 shadow-lg">
            Lift & Press
          </button>
          <button className="btn-lift px-6 py-3 bg-secondary text-white rounded-lg font-medium transition-all duration-200 shadow-lg">
            Lift Only
          </button>
          <button className="btn-press px-6 py-3 bg-accent text-white rounded-lg font-medium transition-all duration-200">
            Press Only
          </button>
        </div>
      </div>

      {/* Icon Rotation */}
      <div className="p-6 bg-surface rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-text mb-3">Icon Rotation</h3>
        <p className="text-sm text-text-secondary mb-4">
          The theme toggle button uses smooth icon rotation. Try the toggle in the header!
        </p>
        <div className="flex items-center gap-4 p-4 bg-background rounded-lg border border-border">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg
              className="theme-icon-sun absolute w-6 h-6 text-text transition-all duration-300 opacity-100 rotate-0 scale-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-text font-medium">Sun Icon (Light Mode)</p>
            <p className="text-xs text-text-secondary">Rotates 180° when switching to dark mode</p>
          </div>
        </div>
      </div>

      {/* Staggered Animations */}
      <div className="p-6 bg-surface rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-text mb-3">Staggered Animations</h3>
        <p className="text-sm text-text-secondary mb-4">
          Used in the accessibility panel. Each option slides in with a delay.
        </p>
        <div className="space-y-3">
          <div className="a11y-option p-3 bg-background rounded-lg border border-border">
            <p className="text-sm text-text">Option 1 - No delay</p>
          </div>
          <div className="a11y-option p-3 bg-background rounded-lg border border-border">
            <p className="text-sm text-text">Option 2 - 50ms delay</p>
          </div>
          <div className="a11y-option p-3 bg-background rounded-lg border border-border">
            <p className="text-sm text-text">Option 3 - 100ms delay</p>
          </div>
        </div>
      </div>

      {/* Color Transitions */}
      <div className="p-6 bg-surface rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-text mb-3">Color Transitions</h3>
        <p className="text-sm text-text-secondary mb-4">
          All colors transition smoothly (300ms). Try changing the theme mode or scheme!
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 bg-primary rounded-lg text-center">
            <p className="text-white text-sm font-medium">Primary</p>
          </div>
          <div className="p-4 bg-secondary rounded-lg text-center">
            <p className="text-white text-sm font-medium">Secondary</p>
          </div>
          <div className="p-4 bg-accent rounded-lg text-center">
            <p className="text-white text-sm font-medium">Accent</p>
          </div>
        </div>
      </div>

      {/* Performance Note */}
      <div className="p-6 bg-surface rounded-xl border border-border">
        <div className="flex items-start gap-3">
          <svg
            className="w-6 h-6 text-primary flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h4 className="text-base font-semibold text-text mb-2">
              Accessibility & Performance
            </h4>
            <p className="text-sm text-text-secondary mb-2">
              All animations respect the "Reduced Motion" setting. When enabled, animations are
              disabled for a more comfortable experience.
            </p>
            <p className="text-sm text-text-secondary">
              Animations use GPU acceleration and are optimized to prevent layout shifts and
              maintain 60fps performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationShowcase;
