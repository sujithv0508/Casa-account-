import { ArrowRightIcon, RefreshIcon } from '../icons/Icons'
import styles from './BottomActionBar.module.css'

type BottomActionBarProps = {
  updatedBy: string
  updatedAt: string
  isEditing: boolean
  changeCount: number
  onCancel: () => void
  onSave: () => void
}

const BottomActionBar = ({ updatedBy, updatedAt, isEditing, changeCount, onCancel, onSave }: BottomActionBarProps) => {
  return (
    <footer className={styles.bar}>
      <div className={styles.meta}>
        <RefreshIcon className={styles.metaIcon} />
        <span>
          Last updated by <strong>{updatedBy}</strong>
        </span>
        <span className={styles.metaDivider}>|</span>
        <span>{updatedAt}</span>
      </div>
      {isEditing && (
        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className={styles.submitButton} onClick={onSave}>
            {changeCount > 0 ? 'Save & Submit for Authorization' : 'Save Changes'}
            {changeCount > 0 && <ArrowRightIcon className={styles.submitIcon} />}
          </button>
        </div>
      )}
    </footer>
  )
}

export default BottomActionBar
