import styles from './RoleSwitcher.module.css'

export type UserRole = 'maker' | 'checker'

type RoleSwitcherProps = {
  role: UserRole
  onChange: (role: UserRole) => void
}

const RoleSwitcher = ({ role, onChange }: RoleSwitcherProps) => {
  return (
    <div className={styles.wrap}>
      <span className={styles.label}>Acting as</span>
      <div className={styles.segmented} role="radiogroup" aria-label="Acting as">
        <button
          type="button"
          role="radio"
          aria-checked={role === 'maker'}
          className={`${styles.segment} ${role === 'maker' ? styles.active : ''}`}
          onClick={() => onChange('maker')}
        >
          Maker
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={role === 'checker'}
          className={`${styles.segment} ${role === 'checker' ? styles.active : ''}`}
          onClick={() => onChange('checker')}
        >
          Checker
        </button>
      </div>
    </div>
  )
}

export default RoleSwitcher
