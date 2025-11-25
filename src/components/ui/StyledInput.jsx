import React from 'react'
import { motion } from 'framer-motion'

/**
 * StyledInput Component
 * Beautiful, theme-adaptive input with multiple style variants
 * 
 * @param {string} variant - 'default' | 'pill' (default: 'default')
 * @param {string} type - Input type (default: 'text')
 * @param {string} placeholder - Placeholder text
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {string} className - Additional classes
 * @param {boolean} animate - Enable framer-motion animations (default: true)
 * @param {object} ...props - Other input props
 */
export default function StyledInput({
  variant = 'default',
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className = '',
  animate = true,
  ...props
}) {
  const baseClass = variant === 'pill' ? 'input-pill' : 'input-field'
  const combinedClass = `${baseClass} ${className}`.trim()

  if (animate) {
    return (
      <motion.input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={combinedClass}
        whileFocus={{ scale: 1.005 }}
        transition={{ duration: 0.2 }}
        {...props}
      />
    )
  }

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={combinedClass}
      {...props}
    />
  )
}

/**
 * Usage Examples:
 * 
 * // Default rectangular input
 * <StyledInput 
 *   placeholder="Enter your email" 
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 * />
 * 
 * // Pill-shaped input (rounded)
 * <StyledInput 
 *   variant="pill"
 *   placeholder="Username" 
 *   value={username}
 *   onChange={(e) => setUsername(e.target.value)}
 * />
 * 
 * // Password input
 * <StyledInput 
 *   type="password"
 *   placeholder="Password" 
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 * />
 * 
 * // Without animation
 * <StyledInput 
 *   animate={false}
 *   placeholder="No animation" 
 * />
 * 
 * // With custom classes
 * <StyledInput 
 *   className="w-full mt-4"
 *   placeholder="Custom styling" 
 * />
 */
