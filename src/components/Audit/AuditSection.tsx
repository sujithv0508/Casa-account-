import styles from './AuditSection.module.css'

type AuditEntry = {
  timestamp: string
  action: string
  user: string
  activity: string
}

type AuditSectionProps = {
  entries: AuditEntry[]
}

const AuditSection = ({ entries }: AuditSectionProps) => {
  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2>Audit</h2>
        <p>Review recent application activity and user actions.</p>
      </div>

      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>Date / Time</th>
              <th>Action</th>
              <th>User</th>
              <th>Activity</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={`${entry.timestamp}-${entry.user}`}>
                <td>{entry.timestamp}</td>
                <td>{entry.action}</td>
                <td>{entry.user}</td>
                <td>{entry.activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AuditSection
