import styles from './StatusSection.module.css'

type StatusItem = {
  label: string
  completed: boolean
}

type StatusSectionProps = {
  items: StatusItem[]
}

const StatusSection = ({ items }: StatusSectionProps) => {
  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2>Status</h2>
        <p>Track the account opening progress through the main steps.</p>
      </div>

      <div className={styles.statusGrid}>
        {items.map((item) => (
          <div key={item.label} className={styles.statusItem}>
            <div className={styles.statusBadge}>{item.completed ? '✓' : item.label.slice(0, 1)}</div>
            <div>
              <p className={styles.statusLabel}>{item.label}</p>
              <p className={styles.statusHint}>{item.completed ? 'Completed' : 'Pending'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StatusSection
