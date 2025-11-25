// Digital Rough Work Area for JEE/NEET Exams
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function RoughWorkArea({ onClose }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentTool, setCurrentTool] = useState('pen')
  const [currentColor, setCurrentColor] = useState('#000000')
  const [currentSize, setCurrentSize] = useState(2)
  const [canvasHistory, setCanvasHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    // Set canvas size
    canvas.width = 800
    canvas.height = 600
    
    // Set default styles
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = currentColor
    context.lineWidth = currentSize
    
    // Fill with white background
    context.fillStyle = 'white'
    context.fillRect(0, 0, canvas.width, canvas.height)
    
    // Save initial state
    saveCanvasState()
  }, [])

  const saveCanvasState = () => {
    const canvas = canvasRef.current
    const dataURL = canvas.toDataURL()
    const newHistory = canvasHistory.slice(0, historyIndex + 1)
    newHistory.push(dataURL)
    setCanvasHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const startDrawing = (e) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const context = canvas.getContext('2d')
    context.beginPath()
    context.moveTo(x, y)
  }

  const draw = (e) => {
    if (!isDrawing) return
    
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const context = canvas.getContext('2d')
    
    if (currentTool === 'pen') {
      context.globalCompositeOperation = 'source-over'
      context.strokeStyle = currentColor
      context.lineWidth = currentSize
    } else if (currentTool === 'eraser') {
      context.globalCompositeOperation = 'destination-out'
      context.lineWidth = currentSize * 2
    }
    
    context.lineTo(x, y)
    context.stroke()
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      saveCanvasState()
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.fillStyle = 'white'
    context.fillRect(0, 0, canvas.width, canvas.height)
    saveCanvasState()
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      const img = new Image()
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(img, 0, 0)
      }
      img.src = canvasHistory[historyIndex - 1]
    }
  }

  const redo = () => {
    if (historyIndex < canvasHistory.length - 1) {
      setHistoryIndex(historyIndex + 1)
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      const img = new Image()
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(img, 0, 0)
      }
      img.src = canvasHistory[historyIndex + 1]
    }
  }

  const downloadRoughWork = () => {
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.download = 'rough-work.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  const tools = [
    { id: 'pen', name: 'Pen', icon: '✏️' },
    { id: 'eraser', name: 'Eraser', icon: '🧹' }
  ]

  const colors = [
    '#000000', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ffa500'
  ]

  const sizes = [1, 2, 4, 6, 8, 12]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="rough-work-overlay"
    >
      <div className="rough-work-area">
        <div className="rough-work-header">
          <div className="header-left">
            <h3>Rough Work Area</h3>
            <p>Use this space for calculations and notes</p>
          </div>
          
          <div className="header-actions">
            <button onClick={downloadRoughWork} className="action-btn download">
              📥 Download
            </button>
            <button onClick={onClose} className="close-btn">
              ✕
            </button>
          </div>
        </div>

        <div className="rough-work-toolbar">
          {/* Tools */}
          <div className="toolbar-section">
            <div className="section-label">Tools:</div>
            <div className="tool-buttons">
              {tools.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setCurrentTool(tool.id)}
                  className={`tool-btn ${currentTool === tool.id ? 'active' : ''}`}
                  title={tool.name}
                >
                  <span className="tool-icon">{tool.icon}</span>
                  <span className="tool-name">{tool.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="toolbar-section">
            <div className="section-label">Colors:</div>
            <div className="color-palette">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setCurrentColor(color)}
                  className={`color-btn ${currentColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="toolbar-section">
            <div className="section-label">Size:</div>
            <div className="size-selector">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setCurrentSize(size)}
                  className={`size-btn ${currentSize === size ? 'active' : ''}`}
                >
                  <div 
                    className="size-preview"
                    style={{ 
                      width: `${size + 4}px`, 
                      height: `${size + 4}px`,
                      backgroundColor: currentColor
                    }}
                  />
                  <span>{size}px</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="toolbar-section">
            <div className="section-label">Actions:</div>
            <div className="action-buttons">
              <button 
                onClick={undo} 
                disabled={historyIndex <= 0}
                className="action-btn"
                title="Undo"
              >
                ↶ Undo
              </button>
              <button 
                onClick={redo} 
                disabled={historyIndex >= canvasHistory.length - 1}
                className="action-btn"
                title="Redo"
              >
                ↷ Redo
              </button>
              <button 
                onClick={clearCanvas} 
                className="action-btn clear"
                title="Clear All"
              >
                🗑️ Clear
              </button>
            </div>
          </div>
        </div>

        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="drawing-canvas"
          />
          
          {/* Grid overlay for better writing */}
          <div className="canvas-grid" />
        </div>

        <div className="rough-work-footer">
          <div className="footer-tips">
            <div className="tip">
              <span className="tip-icon">💡</span>
              <span>Use this area for mathematical calculations and diagrams</span>
            </div>
            <div className="tip">
              <span className="tip-icon">📝</span>
              <span>Your work is automatically saved and can be downloaded</span>
            </div>
            <div className="tip">
              <span className="tip-icon">🖱️</span>
              <span>Use mouse or touch to draw. Switch between pen and eraser as needed</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}