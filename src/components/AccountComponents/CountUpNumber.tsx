import { useEffect, useRef } from 'react'
import { animate, useMotionValue, useMotionValueEvent, useReducedMotion } from 'framer-motion'

type CountUpNumberProps = {
  value: number
  durationMs?: number
  delayMs?: number
  prefix?: string
  suffix?: string
  decimals?: number
}

const CountUpNumber = ({
  value,
  durationMs = 800,
  delayMs = 0,
  prefix = '',
  suffix = '',
  decimals = 2,
}: CountUpNumberProps) => {
  const motionValue = useMotionValue(0)
  const spanRef = useRef<HTMLSpanElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      motionValue.jump(value)
      return
    }
    const controls = animate(motionValue, value, {
      duration: durationMs / 1000,
      delay: delayMs / 1000,
      ease: [0.16, 1, 0.3, 1],
    })
    return () => controls.stop()
  }, [value, durationMs, delayMs, motionValue, prefersReducedMotion])

  useMotionValueEvent(motionValue, 'change', (latest) => {
    if (spanRef.current) {
      spanRef.current.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`
    }
  })

  return (
    <span ref={spanRef}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  )
}

export default CountUpNumber
