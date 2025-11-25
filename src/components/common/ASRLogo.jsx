import { motion } from 'framer-motion'

export default function ASRLogo({ className = "flex gap-1", animated = true, size = "text-2xl" }) {
  const letters = [ "✈"]

  if (!animated) {
    return (
      <div className={`${className} ${size} font-light tracking-wider text-white`}>
        {letters.map((letter, index) => (
          <span key={index} className="inline-block">
            {letter}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className={`${className} ${size} font-light tracking-wider`}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          className="inline-block"
          animate={{
            opacity: [0.4, 1, 0.7, 0.4],
            scale: [1, 1.15, 1, 1],
            y: [0, -5, 0, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut",
          }}
        >
          {letter}
        </motion.span>
      ))}
    </div>
  )
}
