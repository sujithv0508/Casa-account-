import { useState } from 'react'
import Modal from '../Modal/Modal'
import styles from './AccountModals.module.css'

type StatusFlags = {
  dormant: boolean
  frozen: boolean
  noDebits: boolean
  noCredits: boolean
}

type StatusChangeModalProps = {
  initial: StatusFlags
  onClose: () => void
  onApply: (flags: StatusFlags) => void
}

const options: { key: keyof StatusFlags; label: string; description: string }[] = [
  { key: 'dormant', label: 'Dormant', description: 'Mark account as inactive' },
  { key: 'frozen', label: 'Frozen', description: 'Block all account movement' },
  { key: 'noDebits', label: 'No Debits', description: 'Restrict outgoing transactions' },
  { key: 'noCredits', label: 'No Credits', description: 'Restrict incoming transactions' },
]

const StatusChangeModal = ({ initial, onClose, onApply }: StatusChangeModalProps) => {
  const [flags, setFlags] = useState<StatusFlags>(initial)

  const toggle = (key: keyof StatusFlags) => {
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <Modal
      title="Change Account Status"
      subtitle="Update restriction flags for this account"
      onClose={onClose}
      footer={
        <>
          <button type="button" className={styles.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={styles.primaryButton} onClick={() => onApply(flags)}>
            Apply Changes
          </button>
        </>
      }
    >
      <div className={styles.statusOptions}>
        {options.map((option) => (
          <div key={option.key} className={styles.statusOptionRow}>
            <div>
              <p className={styles.statusOptionLabel}>{option.label}</p>
              <p className={styles.statusOptionDesc}>{option.description}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={flags[option.key]}
              className={`${styles.statusToggle} ${flags[option.key] ? styles.statusToggleOn : ''}`}
              onClick={() => toggle(option.key)}
            >
              <span className={styles.statusKnob} />
            </button>
          </div>
        ))}
      </div>
    </Modal>
  )
}

export default StatusChangeModal
