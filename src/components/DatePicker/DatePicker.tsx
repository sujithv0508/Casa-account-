import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CalendarIcon, ChevronRightIcon } from '../icons/Icons'
import styles from './DatePicker.module.css'

type DatePickerProps = {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const parseDMY = (value: string): Date | null => {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value.trim())
  if (!match) return null
  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null
  return date
}

const formatDMY = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
}

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const buildMonthGrid = (viewDate: Date) => {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const gridStart = new Date(year, month, 1 - firstOfMonth.getDay())
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + index)
    return date
  })
}

type PopoverCoords = { top: number; left: number; width: number }

const DatePicker = ({ value, onChange, disabled, placeholder }: DatePickerProps) => {
  const selectedDate = parseDMY(value)
  const [isOpen, setIsOpen] = useState(false)
  const [viewDate, setViewDate] = useState(selectedDate ?? new Date())
  const [coords, setCoords] = useState<PopoverCoords | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const updateCoords = () => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return
    setCoords({ top: rect.bottom + 6, left: rect.left, width: rect.width })
  }

  useEffect(() => {
    if (!isOpen) return
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        wrapRef.current &&
        !wrapRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    const handleReposition = () => updateCoords()
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    window.addEventListener('scroll', handleReposition, true)
    window.addEventListener('resize', handleReposition)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
      window.removeEventListener('scroll', handleReposition, true)
      window.removeEventListener('resize', handleReposition)
    }
  }, [isOpen])

  const handleToggle = () => {
    if (disabled) return
    setViewDate(selectedDate ?? new Date())
    setIsOpen((prev) => {
      const next = !prev
      if (next) updateCoords()
      return next
    })
  }

  const handleSelect = (date: Date) => {
    onChange(formatDMY(date))
    setIsOpen(false)
  }

  const today = new Date()
  const days = buildMonthGrid(viewDate)
  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.trigger} ${disabled ? styles.disabled : ''}`}
        disabled={disabled}
        onClick={handleToggle}
      >
        <span className={value ? styles.value : styles.placeholder}>{value || placeholder || 'Select date'}</span>
        <CalendarIcon className={styles.triggerIcon} />
      </button>

      {isOpen && coords && createPortal(
        <div
          ref={popoverRef}
          className={styles.popover}
          role="dialog"
          aria-label="Choose date"
          style={{ top: coords.top, left: coords.left, minWidth: coords.width }}
        >
          <div className={styles.header}>
            <button
              type="button"
              className={styles.navButton}
              aria-label="Previous month"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
            >
              <ChevronRightIcon className={styles.navIconPrev} />
            </button>
            <span className={styles.monthLabel}>{monthLabel}</span>
            <button
              type="button"
              className={styles.navButton}
              aria-label="Next month"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
            >
              <ChevronRightIcon className={styles.navIcon} />
            </button>
          </div>

          <div className={styles.weekdayRow}>
            {WEEKDAYS.map((day) => (
              <span key={day} className={styles.weekday}>
                {day}
              </span>
            ))}
          </div>

          <div className={styles.dayGrid}>
            {days.map((date) => {
              const inMonth = date.getMonth() === viewDate.getMonth()
              const isSelected = selectedDate ? isSameDay(date, selectedDate) : false
              const isToday = isSameDay(date, today)
              return (
                <button
                  type="button"
                  key={date.toISOString()}
                  className={`${styles.day} ${inMonth ? '' : styles.dayMuted} ${isSelected ? styles.daySelected : ''} ${
                    isToday && !isSelected ? styles.dayToday : ''
                  }`}
                  onClick={() => handleSelect(date)}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.todayButton}
              onClick={() => {
                setViewDate(today)
                handleSelect(today)
              }}
            >
              Today
            </button>
            {value && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={() => {
                  onChange('')
                  setIsOpen(false)
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}

export default DatePicker
