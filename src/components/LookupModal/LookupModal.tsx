import { Fragment, useMemo, useRef, useState } from 'react'
import Modal from '../Modal/Modal'
import { CheckCircleIcon, RefreshIcon, SearchIcon } from '../icons/Icons'
import styles from './LookupModal.module.css'

export type LookupOption = {
  primary: string
  secondary: string
}

type LookupModalProps = {
  primaryLabel: string
  secondaryLabel: string
  options: LookupOption[]
  selectedValue?: string
  onSelect: (option: LookupOption) => void
  onClose: () => void
}

const highlightMatch = (text: string, query: string) => {
  const trimmed = query.trim()
  if (!trimmed) return text
  const index = text.toLowerCase().indexOf(trimmed.toLowerCase())
  if (index === -1) return text
  return (
    <Fragment>
      {text.slice(0, index)}
      <mark className={styles.highlight}>{text.slice(index, index + trimmed.length)}</mark>
      {text.slice(index + trimmed.length)}
    </Fragment>
  )
}

const LookupModal = ({ primaryLabel, secondaryLabel, options, selectedValue, onSelect, onClose }: LookupModalProps) => {
  const [primaryQuery, setPrimaryQuery] = useState('')
  const [secondaryQuery, setSecondaryQuery] = useState('')
  const firstFieldRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    const p = primaryQuery.trim().toLowerCase()
    const s = secondaryQuery.trim().toLowerCase()
    return options.filter(
      (option) => (!p || option.primary.toLowerCase().includes(p)) && (!s || option.secondary.toLowerCase().includes(s)),
    )
  }, [options, primaryQuery, secondaryQuery])

  const handleClearCache = () => {
    setPrimaryQuery('')
    setSecondaryQuery('')
    firstFieldRef.current?.focus()
  }

  return (
    <Modal
      title="Select a value"
      onClose={onClose}
      maxWidth="820px"
      headerExtra={
        <button type="button" className={styles.clearCacheButton} onClick={handleClearCache}>
          <RefreshIcon className={styles.clearCacheIcon} />
          Clear cache
        </button>
      }
    >
      <div className={styles.wrap}>
        <div className={styles.filterRow}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>{primaryLabel}</span>
            <span className={styles.inputWrap}>
              <SearchIcon className={styles.fieldIcon} />
              <input
                ref={firstFieldRef}
                aria-label={`Search ${primaryLabel}`}
                placeholder="Search for keywords"
                value={primaryQuery}
                onChange={(event) => setPrimaryQuery(event.target.value)}
                autoFocus
              />
            </span>
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>{secondaryLabel}</span>
            <span className={styles.inputWrap}>
              <SearchIcon className={styles.fieldIcon} />
              <input
                aria-label={`Search ${secondaryLabel}`}
                placeholder="Search for keywords"
                value={secondaryQuery}
                onChange={(event) => setSecondaryQuery(event.target.value)}
              />
            </span>
          </label>
        </div>

        <div className={styles.resultsMeta}>
          {results.length} RESULT{results.length === 1 ? '' : 'S'}
        </div>

        <div className={styles.resultsArea}>
          {results.length === 0 ? (
            <div className={styles.stateMessage}>
              <p className={styles.emptyTitle}>No matches found</p>
              <p>Try adjusting your search keywords.</p>
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{primaryLabel}</th>
                    <th>{secondaryLabel}</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((option) => {
                    const isSelected = option.primary === selectedValue
                    return (
                      <tr
                        key={option.primary}
                        className={`${styles.row} ${isSelected ? styles.rowSelected : ''}`}
                        onClick={() => onSelect(option)}
                      >
                        <td>{highlightMatch(option.primary, primaryQuery)}</td>
                        <td className={styles.secondaryCell}>
                          <span>{highlightMatch(option.secondary, secondaryQuery)}</span>
                          {isSelected && <CheckCircleIcon className={styles.selectedIcon} />}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default LookupModal
