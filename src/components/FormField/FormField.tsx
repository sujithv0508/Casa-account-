import type { ChangeEvent, ReactNode } from 'react'
import styles from './FormField.module.css'

type BaseProps = {
  label: string
  disabled?: boolean
  suffix?: ReactNode
  className?: string
}

type InputFieldProps = BaseProps & {
  as?: 'input'
  value: string
  placeholder?: string
  onChange?: (value: string) => void
}

type SelectFieldProps = BaseProps & {
  as: 'select'
  value: string
  options: string[]
  onChange?: (value: string) => void
}

type StaticFieldProps = BaseProps & {
  as: 'static'
  value: string
}

type FormFieldProps = InputFieldProps | SelectFieldProps | StaticFieldProps

const FormField = (props: FormFieldProps) => {
  const { label, disabled, suffix, className } = props

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if ('onChange' in props) {
      props.onChange?.(event.target.value)
    }
  }

  return (
    <label className={`${styles.field} ${className ?? ''}`}>
      <span className={styles.label}>{label}</span>
      <span className={styles.controlWrap}>
        {props.as === 'select' ? (
          <select className={styles.control} value={props.value} disabled={disabled} onChange={handleChange}>
            {props.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : props.as === 'static' ? (
          <span className={`${styles.control} ${styles.staticControl}`}>{props.value}</span>
        ) : (
          <input
            className={styles.control}
            value={props.value}
            placeholder={props.placeholder}
            disabled={disabled}
            onChange={handleChange}
          />
        )}
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </span>
    </label>
  )
}

export default FormField
