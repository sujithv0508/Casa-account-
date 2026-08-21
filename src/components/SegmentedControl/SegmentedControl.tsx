import styles from './SegmentedControl.module.css'

type SegmentedControlProps<T extends string> = {
  value: T
  options: readonly T[]
  onChange: (value: T) => void
  disabled?: boolean
  ariaLabel?: string
}

const SegmentedControl = <T extends string>({ value, options, onChange, disabled = false, ariaLabel }: SegmentedControlProps<T>) => {
  return (
    <div className={`${styles.group} ${disabled ? styles.disabled : ''}`} role="radiogroup" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={option === value}
          disabled={disabled}
          className={`${styles.segment} ${option === value ? styles.active : ''}`}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

export default SegmentedControl
