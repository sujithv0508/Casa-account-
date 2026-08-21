import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import CountUpNumber from './CountUpNumber'
import styles from './DrInterestDonut.module.css'

export type DonutItem = {
  id: string
  code: string
  name: string
  drCr: 'DR' | 'CR'
  value: number
}

type DrInterestDonutProps = {
  items: DonutItem[]
  total: number
  activeId: string | null
  onHoverChange: (id: string | null) => void
  centerLabel?: string
  currencySymbol?: string
}

export const GREEN_RAMP = ['#0B7A54', '#16A36F', '#3ACB93', '#0A6647', '#1FBF82', '#085239', '#5FDDA8']

const COMPONENT_COLORS: Record<string, string> = {
  DR_03: '#7C3AED',
  DR_04: '#2563EB',
  DR_05: '#F59E0B',
  DR_01: '#65A30D',
  CR_01: '#0D9488',
  CR_02: '#EC4899',
  CR_03: '#EAB308',
}

export const getComponentColor = (code: string) => COMPONENT_COLORS[code] ?? GREEN_RAMP[0]

const RADIUS = 58
const STROKE = 14
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const GAP = 4
const EASE = [0.16, 1, 0.3, 1] as const

const DrInterestDonut = ({
  items,
  total,
  activeId,
  onHoverChange,
  centerLabel = 'TOTAL DR INTEREST',
  currencySymbol = '€',
}: DrInterestDonutProps) => {
  const [animated, setAnimated] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      setAnimated(true)
      return
    }
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setAnimated(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [prefersReducedMotion])

  const visibleItems = items.filter((item) => item.value > 0)
  const activeItem = items.find((item) => item.id === activeId) ?? null
  const hasSelection = activeItem !== null
  let cumulative = 0

  return (
    <div className={styles.wrap}>
      <svg viewBox="0 0 150 150" className={styles.svg} role="img" aria-label={`${centerLabel.toLowerCase().replace('total ', '')} distribution`}>
        <circle cx="75" cy="75" r={RADIUS} className={styles.track} strokeWidth={STROKE} fill="none" />
        {total > 0 && (
          <g transform="rotate(-90 75 75)">
            {visibleItems.map((item, index) => {
              const fraction = item.value / total
              const length = fraction * CIRCUMFERENCE
              const isSelected = item.id === activeId
              const isMuted = hasSelection && !isSelected
              const color = getComponentColor(item.code)
              const pct = (fraction * 100).toFixed(0)

              const visibleLength = animated ? Math.max(0, length - GAP) : 0
              const offset = -cumulative
              cumulative += length

              return (
                <circle
                  key={item.id}
                  cx="75"
                  cy="75"
                  r={RADIUS}
                  fill="none"
                  stroke={color}
                  strokeWidth={isSelected ? STROKE + 2 : STROKE}
                  strokeOpacity={isMuted ? 0.3 : 1}
                  strokeLinecap="round"
                  strokeDasharray={`${visibleLength} ${Math.max(0, CIRCUMFERENCE - visibleLength)}`}
                  strokeDashoffset={offset}
                  className={styles.segment}
                  style={{ transitionDelay: animated ? `${index * 90}ms` : '0ms' }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${item.code}, ${item.name}, ${item.drCr}, ${currencySymbol}${item.value.toFixed(2)}, ${pct} percent`}
                  onMouseEnter={() => onHoverChange(item.id)}
                  onMouseLeave={() => onHoverChange(null)}
                  onFocus={() => onHoverChange(item.id)}
                  onBlur={() => onHoverChange(null)}
                />
              )
            })}
          </g>
        )}
      </svg>

      <div className={styles.centerText}>
        <AnimatePresence mode="wait">
          {activeItem ? (
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.3, ease: EASE }}
              className={styles.centerInner}
            >
              <span className={styles.centerCode}>
                {activeItem.code} · {activeItem.drCr}
              </span>
              <span className={styles.centerName}>{activeItem.name}</span>
              <span className={styles.centerValue}>
                <CountUpNumber value={activeItem.value} durationMs={400} prefix={currencySymbol} />
              </span>
              <span className={styles.centerPct}>
                <CountUpNumber value={total > 0 ? (activeItem.value / total) * 100 : 0} durationMs={400} decimals={0} suffix="% of total" />
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="total"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.3, ease: EASE }}
              className={styles.centerInner}
            >
              <span className={styles.centerLabel}>{centerLabel}</span>
              <span className={styles.centerValue}>
                <CountUpNumber value={total} durationMs={900} delayMs={200} prefix={currencySymbol} />
              </span>
              <span className={styles.centerPct}>100% of total</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default DrInterestDonut
