import { CopyIcon, EditIcon, ShieldCheckIcon } from '../icons/Icons'
import styles from './AccountHeader.module.css'

type AccountHeaderProps = {
  isEditing: boolean
  copied: boolean
  onEdit: () => void
  onCopy: () => void
  onAuthorization: () => void
}

const AccountHeader = ({ isEditing, copied, onEdit, onCopy, onAuthorization }: AccountHeaderProps) => {
  return (
    <div className={styles.headerCard}>
      <div className={styles.titleRow}>
        <h1>CASA Account Opening</h1>
        <div className={styles.actions}>
          <button type="button" className={styles.actionButton} onClick={onEdit}>
            <EditIcon className={styles.actionIcon} />
            {isEditing ? 'Cancel Edit' : 'Edit'}
          </button>
          <button type="button" className={styles.copyButton} onClick={onCopy}>
            <CopyIcon className={styles.actionIcon} />
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button type="button" className={styles.primaryButton} onClick={onAuthorization}>
            <ShieldCheckIcon className={styles.actionIcon} />
            Authorization
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccountHeader
