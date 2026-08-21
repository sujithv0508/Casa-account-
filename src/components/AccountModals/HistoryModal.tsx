import Modal from '../Modal/Modal'
import styles from './AccountModals.module.css'

type HistoryEntry = {
  timestamp: string
  action: string
  user: string
  activity: string
}

type HistoryModalProps = {
  entries: HistoryEntry[]
  onClose: () => void
}

const HistoryModal = ({ entries, onClose }: HistoryModalProps) => {
  return (
    <Modal title="Account Status History" subtitle="Chronological record of status changes on this account" onClose={onClose}>
      <div className={styles.historyList}>
        {entries.map((entry) => (
          <div key={`${entry.timestamp}-${entry.action}`} className={styles.historyRow}>
            <span className={styles.historyDot} />
            <div className={styles.historyContent}>
              <div className={styles.historyTop}>
                <span className={styles.historyAction}>{entry.action}</span>
                <span className={styles.historyTime}>{entry.timestamp}</span>
              </div>
              <p className={styles.historyActivity}>{entry.activity}</p>
              <span className={styles.historyUser}>{entry.user}</span>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}

export default HistoryModal
