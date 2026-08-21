import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Modal from '../Modal/Modal'
import { BankIcon, CheckCircleIcon, ShieldCheckIcon, XCircleIcon } from '../icons/Icons'
import styles from './AccountModals.module.css'

export type ChangeEntry = {
  field: string
  label: string
  before: string
  after: string
}

export type UserRole = 'maker' | 'checker'

type AuthorizationModalProps = {
  accountNo: string
  customerName: string
  changeVersion: number
  status: 'authorized' | 'pendingAuthorization'
  changes: ChangeEntry[]
  changedBy?: string
  submittedDate?: string
  authorizedBy?: string
  authorizedDate?: string
  currentUserRole: UserRole
  onClose: () => void
  onApprove: () => void
  onReject: (reason: string) => void
}

type Phase =
  | 'summary'
  | 'confirmApprove'
  | 'processingApprove'
  | 'approveSuccess'
  | 'rejectForm'
  | 'processingReject'
  | 'rejectSuccess'

const APPROVE_STEPS = [
  { key: 'preparing', label: 'Preparing', duration: 700 },
  { key: 'validating', label: 'Validating', duration: 1000 },
  { key: 'approving', label: 'Approving', duration: 1000 },
  { key: 'finalizing', label: 'Finalizing', duration: 800 },
] as const

const REJECT_PROCESSING_DURATION = 650
const REJECT_FINALIZE_DURATION = 850

const EASE = [0.16, 1, 0.3, 1] as const

