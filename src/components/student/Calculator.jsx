// Built-in Calculator for JEE/NEET Exams
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Calculator({ onClose }) {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? String(num) : display + num)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  const clear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '×':
        return firstValue * secondValue
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0
      case '=':
        return secondValue
      default:
        return secondValue
    }
  }

  const handleEquals = () => {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const handleScientific = (func) => {
    const inputValue = parseFloat(display)
    let result

    switch (func) {
      case 'sin':
        result = Math.sin(inputValue * Math.PI / 180)
        break
      case 'cos':
        result = Math.cos(inputValue * Math.PI / 180)
        break
      case 'tan':
        result = Math.tan(inputValue * Math.PI / 180)
        break
      case 'log':
        result = Math.log10(inputValue)
        break
      case 'ln':
        result = Math.log(inputValue)
        break
      case 'sqrt':
        result = Math.sqrt(inputValue)
        break
      case 'square':
        result = inputValue * inputValue
        break
      case 'cube':
        result = inputValue * inputValue * inputValue
        break
      case 'reciprocal':
        result = inputValue !== 0 ? 1 / inputValue : 0
        break
      case 'pi':
        result = Math.PI
        break
      case 'e':
        result = Math.E
        break
      default:
        result = inputValue
    }

    setDisplay(String(result))
    setWaitingForOperand(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="calculator-overlay"
    >
      <div className="calculator">
        <div className="calculator-header">
          <h3>Scientific Calculator</h3>
          <button onClick={onClose} className="close-btn">
            ✕
          </button>
        </div>

        <div className="calculator-display">
          <div className="display-value">{display}</div>
        </div>

        <div className="calculator-buttons">
          {/* Scientific Functions Row 1 */}
          <div className="button-row scientific">
            <button onClick={() => handleScientific('sin')} className="btn scientific">
              sin
            </button>
            <button onClick={() => handleScientific('cos')} className="btn scientific">
              cos
            </button>
            <button onClick={() => handleScientific('tan')} className="btn scientific">
              tan
            </button>
            <button onClick={() => handleScientific('log')} className="btn scientific">
              log
            </button>
            <button onClick={() => handleScientific('ln')} className="btn scientific">
              ln
            </button>
          </div>

          {/* Scientific Functions Row 2 */}
          <div className="button-row scientific">
            <button onClick={() => handleScientific('sqrt')} className="btn scientific">
              √
            </button>
            <button onClick={() => handleScientific('square')} className="btn scientific">
              x²
            </button>
            <button onClick={() => handleScientific('cube')} className="btn scientific">
              x³
            </button>
            <button onClick={() => handleScientific('reciprocal')} className="btn scientific">
              1/x
            </button>
            <button onClick={() => handleScientific('pi')} className="btn scientific">
              π
            </button>
          </div>

          {/* Main Calculator */}
          <div className="button-row">
            <button onClick={clear} className="btn clear">
              C
            </button>
            <button onClick={() => setDisplay(display.slice(0, -1) || '0')} className="btn clear">
              ⌫
            </button>
            <button onClick={() => performOperation('÷')} className="btn operator">
              ÷
            </button>
            <button onClick={() => performOperation('×')} className="btn operator">
              ×
            </button>
          </div>

          <div className="button-row">
            <button onClick={() => inputNumber(7)} className="btn number">
              7
            </button>
            <button onClick={() => inputNumber(8)} className="btn number">
              8
            </button>
            <button onClick={() => inputNumber(9)} className="btn number">
              9
            </button>
            <button onClick={() => performOperation('-')} className="btn operator">
              -
            </button>
          </div>

          <div className="button-row">
            <button onClick={() => inputNumber(4)} className="btn number">
              4
            </button>
            <button onClick={() => inputNumber(5)} className="btn number">
              5
            </button>
            <button onClick={() => inputNumber(6)} className="btn number">
              6
            </button>
            <button onClick={() => performOperation('+')} className="btn operator">
              +
            </button>
          </div>

          <div className="button-row">
            <button onClick={() => inputNumber(1)} className="btn number">
              1
            </button>
            <button onClick={() => inputNumber(2)} className="btn number">
              2
            </button>
            <button onClick={() => inputNumber(3)} className="btn number">
              3
            </button>
            <button onClick={handleEquals} className="btn equals" rowSpan="2">
              =
            </button>
          </div>

          <div className="button-row">
            <button onClick={() => inputNumber(0)} className="btn number zero">
              0
            </button>
            <button onClick={inputDecimal} className="btn number">
              .
            </button>
            <button onClick={() => handleScientific('e')} className="btn scientific">
              e
            </button>
          </div>
        </div>

        <div className="calculator-footer">
          <div className="calculator-tips">
            <div className="tip">💡 Use for complex calculations during your exam</div>
            <div className="tip">📐 Trigonometric functions work in degrees</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}