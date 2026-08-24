import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Modal from '../Modal/Modal'
import {
  FileTextIcon,
  FolderIcon,
  BankIcon,
  CheckCircleIcon,
  StatusShieldIcon,
  ShieldCheckIcon,
  UserIcon,
} from '../icons/Icons'
import sharedStyles from './AccountModals.module.css'
import styles from './SubmissionAnimationModal.module.css'

export type SubmissionAnimationMode = 'document' | 'security'

type SubmissionAnimationModalProps = {
  mode: SubmissionAnimationMode
  onComplete: () => void
}

type StageConfig = {
  key: string
  label: string
  title: string
  subtitle: string
}

const DOCUMENT_STAGES: StageConfig[] = [
  { key: 'saving', label: 'Saving', title: 'Saving Changes', subtitle: 'Please wait while we save your changes...' },
  {
    key: 'validating',
    label: 'Validating',
    title: 'Validating Changes',
    subtitle: 'Please wait while we validate your changes...',
  },
  {
    key: 'preparing',
    label: 'Preparing',
    title: 'Preparing Authorization',
    subtitle: 'Please wait while we prepare authorization...',
  },
  {
    key: 'submitted',
    label: 'Submitted',
    title: 'Changes Saved & Submitted',
    subtitle: 'Your changes have been submitted for authorization successfully.',
  },
]

const SECURITY_STAGES: StageConfig[] = [
  {
    key: 'securing',
    label: 'Securing',
    title: 'Securing Request',
    subtitle: 'Please wait while we secure your request...',
  },
  {
    key: 'validating',
    label: 'Validating',
    title: 'Validating Request',
    subtitle: 'Please wait while we validate your request...',
  },
  {
    key: 'submitting',
    label: 'Submitting',
    title: 'Submitting for Authorization',
    subtitle: 'Please wait while we submit your request...',
  },
  {
    key: 'finalizing',
    label: 'Finalizing',
    title: 'Submitted for Authorization',
    subtitle: 'Your changes have been submitted successfully.',
  },
]

const STAGE_DURATION_MS = 420
const EASE = [0.16, 1, 0.3, 1] as const

