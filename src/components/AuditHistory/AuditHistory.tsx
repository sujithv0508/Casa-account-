import SectionCard from '../SectionCard/SectionCard'
import { HistoryIcon, ShieldCheckIcon } from '../icons/Icons'
import styles from './AuditHistory.module.css'

export type AuthorizationInfo = {
  status: string
  tone: 'success' | 'warning' | 'danger'
  active: boolean
  changeVersion: number
  deleted: boolean
}

export type AuditTrailInfo = {
  createdBy: string
  createdDate: string
  checkedBy?: string
  checkedDate?: string
  updatedBy?: string
  updatedDate?: string
}

type AuditHistoryProps = {
  authorization: AuthorizationInfo
  trail: AuditTrailInfo
}

const AuditHistory = ({ authorization, trail }: AuditHistoryProps) => {
  return (
    <div className={styles.grid}>
      <SectionCard icon={<ShieldCheckIcon />} title="Authorization" tone="teal" reveal>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <p className={styles.label}>Status</p>
            <span className={`${styles.badge} ${styles[`tone_${authorization.tone}`]}`}>{authorization.status}</span>
          </div>
          <div className={styles.field}>
            <p className={styles.label}>Change Version</p>
            <p className={styles.value}>{authorization.changeVersion}</p>
          </div>
          <div className={styles.field}>
            <p className={styles.label}>Active</p>
            <p className={styles.value}>{authorization.active ? 'Yes' : 'No'}</p>
          </div>
          <div className={styles.field}>
            <p className={styles.label}>Deleted</p>
            <p className={styles.value}>{authorization.deleted ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={<HistoryIcon />} title="Audit Trail" tone="teal" reveal>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <p className={styles.label}>Created By</p>
            <p className={styles.value}>{trail.createdBy}</p>
          </div>
          <div className={styles.field}>
            <p className={styles.label}>Created Date</p>
            <p className={styles.value}>{trail.createdDate}</p>
          </div>
          <div className={styles.field}>
            <p className={styles.label}>Checked By</p>
            <p className={`${styles.value} ${!trail.checkedBy ? styles.valueEmpty : ''}`}>{trail.checkedBy ?? '—'}</p>
          </div>
          <div className={styles.field}>
            <p className={styles.label}>Checked Date</p>
            <p className={`${styles.value} ${!trail.checkedDate ? styles.valueEmpty : ''}`}>
              {trail.checkedDate ?? '—'}
            </p>
          </div>
          <div className={styles.field}>
            <p className={styles.label}>Updated By</p>
            <p className={`${styles.value} ${!trail.updatedBy ? styles.valueEmpty : ''}`}>{trail.updatedBy ?? '—'}</p>
          </div>
          <div className={styles.field}>
            <p className={styles.label}>Updated Date</p>
            <p className={`${styles.value} ${!trail.updatedDate ? styles.valueEmpty : ''}`}>
              {trail.updatedDate ?? '—'}
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

export default AuditHistory
