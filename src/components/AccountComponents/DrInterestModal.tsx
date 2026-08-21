import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { CloseIcon } from '../icons/Icons'
import type { ComponentRow } from './AccountComponentsSection'
import DrInterestBreakdown from './DrInterestBreakdown'
import styles from './DrInterestModal.module.css'

type DrInterestModalProps = {
  rows: ComponentRow[]
  total: number
  onClose: () => void
  title?: string
  subtitle?: string
  emptyTitle?: string
  emptyDescription?: string
  centerLabel?: string
}

const EASE = [0.16, 1, 0.3, 1] as const

const DrInterestModal = ({
  rows,
  total,
  onClose,
  title = 'Total DR Interest',
  subtitle = 'Breakdown of debit-interest components',
  emptyTitle,
  emptyDescription,
  centerLabel,
}: DrInterestModalProps) => {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return createPortal(
    <motion.div
      className={styles.overlay}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: EASE }}
    >
      <motion.div
        className={styles.panel}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${title} breakdown`}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
            <CloseIcon className={styles.closeIcon} />
          </button>
        </div>

        <div className={styles.body}>
          <DrInterestBreakdown
            rows={rows}
            total={total}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
            centerLabel={centerLabel}
          />
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}

export default DrInterestModal