const DocumentStageVisual = ({ stageIndex, reduced }: { stageIndex: number; reduced: boolean }) => {
  const isSubmitted = stageIndex === 3
  const MainIcon = stageIndex >= 3 ? BankIcon : FileTextIcon

  return (
    <div className={`${sharedStyles.verifyRing} ${isSubmitted ? sharedStyles.verifyRingComplete : ''}`}>
      <div className={sharedStyles.verifyTrack} />
      <motion.div
        className={sharedStyles.verifySpinner}
        animate={reduced ? undefined : { rotate: 360 }}
        transition={{ duration: 1.6, repeat: isSubmitted ? 0 : Infinity, ease: 'linear' }}
      />
      {stageIndex === 1 && (
        <div className={styles.scanClipHorizontal}>
          <motion.div
            className={styles.scanBeamHorizontal}
            animate={reduced ? undefined : { x: ['-120%', '120%'] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      )}
      <motion.div
        className={sharedStyles.verifyIconCircle}
        animate={
          reduced
            ? undefined
            : {
                y: stageIndex === 2 ? [0, -3, 0] : 0,
              }
        }
        transition={{ duration: 1.2, repeat: stageIndex === 2 ? Infinity : 0, ease: 'easeInOut' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={MainIcon === BankIcon ? 'bank' : 'document'}
            initial={reduced ? undefined : { scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            <MainIcon className={sharedStyles.verifyIcon} />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {stageIndex === 0 && (
          <motion.div
            className={styles.badgeCircle}
            initial={{ opacity: 0, scale: 0.5, x: -6, y: 6 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <FolderIcon className={styles.badgeIcon} />
          </motion.div>
        )}
        {isSubmitted && (
          <motion.div
            className={`${styles.badgeCircle} ${styles.badgeCircleSuccess}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: EASE, delay: 0.1 }}
          >
            <CheckCircleIcon className={`${styles.badgeIcon} ${styles.badgeIconSuccess}`} />
          </motion.div>
        )}
      </AnimatePresence>
      {stageIndex === 1 && (
        <div className={styles.checkDotsRow}>
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className={styles.checkDot}
              initial={{ opacity: 0.15, scale: 0.7 }}
              animate={{ opacity: [0.15, 1, 0.15], scale: [0.7, 1, 0.7] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.25, ease: 'easeInOut' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const SecurityStageVisual = ({ stageIndex, reduced }: { stageIndex: number; reduced: boolean }) => {
  const isFinal = stageIndex === 3

  if (stageIndex === 2) {
    return (
      <div className={styles.transferRow}>
        <div className={styles.transferNode}>
          <UserIcon className={styles.transferIcon} />
        </div>
        <div className={styles.transferTrack}>
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className={styles.transferDot}
              initial={{ x: '0%', opacity: 0 }}
              animate={reduced ? undefined : { x: ['0%', '480%'], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: dot * 0.3, ease: 'easeInOut' }}
            />
          ))}
        </div>
        <div className={`${styles.transferNode} ${styles.transferNodeBank}`}>
          <BankIcon className={styles.transferIcon} />
        </div>
      </div>
    )
  }

  return (
    <div className={`${sharedStyles.verifyRing} ${isFinal ? sharedStyles.verifyRingComplete : ''}`}>
      <div className={sharedStyles.verifyTrack} />
      <motion.div
        className={sharedStyles.verifySpinner}
        animate={reduced ? undefined : { rotate: 360 }}
        transition={{ duration: 1.8, repeat: isFinal ? 0 : Infinity, ease: 'linear' }}
      />
      <motion.div
        className={sharedStyles.verifyOrbit}
        animate={reduced || isFinal ? undefined : { rotate: 360 }}
        transition={{ duration: 2.1, repeat: Infinity, ease: 'linear' }}
      >
        <span className={sharedStyles.verifyOrbitDot} />
      </motion.div>
      {stageIndex === 1 && (
        <div className={styles.scanClipHorizontal}>
          <motion.div
            className={styles.scanBeamHorizontal}
            animate={reduced ? undefined : { x: ['-120%', '120%'] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      )}
      <motion.div
        className={sharedStyles.verifyIconCircle}
        animate={
          reduced || isFinal
            ? undefined
            : {
                boxShadow: [
                  '0 6px 16px rgba(15, 60, 35, 0.12), 0 0 0 6px rgba(11, 122, 84, 0.06)',
                  '0 6px 16px rgba(15, 60, 35, 0.12), 0 0 0 10px rgba(11, 122, 84, 0.13)',
                  '0 6px 16px rgba(15, 60, 35, 0.12), 0 0 0 6px rgba(11, 122, 84, 0.06)',
                ],
              }
        }
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isFinal ? 'shield-check' : 'shield'}
            initial={reduced ? undefined : { scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            {isFinal ? (
              <ShieldCheckIcon className={sharedStyles.verifyIcon} />
            ) : (
              <StatusShieldIcon className={sharedStyles.verifyIcon} />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
      {stageIndex === 1 && (
        <div className={styles.checkDotsRow}>
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className={styles.checkDot}
              initial={{ opacity: 0.15, scale: 0.7 }}
              animate={{ opacity: [0.15, 1, 0.15], scale: [0.7, 1, 0.7] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.25, ease: 'easeInOut' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const SubmissionAnimationModal = ({ mode, onComplete }: SubmissionAnimationModalProps) => {
  const [stageIndex, setStageIndex] = useState(0)
  const prefersReducedMotion = useReducedMotion()
  const stages = mode === 'document' ? DOCUMENT_STAGES : SECURITY_STAGES

  useEffect(() => {
    const timers: number[] = []
    let elapsed = 0
    for (let index = 1; index < stages.length; index += 1) {
      elapsed += STAGE_DURATION_MS
      timers.push(window.setTimeout(() => setStageIndex(index), elapsed))
    }
    elapsed += STAGE_DURATION_MS
    timers.push(window.setTimeout(() => onComplete(), elapsed))
    return () => timers.forEach((timer) => window.clearTimeout(timer))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stage = stages[stageIndex]

  return (
    <Modal title={stage.title} onClose={() => {}}>
      <div className={sharedStyles.verifyWrap}>
        {mode === 'document' ? (
          <DocumentStageVisual stageIndex={stageIndex} reduced={!!prefersReducedMotion} />
        ) : (
          <SecurityStageVisual stageIndex={stageIndex} reduced={!!prefersReducedMotion} />
        )}

        <h3 className={sharedStyles.verifyTitle}>{stage.title}</h3>
        <p className={sharedStyles.verifySubtitle}>{stage.subtitle}</p>

        <div className={sharedStyles.verifySteps}>
          <div className={sharedStyles.verifyStepsLine} />
          {stages.map((step, index) => (
            <div
              key={step.key}
              className={`${sharedStyles.verifyStep} ${index <= stageIndex ? sharedStyles.verifyStepActive : ''} ${index < stageIndex ? sharedStyles.verifyStepDone : ''}`}
            >
              <span className={sharedStyles.verifyStepDot} />
              <span className={sharedStyles.verifyStepLabel}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default SubmissionAnimationModal
