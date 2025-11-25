import { motion } from 'framer-motion'

export default function AirplaneLogo({ className = "w-12 h-12" }) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ duration: 0.3 }}
    >
      <defs>
        <linearGradient id="airplaneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Airplane body - takeoff position (45 degree angle) */}
      <g transform="rotate(-45 50 50)" filter="url(#glow)">
        {/* Main fuselage */}
        <path
          d="M 50 20 L 55 70 L 50 75 L 45 70 Z"
          fill="url(#airplaneGradient)"
          opacity="0.9"
        />
        
        {/* Nose cone */}
        <ellipse
          cx="50"
          cy="18"
          rx="5"
          ry="8"
          fill="url(#airplaneGradient)"
        />
        
        {/* Main wings */}
        <path
          d="M 30 45 L 50 50 L 70 45 L 68 48 L 50 52 L 32 48 Z"
          fill="url(#airplaneGradient)"
          opacity="0.95"
        />
        
        {/* Tail wings */}
        <path
          d="M 42 68 L 50 70 L 58 68 L 57 70 L 50 71 L 43 70 Z"
          fill="url(#airplaneGradient)"
          opacity="0.9"
        />
        
        {/* Vertical stabilizer */}
        <path
          d="M 48 70 L 50 65 L 52 70 Z"
          fill="url(#airplaneGradient)"
          opacity="0.85"
        />
        
        {/* Cockpit window */}
        <ellipse
          cx="50"
          cy="28"
          rx="3"
          ry="4"
          fill="#ffffff"
          opacity="0.6"
        />
        
        {/* Engine details */}
        <circle cx="45" cy="50" r="2" fill="#ffffff" opacity="0.4" />
        <circle cx="55" cy="50" r="2" fill="#ffffff" opacity="0.4" />
      </g>
      
      {/* Motion trails for takeoff effect */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <path
          d="M 65 65 Q 70 70 75 75"
          stroke="url(#airplaneGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.3"
          fill="none"
        />
        <path
          d="M 60 70 Q 65 75 70 80"
          stroke="url(#airplaneGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.2"
          fill="none"
        />
      </motion.g>
    </motion.svg>
  )
}
