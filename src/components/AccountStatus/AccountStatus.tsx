import type { Account } from '../../types/account'
import SectionCard from '../SectionCard/SectionCard'
import { AlertIcon, DotCircleIcon, ExchangeIcon, HistoryIcon, StatusShieldIcon, SwapIcon, XCircleIcon } from '../icons/Icons'
import styles from './AccountStatus.module.css'

export type StatusFlags = {
  dormant: boolean
  frozen: boolean
  noDebits: boolean
  noCredits: boolean
}

type AccountStatusProps = {
  account: Account
  editable: boolean
  onToggle: (key: keyof StatusFlags) => void
  onViewHistory: () => void
  onStatusChange: () => void
}

const AccountStatus = ({ account, editable, onToggle, onViewHistory, onStatusChange }: AccountStatusProps) => {
  const rows: { key: keyof StatusFlags; label: string; icon: typeof DotCircleIcon; tone: 'blue' | 'purple' | 'orange' | 'green' }[] = [
    { key: 'dormant', label: 'Dormant', icon: DotCircleIcon, tone: 'blue' },
    { key: 'frozen', label: 'Frozen', icon: XCircleIcon, tone: 'purple' },
    { key: 'noDebits', label: 'No Debits', icon: ExchangeIcon, tone: 'orange' },
    { key: 'noCredits', label: 'No Credits', icon: AlertIcon, tone: 'green' },
  ]

  return (
    <SectionCard
      icon={<StatusShieldIcon />}
      title="Account Status"
      tone="teal"
      reveal
      action={
        <>
          <button type="button" className={styles.actionButton} onClick={onViewHistory}>
            <HistoryIcon className={styles.actionIcon} />
            View History
          </button>
          <button type="button" className={styles.actionButton} onClick={onStatusChange}>
            <SwapIcon className={styles.actionIcon} />
            Status Change
          </button>
        </>
      }
    >
      <div className={styles.grid}>
        {rows.map((row) => {
          const Icon = row.icon
          const isOn = account[row.key]
          return (
            <div key={row.key} className={styles.tile}>
              <span className={`${styles.iconWrap} ${styles[`tone_${row.tone}`]}`}>
                <Icon className={styles.icon} />
              </span>
              <span className={styles.tileLabel}>{row.label}</span>
              <button
                type="button"
                role="switch"
                aria-checked={isOn}
                aria-label={row.label}
                disabled={!editable}
                className={`${styles.toggle} ${isOn ? styles.on : ''} ${!editable ? styles.disabled : ''}`}
                onClick={() => onToggle(row.key)}
              >
                <span className={styles.knob} />
              </button>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}

export default AccountStatus
