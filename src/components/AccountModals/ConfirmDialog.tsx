import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Modal from '../Modal/Modal'
import { ShieldCheckIcon, BankIcon, CheckCircleIcon } from '../icons/Icons'
import styles from './AccountModals.module.css'

type ConfirmDialogProps = {
  title: string
  message: string
  cancelLabel?: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
  verifyBeforeConfirm?: boolean
}

const VERIFY_STEPS = ['Preparing', 'Validating', 'Authorizing', 'Finalizing']
const STEP_DURATION_MS = 600
const SUCCESS_DURATION_MS = 1300
const EASE = [0.16, 1, 0.3, 1] as const

const ConfirmDialog = ({
  title,
  message,
  cancelLabel = 'Cancel',
  confirmLabel,
  onCancel,
  onConfirm,
  verifyBeforeConfirm = false,
}: ConfirmDialogProps) => {
  const [phase, setPhase] = useState<'confirm' | 'verifying' | 'success'>('confirm')
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    if (phase !== 'verifying') return
    setActiveStep(0)
    const timers = VERIFY_STEPS.map((_, index) => window.setTimeout(() => setActiveStep(index), index * STEP_DURATION_MS))
    timers.push(window.setTimeout(() => setPhase('success'), VERIFY_STEPS.length * STEP_DURATION_MS))
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [phase])

  useEffect(() => {
    if (phase !== 'success') return
    const timer = window.setTimeout(() => onConfirm(), SUCCESS_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [phase, onConfirm])

  const handleConfirmClick = () => {
    if (verifyBeforeConfirm) {
      setPhase('verifying')
    } else {
      onConfirm()
    }
  }

  if (phase === 'verifying') {
    return (
      <Modal title="Verifying Changes" onClose={() => {}}>
        <div className={styles.verifyWrap}>
          <div className={styles.verifyRing}>
            <div className={styles.verifyTrack} />
            <motion.div
              className={styles.verifySpinner}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className={styles.verifyOrbit}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.9, repeat: Infinity, ease: 'linear' }}
            >
              <span className={styles.verifyOrbitDot} />
            </motion.div>
            <div className={styles.verifyScanClip}>
              <motion.div
                className={styles.verifyScanBeam}
                animate={{ y: ['-60%', '160%'] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <div className={styles.verifyIconCircle}>
              <BankIcon className={styles.verifyIcon} />
            </div>
          </div>

          <h3 className={styles.verifyTitle}>Verifying Changes</h3>
          <p className={styles.verifySubtitle}>Securely validating your banking changes…</p>

          <div className={styles.verifySteps}>
            <div className={styles.verifyStepsLine} />
            {VERIFY_STEPS.map((label, index) => (
              <div
                key={label}
                className={`${styles.verifyStep} ${index <= activeStep ? styles.verifyStepActive : ''} ${index < activeStep ? styles.verifyStepDone : ''}`}
              >
                <span className={styles.verifyStepDot} />
                <span className={styles.verifyStepLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    )
  }

  if (phase === 'success') {
    return (
      <Modal
        title=""
        onClose={onConfirm}
        footer={
          <button type="button" className={styles.primaryButton} onClick={onConfirm}>
            Close
          </button>
        }
      >
        <div className={styles.successWrap}>
          <motion.div
            className={styles.successIconCircle}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <CheckCircleIcon className={styles.successIcon} />
          </motion.div>
          <h3 className={styles.verifyTitle}>Changes Submitted</h3>
          <p className={styles.verifySubtitle}>Your changes have been submitted for authorization.</p>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button type="button" className={styles.secondaryButton} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className={styles.primaryButton} onClick={handleConfirmClick}>
            <ShieldCheckIcon className={styles.buttonIcon} />
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className={styles.confirmMessage}>{message}</p>
    </Modal>
  )
}

export default ConfirmDialog
