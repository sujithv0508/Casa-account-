import { motion, useReducedMotion } from 'framer-motion'
import styles from './BalanceIllustration.module.css'

export type BalanceMood = 'negative' | 'zero' | 'positive'

type BalanceIllustrationProps = {
  mood: BalanceMood
  className?: string
}

const FLOAT_TRANSITION = { duration: 4.2, repeat: Infinity, ease: 'easeInOut' as const }

const BalanceIllustration = ({ mood, className }: BalanceIllustrationProps) => {
  const prefersReducedMotion = useReducedMotion()
  const accentVar = mood === 'negative' ? 'var(--danger)' : 'var(--success)'

  return (
    <svg
      viewBox="0 0 64 56"
      width="60"
      height="52"
      className={`${styles.illustration} ${className ?? ''}`}
      role="img"
      aria-hidden="true"
    >
      <motion.g animate={prefersReducedMotion ? undefined : { y: [0, -3, 0] }} transition={FLOAT_TRANSITION}>
        <rect x="13" y="19" width="30" height="22" rx="5" style={{ fill: '#FFFFFF', stroke: 'var(--blue-600)' }} strokeWidth="1.6" />
        <path d="M13 26h30" style={{ stroke: 'var(--blue-600)' }} strokeWidth="1.6" opacity="0.35" />
        <circle cx="33" cy="30" r="3.2" style={{ stroke: 'var(--blue-600)' }} strokeWidth="1.3" fill="none" />
      </motion.g>

      {mood === 'positive' && (
        <>
          <motion.circle
            r="3.6"
            style={{ fill: accentVar }}
            animate={
              prefersReducedMotion
                ? undefined
                : { cx: [50, 37, 50], cy: [8, 23, 8], opacity: [0, 1, 0] }
            }
            initial={{ cx: 50, cy: 8, opacity: 0 }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            r="2.8"
            style={{ fill: accentVar }}
            animate={
              prefersReducedMotion
                ? undefined
                : { cx: [45, 31, 45], cy: [3, 19, 3], opacity: [0, 1, 0] }
            }
            initial={{ cx: 45, cy: 3, opacity: 0 }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          />
        </>
      )}

      {mood === 'negative' && (
        <>
          <motion.circle
            r="3.4"
            style={{ fill: accentVar }}
            animate={
              prefersReducedMotion
                ? undefined
                : { cx: [32, 42, 50], cy: [33, 43, 51], opacity: [1, 0.55, 0] }
            }
            initial={{ cx: 32, cy: 33, opacity: 1 }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M51 12v11m-4-5 4 5 4-5"
            style={{ stroke: accentVar }}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            animate={prefersReducedMotion ? undefined : { opacity: [0.55, 1, 0.55], y: [0, 2, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}
    </svg>
  )
}

export default BalanceIllustration
