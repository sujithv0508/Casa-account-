import styles from './SegmentedToggle.module.css'

type SegmentedToggleProps = {
  value: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
  yesLabel?: string
  noLabel?: string
  ariaLabel?: string
}

const SegmentedToggle = ({
  value,
  onChange,
  disabled = false,
  yesLabel = 'YES',
  noLabel = 'NO',
  ariaLabel,
}: SegmentedToggleProps) => {
  return (
    <div
      className={`${styles.segmented} ${disabled ? styles.disabled : ''}`}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      <span className={`${styles.indicator} ${value ? styles.indicatorYes : styles.indicatorNo}`} />
      <button
        type="button"
        role="radio"
        aria-checked={value}
        className={`${styles.segment} ${value ? styles.active : ''}`}
        disabled={disabled}
        onClick={() => onChange(true)}
      >
        {yesLabel}
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={!value}
        className={`${styles.segment} ${!value ? styles.active : ''}`}
        disabled={disabled}
        onClick={() => onChange(false)}
      >
        {noLabel}
      </button>
    </div>
  )
}

export default SegmentedToggle
