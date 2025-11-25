import { motion } from 'framer-motion'
import { useEffect, useState, useMemo, useCallback, memo } from 'react'
import './CherryBlossomBackground.css'

const CherryBlossomBackground = memo(function CherryBlossomBackground() {
  const [fallingPetals, setFallingPetals] = useState([])

  // Reduced number of static blossoms for better performance
  const cherryBlossoms = useMemo(() => 
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.2 + 0.6,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 5,
      rotation: Math.random() * 360,
      color: ['#FFB6C1', '#FFC0CB', '#FFE4E1', '#FFF0F5'][Math.floor(Math.random() * 4)]
    })), []
  )

  // Optimized petal removal function
  const removePetal = useCallback((petalId) => {
    setFallingPetals(prev => prev.filter(petal => petal.id !== petalId))
  }, [])

  useEffect(() => {
    // Generate falling petals with better performance
    const petalInterval = setInterval(() => {
      // Limit max petals to prevent lag
      setFallingPetals(prev => {
        if (prev.length > 15) return prev // Don't add more if too many
        
        const newPetal = {
          id: Date.now() + Math.random(),
          x: Math.random() * 100,
          y: -10,
          rotation: Math.random() * 360,
          size: Math.random() * 1 + 0.7,
          color: ['#FFB6C1', '#FFC0CB', '#FFE4E1', '#FFF0F5'][Math.floor(Math.random() * 4)]
        }
        
        // Auto-remove after animation
        setTimeout(() => removePetal(newPetal.id), 6000)
        
        return [...prev, newPetal]
      })
    }, 1200) // Slower generation for better performance

    return () => clearInterval(petalInterval)
  }, [removePetal])

  return (
    <div className="cherry-blossom-background">
      {/* Soft gradient background */}
      <div className="cherry-blossom-gradient" />
      
      {/* Falling petals - Main feature */}
      {fallingPetals.map((petal) => (
        <motion.div
          key={petal.id}
          className="cherry-blossom-falling"
          style={{
            left: `${petal.x}%`,
            fontSize: `${petal.size * 1.8}rem`,
            color: petal.color,
          }}
          initial={{
            y: -50,
            rotate: petal.rotation,
            opacity: 0,
          }}
          animate={{
            y: window.innerHeight + 100,
            rotate: petal.rotation + 360, // 1 full rotation
            x: [0, 20, -15, 25, -10, 15], // Gentle swaying
            opacity: [0, 1, 1, 0.8, 0.4, 0],
          }}
          transition={{
            duration: 6,
            ease: 'linear',
            times: [0, 0.15, 0.4, 0.7, 0.9, 1],
          }}
        >
          🌸
        </motion.div>
      ))}
      
      {/* Reduced static blossoms for subtle background */}
      {cherryBlossoms.slice(0, 15).map((blossom) => (
        <motion.div
          key={blossom.id}
          className="cherry-blossom-static"
          style={{
            left: `${blossom.x}%`,
            top: `${blossom.y}%`,
            fontSize: `${blossom.size * 1.5}rem`,
            color: blossom.color,
            rotate: `${blossom.rotation}deg`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [blossom.rotation, blossom.rotation + 5, blossom.rotation],
          }}
          transition={{
            duration: blossom.duration,
            repeat: Infinity,
            delay: blossom.delay,
            ease: 'easeInOut',
          }}
        >
          🌸
        </motion.div>
      ))}
      
      {/* Simplified floating clusters */}
      <motion.div
        className="cherry-blossom-cluster"
        style={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          fontSize: '2.5rem',
        }}
        animate={{
          y: [0, -15, 0],
          rotate: [0, 3, -3, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        🌸🌸
      </motion.div>
      
      <motion.div
        className="cherry-blossom-cluster"
        style={{
          position: 'absolute',
          bottom: '25%',
          left: '8%',
          fontSize: '2rem',
        }}
        animate={{
          y: [0, 12, 0],
          rotate: [0, -2, 2, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
      >
        🌸
      </motion.div>
      
      {/* Reduced twinkling effects */}
      <div className="cherry-blossom-twinkle">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`twinkle-${i}`}
            className="cherry-blossom-sparkle"
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: '0.8rem',
              color: '#FFB6C1',
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0, 1.2, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>
    </div>
  )
})

export default CherryBlossomBackground