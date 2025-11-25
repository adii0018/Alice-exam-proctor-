import { motion } from 'framer-motion'
import { useEffect, useState, useMemo } from 'react'

export default function StarfieldBackground() {
  const [shootingStars, setShootingStars] = useState([])

  // Memoize stars to prevent re-generation
  const stars = useMemo(() => 
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 5,
    })), []
  )

  useEffect(() => {
    // Generate shooting stars less frequently
    const shootingStarInterval = setInterval(() => {
      const newShootingStar = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 50,
      }
      setShootingStars(prev => [...prev, newShootingStar])
      
      // Remove shooting star after animation
      setTimeout(() => {
        setShootingStars(prev => prev.filter(star => star.id !== newShootingStar.id))
      }, 2000)
    }, 5000) // Increased from 3000 to 5000

    return () => clearInterval(shootingStarInterval)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900">
      {/* Deep Space Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-blue-900/20 to-black/40" />
      
      {/* Animated Nebula Clouds - Optimized */}
      <div
        className="absolute top-0 left-0 w-full h-full opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(88, 166, 255, 0.3) 0%, transparent 50%)',
          backgroundSize: '200% 200%',
        }}
      />
      
      {/* Stars - Optimized with CSS animations */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.6)`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
      
      {/* Shooting Stars */}
      {shootingStars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: '100px',
            transformOrigin: 'left center',
          }}
          initial={{
            opacity: 0,
            x: 0,
            y: 0,
            rotate: 45,
          }}
          animate={{
            opacity: [0, 1, 0],
            x: 300,
            y: 300,
          }}
          transition={{
            duration: 1.5,
            ease: 'easeOut',
          }}
        />
      ))}
      
      {/* Planets/Orbs */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 opacity-20 blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      <motion.div
        className="absolute bottom-40 left-40 w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-orange-500 opacity-20 blur-2xl"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [360, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Distant Galaxy Effect */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Twinkling Layer - Reduced count */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`twinkle-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </div>
  )
}
