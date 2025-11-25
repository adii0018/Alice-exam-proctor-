import { useEffect, useRef } from 'react';
import './LightDayBackground.css';

/**
 * LightDayBackground Component
 * Beautiful animated background for light theme
 * Features: Floating particles, gradient waves, subtle animations
 */
export default function LightDayBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
        
        // Random colors - soft pastels
        const colors = [
          'rgba(59, 130, 246, ', // Blue
          'rgba(139, 92, 246, ', // Purple
          'rgba(236, 72, 153, ', // Pink
          'rgba(16, 185, 129, ', // Green
          'rgba(245, 158, 11, ', // Amber
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;

        // Pulse opacity
        this.opacity += Math.sin(Date.now() * 0.001) * 0.002;
        if (this.opacity > 0.7) this.opacity = 0.7;
        if (this.opacity < 0.1) this.opacity = 0.1;
      }

      draw() {
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color + '0.5)';
      }
    }

    // Create particles
    const particleCount = 80;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      // Clear with slight trail effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connecting lines between nearby particles
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Animated gradient background */}
      <div className="light-day-gradient-bg" />
      
      {/* Floating orbs */}
      <div className="light-day-orbs">
        <div className="light-orb light-orb-1" />
        <div className="light-orb light-orb-2" />
        <div className="light-orb light-orb-3" />
        <div className="light-orb light-orb-4" />
      </div>

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="light-day-canvas"
      />

      {/* Animated waves */}
      <div className="light-day-waves">
        <svg className="wave wave-1" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C150,50 350,0 600,30 C850,60 1050,30 1200,0 L1200,120 L0,120 Z" />
        </svg>
        <svg className="wave wave-2" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C200,40 400,10 600,40 C800,70 1000,40 1200,0 L1200,120 L0,120 Z" />
        </svg>
        <svg className="wave wave-3" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C250,30 450,20 600,50 C750,80 950,50 1200,0 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </>
  );
}
