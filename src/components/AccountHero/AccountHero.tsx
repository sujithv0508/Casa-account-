import {
  AlertIcon,
  CalendarIcon,
  CheckCircleIcon,
  CopyIcon,
  DotCircleIcon,
  DownloadIcon,
  EditIcon,
  EmptyCircleIcon,
  ExchangeIcon,
  EyeIcon,
  MoreIcon,
  ShieldCheckIcon,
  UserIcon,
  WalletIcon,
} from '../icons/Icons'
import styles from './AccountHero.module.css'

export type SetupStep = {
  key: string
  label: string
  state: 'done' | 'active' | 'pending'
}

export type WorkflowStatus = 'view' | 'editing' | 'pendingAuthorization'

type AccountHeroProps = {
  title: string
  subtitle: string
  status: string
  statusTone?: 'success' | 'warning' | 'danger'
  operatingMode: string
  openingDate: string
  progress: number
  steps: SetupStep[]
  workflowStatus: WorkflowStatus
  changeCount: number
  copied: boolean
  onEdit: () => void
  onCopy: () => void
  onAuthorization: () => void
  onQuickAction: (action: string) => void
}

const AccountHero = ({
  title,
  subtitle,
  status,
  statusTone = 'success',
  operatingMode,
  openingDate,
  progress,
  steps,
  workflowStatus,
  changeCount,
  copied,
  onEdit,
  onCopy,
  onAuthorization,
  onQuickAction,
}: AccountHeroProps) => {
  return (
    <section className={styles.hero}>
      {workflowStatus === 'editing' && (
        <div className={styles.editBanner}>
          <EditIcon className={styles.editBannerIcon} />
          <div className={styles.editBannerText}>
            <p className={styles.editBannerTitle}>Edit Mode</p>
            <p className={styles.editBannerSubtitle}>Changes require authorization</p>
          </div>
          <span className={styles.changeBadge}>
            {changeCount === 0 ? 'No changes yet' : `${changeCount} Change${changeCount === 1 ? '' : 's'}`}
          </span>
        </div>
      )}

      {workflowStatus === 'pendingAuthorization' && (
        <div className={styles.pendingBanner}>
          <AlertIcon className={styles.pendingBannerIcon} />
          <div className={styles.editBannerText}>
            <p className={styles.pendingBannerTitle}>Pending Authorization</p>
            <p className={styles.pendingBannerSubtitle}>Waiting for authorized user approval.</p>
          </div>
          <span className={`${styles.changeBadge} ${styles.changeBadgeAmber}`}>
            {changeCount} Change{changeCount === 1 ? '' : 's'}
          </span>
        </div>
      )}

      <div className={styles.topRow}>
        <div className={styles.identity}>
          <div className={styles.accountIcon}>
            <WalletIcon className={styles.accountIconGlyph} />
          </div>
          <div>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{subtitle}</p>
            <div className={styles.pillRow}>
              <span className={`${styles.statusPill} ${styles[`status_${statusTone}`]}`}>
                <span className={styles.statusDot} />
                {status}
              </span>
              <span className={styles.pill}>
                <UserIcon className={styles.pillIcon} />
                {operatingMode}
              </span>
              <span className={styles.pill}>
                <CalendarIcon className={styles.pillIcon} />
                Opened on {openingDate}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.progressBlock}>
          <div className={styles.progressHead}>
            <span className={styles.progressLabel}>Account Setup Progress</span>
            <span className={styles.progressValue}>{progress}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.stepsRow}>
            {steps.map((step) => (
              <div key={step.key} className={styles.step}>
                {step.state === 'done' && <CheckCircleIcon className={`${styles.stepIcon} ${styles.stepDone}`} />}
                {step.state === 'active' && <DotCircleIcon className={`${styles.stepIcon} ${styles.stepActive}`} />}
                {step.state === 'pending' && <EmptyCircleIcon className={`${styles.stepIcon} ${styles.stepPending}`} />}
                <span
                  className={
                    step.state === 'pending' ? styles.stepLabelMuted : styles.stepLabel
                  }
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.actionsBlock}>
          <div className={styles.actionRow}>
            {workflowStatus === 'editing' && (
              <button type="button" className={styles.ghostButton} onClick={onEdit}>
                <EditIcon className={styles.buttonIcon} />
                Cancel Edit
              </button>
            )}

            {workflowStatus === 'pendingAuthorization' && (
              <>
                <button type="button" className={styles.ghostButton} onClick={onAuthorization}>
                  <EyeIcon className={styles.buttonIcon} />
                  View Changes
                </button>
                <button type="button" className={styles.primaryButton} onClick={onAuthorization}>
                  <ShieldCheckIcon className={styles.buttonIcon} />
                  Authorization
                </button>
              </>
            )}

            {workflowStatus === 'view' && (
              <>
                <button type="button" className={styles.ghostButton} onClick={onEdit}>
                  <EditIcon className={styles.buttonIcon} />
                  Edit
                </button>
                <button type="button" className={styles.ghostButton} onClick={onCopy}>
                  <CopyIcon className={styles.buttonIcon} />
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button type="button" className={styles.primaryButton} onClick={onAuthorization}>
                  <ShieldCheckIcon className={styles.buttonIcon} />
                  Authorization
                </button>
              </>
            )}
          </div>

          <div className={styles.quickActions}>
            <p className={styles.quickActionsLabel}>Quick Actions</p>
            <div className={styles.quickActionsRow}>
              <button type="button" className={styles.quickAction} onClick={() => onQuickAction('View Customer')}>
                <span className={`${styles.quickIcon} ${styles.quickIconBlue}`}>
                  <UserIcon className={styles.quickIconGlyph} />
                </span>
                View Customer
              </button>
              <button type="button" className={styles.quickAction} onClick={() => onQuickAction('View Transactions')}>
                <span className={`${styles.quickIcon} ${styles.quickIconPurple}`}>
                  <ExchangeIcon className={styles.quickIconGlyph} />
                </span>
                View Transactions
              </button>
              <button type="button" className={styles.quickAction} onClick={() => onQuickAction('Download Details')}>
                <span className={`${styles.quickIcon} ${styles.quickIconGreen}`}>
                  <DownloadIcon className={styles.quickIconGlyph} />
                </span>
                Download Details
              </button>
              <button type="button" className={styles.quickAction} onClick={() => onQuickAction('More')}>
                <span className={`${styles.quickIcon} ${styles.quickIconGray}`}>
                  <MoreIcon className={styles.quickIconGlyph} />
                </span>
                More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AccountHero