const AuthorizationModal = ({
  accountNo,
  customerName,
  changeVersion,
  status,
  changes,
  changedBy,
  submittedDate,
  authorizedBy,
  authorizedDate,
  currentUserRole,
  onClose,
  onApprove,
  onReject,
}: AuthorizationModalProps) => {
  const [phase, setPhase] = useState<Phase>('summary')
  const [rejectionReason, setRejectionReason] = useState('')
  const [submittedRejectReason, setSubmittedRejectReason] = useState('')
  const [approveStep, setApproveStep] = useState(0)
  const [rejectStep, setRejectStep] = useState(0)
  const prefersReducedMotion = useReducedMotion()
  const onApproveRef = useRef(onApprove)
  const onRejectRef = useRef(onReject)
  const pendingRejectReasonRef = useRef('')

  useEffect(() => {
    onApproveRef.current = onApprove
  }, [onApprove])

  useEffect(() => {
    onRejectRef.current = onReject
  }, [onReject])

  useEffect(() => {
    if (phase !== 'processingApprove') return
    setApproveStep(0)
    const timers: number[] = []
    let elapsed = 0
    for (let index = 1; index < APPROVE_STEPS.length; index += 1) {
      elapsed += APPROVE_STEPS[index - 1].duration
      timers.push(window.setTimeout(() => setApproveStep(index), elapsed))
    }
    elapsed += APPROVE_STEPS[APPROVE_STEPS.length - 1].duration
    timers.push(
      window.setTimeout(() => {
        onApproveRef.current()
        setPhase('approveSuccess')
      }, elapsed),
    )
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [phase])

  useEffect(() => {
    if (phase !== 'processingReject') return
    setRejectStep(0)
    const timers: number[] = []
    timers.push(window.setTimeout(() => setRejectStep(1), REJECT_PROCESSING_DURATION))
    timers.push(
      window.setTimeout(() => {
        onRejectRef.current(pendingRejectReasonRef.current)
        setPhase('rejectSuccess')
      }, REJECT_PROCESSING_DURATION + REJECT_FINALIZE_DURATION),
    )
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [phase])

  const handleApproveConfirm = () => {
    if (phase !== 'confirmApprove') return
    setPhase('processingApprove')
  }

  const handleRejectConfirm = () => {
    if (phase !== 'rejectForm') return
    const reason = rejectionReason.trim()
    pendingRejectReasonRef.current = reason
    setSubmittedRejectReason(reason)
    setPhase('processingReject')
  }

  if (
    status === 'authorized' &&
    phase !== 'processingApprove' &&
    phase !== 'approveSuccess' &&
    phase !== 'processingReject' &&
    phase !== 'rejectSuccess'
  ) {
    return (
      <Modal title="Authorization" subtitle="Current authorization status for this account." onClose={onClose}>
        <div className={styles.fieldGrid2}>
          <div className={styles.field}>
            <p className={styles.fieldLabel}>Account</p>
            <p className={styles.fieldValue}>{accountNo}</p>
          </div>
          <div className={styles.field}>
            <p className={styles.fieldLabel}>Customer</p>
            <p className={styles.fieldValue}>{customerName}</p>
          </div>
          <div className={styles.field}>
            <p className={styles.fieldLabel}>Change Version</p>
            <p className={styles.fieldValue}>{changeVersion}</p>
          </div>
          <div className={styles.field}>
            <p className={styles.fieldLabel}>Status</p>
            <span className={`${styles.badge} ${styles.tone_success}`}>Authorized</span>
          </div>
          {authorizedBy && (
            <div className={styles.field}>
              <p className={styles.fieldLabel}>Authorized By</p>
              <p className={styles.fieldValue}>{authorizedBy}</p>
            </div>
          )}
          {authorizedDate && (
            <div className={styles.field}>
              <p className={styles.fieldLabel}>Authorized Date</p>
              <p className={styles.fieldValue}>{authorizedDate}</p>
            </div>
          )}
        </div>
      </Modal>
    )
  }

  if (phase === 'processingApprove') {
    const isFinalizing = approveStep === 3
    const screen =
      approveStep <= 1
        ? {
            title: 'Verifying Changes',
            subtitle: 'Securely validating account changes...',
            Icon: BankIcon,
          }
        : {
            title: approveStep === 2 ? 'Approving Changes' : 'Finalizing Changes',
            subtitle:
              approveStep === 2
                ? 'Applying authorized changes to the account...'
                : 'Almost done. Securing your account update...',
            Icon: ShieldCheckIcon,
          }

    return (
      <Modal title={screen.title} onClose={() => {}}>
        <div className={styles.verifyWrap}>
          <div className={`${styles.verifyRing} ${isFinalizing ? styles.verifyRingComplete : ''}`}>
            <div className={styles.verifyTrack} />
            <motion.div
              className={styles.verifySpinner}
              animate={prefersReducedMotion ? undefined : { rotate: 360 }}
              transition={{ duration: isFinalizing ? 2.4 : 1.4, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className={styles.verifyOrbit}
              animate={prefersReducedMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 1.9, repeat: Infinity, ease: 'linear' }}
            >
              <span className={styles.verifyOrbitDot} />
            </motion.div>
            <div className={styles.verifyScanClip}>
              <motion.div
                className={styles.verifyScanBeam}
                animate={prefersReducedMotion ? undefined : { y: ['-60%', '160%'] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <motion.div
              className={styles.verifyIconCircle}
              animate={
                prefersReducedMotion
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
              <screen.Icon className={styles.verifyIcon} />
            </motion.div>
          </div>

          <h3 className={styles.verifyTitle}>{screen.title}</h3>
          <p className={styles.verifySubtitle}>{screen.subtitle}</p>

          <div className={styles.verifySteps}>
            <div className={styles.verifyStepsLine} />
            {APPROVE_STEPS.map((step, index) => (
              <div
                key={step.key}
                className={`${styles.verifyStep} ${index <= approveStep ? styles.verifyStepActive : ''} ${index < approveStep ? styles.verifyStepDone : ''}`}
              >
                <span className={styles.verifyStepDot} />
                <span className={styles.verifyStepLabel}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    )
  }

  if (phase === 'approveSuccess') {
    return (
      <Modal
        title=""
        onClose={onClose}
        footer={
          <button type="button" className={styles.primaryButton} onClick={onClose}>
            Close
          </button>
        }
      >
        <div className={styles.successWrap}>
          <motion.div
            className={styles.successIconCircle}
            initial={prefersReducedMotion ? undefined : { scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <CheckCircleIcon className={styles.successIcon} />
          </motion.div>
          <h3 className={styles.verifyTitle}>Changes Approved</h3>
          <p className={styles.verifySubtitle}>The changes have been successfully applied to the account.</p>

          <div className={`${styles.fieldGrid2} ${styles.successInfoGrid}`}>
            <div className={styles.field}>
              <p className={styles.fieldLabel}>Status</p>
              <span className={`${styles.badge} ${styles.tone_success}`}>Approved</span>
            </div>
            <div className={styles.field}>
              <p className={styles.fieldLabel}>Account</p>
              <p className={styles.fieldValue}>{accountNo}</p>
            </div>
            <div className={styles.field}>
              <p className={styles.fieldLabel}>Approved By</p>
              <p className={styles.fieldValue}>{authorizedBy ?? '—'}</p>
            </div>
            <div className={styles.field}>
              <p className={styles.fieldLabel}>Approved Date</p>
              <p className={styles.fieldValue}>{authorizedDate ?? '—'}</p>
            </div>
          </div>
        </div>
      </Modal>
    )
  }

  if (phase === 'processingReject') {
    const isRejecting = rejectStep === 1
    const title = isRejecting ? 'Rejecting Changes' : 'Processing Rejection'
    const subtitle = isRejecting
      ? 'Finalizing the rejection on this account...'
      : 'Please wait while we process the rejection...'

    return (
      <Modal title={title} onClose={() => {}}>
        <div className={styles.verifyWrap}>
          <div className={`${styles.verifyRing} ${isRejecting ? styles.verifyRingDanger : ''}`}>
            <div className={styles.verifyTrack} />
            <motion.div
              className={`${styles.verifySpinner} ${isRejecting ? styles.verifySpinnerDanger : ''}`}
              animate={prefersReducedMotion ? undefined : { rotate: 360 }}
              transition={{ duration: isRejecting ? 1.8 : 1.4, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className={styles.verifyOrbit}
              animate={prefersReducedMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 1.9, repeat: Infinity, ease: 'linear' }}
            >
              <span className={`${styles.verifyOrbitDot} ${isRejecting ? styles.verifyOrbitDotDanger : ''}`} />
            </motion.div>
            <motion.div
              className={styles.verifyIconCircle}
              animate={
                prefersReducedMotion
                  ? undefined
                  : isRejecting
                    ? {
                        boxShadow: [
                          '0 6px 16px rgba(15, 60, 35, 0.12), 0 0 0 6px rgba(192, 57, 43, 0.10)',
                          '0 6px 16px rgba(15, 60, 35, 0.12), 0 0 0 12px rgba(192, 57, 43, 0.20)',
                          '0 6px 16px rgba(15, 60, 35, 0.12), 0 0 0 6px rgba(192, 57, 43, 0.10)',
                        ],
                      }
                    : {
                        boxShadow: [
                          '0 6px 16px rgba(15, 60, 35, 0.12), 0 0 0 6px rgba(11, 122, 84, 0.06)',
                          '0 6px 16px rgba(15, 60, 35, 0.12), 0 0 0 10px rgba(11, 122, 84, 0.13)',
                          '0 6px 16px rgba(15, 60, 35, 0.12), 0 0 0 6px rgba(11, 122, 84, 0.06)',
                        ],
                      }
              }
              transition={{ duration: isRejecting ? 1.1 : 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div
                key={isRejecting ? 'reject-icon' : 'process-icon'}
                initial={prefersReducedMotion ? undefined : { scale: 0.6, opacity: 0, rotate: -30 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                {isRejecting ? (
                  <XCircleIcon className={`${styles.verifyIcon} ${styles.verifyIconDanger}`} />
                ) : (
                  <BankIcon className={styles.verifyIcon} />
                )}
              </motion.div>
            </motion.div>
          </div>

          <h3 className={styles.verifyTitle}>{title}</h3>
          <p className={styles.verifySubtitle}>{subtitle}</p>
        </div>
      </Modal>
    )
  }

  if (phase === 'rejectSuccess') {
    return (
      <Modal
        title=""
        onClose={onClose}
        footer={
          <button type="button" className={styles.primaryButton} onClick={onClose}>
            Close
          </button>
        }
      >
        <div className={styles.successWrap}>
          <motion.div
            className={`${styles.successIconCircle} ${styles.successIconCircleDanger}`}
            initial={prefersReducedMotion ? undefined : { scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <XCircleIcon className={`${styles.successIcon} ${styles.successIconDanger}`} />
          </motion.div>
          <h3 className={styles.verifyTitle}>Changes Rejected</h3>
          <p className={styles.verifySubtitle}>The pending changes have been rejected successfully.</p>
          {submittedRejectReason && (
            <p className={styles.verifySubtitle}>
              <strong>Reason:</strong> {submittedRejectReason}
            </p>
          )}
        </div>
      </Modal>
    )
  }

  if (phase === 'confirmApprove') {
    return (
      <Modal
        title="Approve These Changes?"
        onClose={() => setPhase('summary')}
        footer={
          <>
            <button type="button" className={styles.secondaryButton} onClick={() => setPhase('summary')}>
              Cancel
            </button>
            <button type="button" className={styles.primaryButton} onClick={handleApproveConfirm}>
              <ShieldCheckIcon className={styles.buttonIcon} />
              Approve Changes
            </button>
          </>
        }
      >
        <p className={styles.confirmMessage}>
          Approving will make these {changes.length} change{changes.length === 1 ? '' : 's'} effective on the
          account immediately.
        </p>
      </Modal>
    )
  }

  if (phase === 'rejectForm') {
    return (
      <Modal
        title="Reject Changes"
        onClose={() => setPhase('summary')}
        footer={
          <>
            <button type="button" className={styles.secondaryButton} onClick={() => setPhase('summary')}>
              Cancel
            </button>
            <button
              type="button"
              className={styles.dangerButton}
              disabled={!rejectionReason.trim()}
              onClick={handleRejectConfirm}
            >
              <XCircleIcon className={styles.buttonIcon} />
              Confirm Reject
            </button>
          </>
        }
      >
        <p className={styles.confirmMessage}>Please provide a reason for rejecting these changes.</p>
        <textarea
          className={styles.textarea}
          placeholder="Rejection reason (required)"
          value={rejectionReason}
          onChange={(event) => setRejectionReason(event.target.value)}
          autoFocus
        />
      </Modal>
    )
  }

  return (
    <Modal
      title="Authorization"
      subtitle="Review the pending changes below before approving or rejecting."
      onClose={onClose}
      footer={
        currentUserRole === 'checker' ? (
          <>
            <button type="button" className={styles.dangerButton} onClick={() => setPhase('rejectForm')}>
              <XCircleIcon className={styles.buttonIcon} />
              Reject
            </button>
            <button type="button" className={styles.primaryButton} onClick={() => setPhase('confirmApprove')}>
              <ShieldCheckIcon className={styles.buttonIcon} />
              Approve
            </button>
          </>
        ) : (
          <button type="button" className={styles.secondaryButton} onClick={onClose}>
            Close
          </button>
        )
      }
    >
      <div className={styles.fieldGrid2}>
        <div className={styles.field}>
          <p className={styles.fieldLabel}>Account</p>
          <p className={styles.fieldValue}>{accountNo}</p>
        </div>
        <div className={styles.field}>
          <p className={styles.fieldLabel}>Customer</p>
          <p className={styles.fieldValue}>{customerName}</p>
        </div>
        <div className={styles.field}>
          <p className={styles.fieldLabel}>Change Version</p>
          <p className={styles.fieldValue}>{changeVersion}</p>
        </div>
        <div className={styles.field}>
          <p className={styles.fieldLabel}>Status</p>
          <span className={`${styles.badge} ${styles.tone_warning}`}>Pending Authorization</span>
        </div>
        <div className={styles.field}>
          <p className={styles.fieldLabel}>Changed By</p>
          <p className={styles.fieldValue}>{changedBy ?? '—'}</p>
        </div>
        <div className={styles.field}>
          <p className={styles.fieldLabel}>Submitted Date</p>
          <p className={styles.fieldValue}>{submittedDate ?? '—'}</p>
        </div>
        <div className={styles.field}>
          <p className={styles.fieldLabel}>Number of Changes</p>
          <p className={styles.fieldValue}>{changes.length}</p>
        </div>
      </div>

      <hr className={styles.sectionDivider} />

      <p className={styles.changeSummaryTitle}>Change Summary</p>
      <div className={styles.changeTableWrapper}>
        <table className={styles.changeTable}>
          <thead>
            <tr>
              <th>Field</th>
              <th>Previous</th>
              <th>New Value</th>
            </tr>
          </thead>
          <tbody>
            {changes.map((change) => (
              <tr key={change.field}>
                <td>{change.label}</td>
                <td className={styles.previousValue}>{change.before}</td>
                <td>
                  <span className={styles.newValue}>{change.after}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {currentUserRole === 'maker' && (
        <div className={styles.roleNotice}>
          <ShieldCheckIcon className={styles.roleNoticeIcon} />
          <p>
            You submitted these changes as the maker. An authorized checker must review and approve them before
            they take effect.
          </p>
        </div>
      )}
    </Modal>
  )
}

export default AuthorizationModal
