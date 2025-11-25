import { motion } from 'framer-motion'

export default function AnimeBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none will-change-transform transform-gpu">
      {/* Dark Winter Night Sky Gradient - Perfect for Snowflakes */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 20%, #16213e 40%, #0f3460 70%, #533483 100%)',
        }}
      />

      {/* Main Falling Snowflakes - Performance Optimized */}
      <div className="absolute inset-0 z-10">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={`snowflake-${i}`}
            className="absolute text-white will-change-transform"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-20px`,
              fontSize: `${Math.random() * 12 + 14}px`,
              textShadow: '0 0 15px rgba(255, 255, 255, 0.9), 0 0 30px rgba(173, 216, 230, 0.6)',
              filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))',
              transform: 'translateZ(0)', // Force hardware acceleration
            }}
            animate={{
              y: [0, 1400],
              x: [0, Math.random() * 80 - 40],
              rotate: [0, 360],
              opacity: [0, 1, 1, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 6 + 8,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "linear",
            }}
          >
            ❄
          </motion.div>
        ))}
      </div>

      {/* Small Round Snowflakes - Reduced for Performance */}
      <div className="absolute inset-0 z-10">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`small-snow-${i}`}
            className="absolute w-2 h-2 bg-white rounded-full will-change-transform"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10px`,
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(173, 216, 230, 0.6)',
              transform: 'translateZ(0)', // Force hardware acceleration
            }}
            animate={{
              y: [0, 1400],
              x: [0, Math.random() * 60 - 30],
              opacity: [0, 1, 0.9, 0.7, 0],
              scale: [0.5, 1, 0.8, 0.5],
            }}
            transition={{
              duration: Math.random() * 10 + 12,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Tiny Snowflake Dots - Minimal for Performance */}
      <div className="absolute inset-0 z-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`tiny-snow-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full will-change-transform"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-5px`,
              boxShadow: '0 0 6px rgba(255, 255, 255, 0.7)',
              transform: 'translateZ(0)', // Force hardware acceleration
            }}
            animate={{
              y: [0, 1400],
              x: [0, Math.random() * 40 - 20],
              opacity: [0, 0.8, 0.6, 0.4, 0],
            }}
            transition={{
              duration: Math.random() * 12 + 15,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Subtle Dark Vignette Effect */}
      <div 
        className="absolute inset-0 pointer-events-none will-change-transform"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(15, 15, 35, 0.3) 80%, rgba(15, 15, 35, 0.5) 100%)',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      />
    </div>
  )
}