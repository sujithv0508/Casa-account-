import Modal from '../Modal/Modal'
import { BuildingIcon, PricingIcon } from '../icons/Icons'
import modalStyles from '../AccountModals/AccountModals.module.css'
import styles from './ComponentConfigModal.module.css'
import type { ComponentRow } from './AccountComponentsSection'

type ConfigFieldSpec = {
  label: string
  field: keyof ComponentRow | '__final__'
  kind: 'text' | 'select'
  options?: string[]
}

type ConfigSection = {
  title: string
  fields: ConfigFieldSpec[]
}

const configSections: ConfigSection[] = [
  {
    title: 'General',
    fields: [
      { label: 'Component Code', field: 'componentCode', kind: 'text' },
      { label: 'Name', field: 'name', kind: 'text' },
      { label: 'Component Type', field: 'componentType', kind: 'select', options: ['INTEREST', 'TAX'] },
      { label: 'D/C', field: 'drCr', kind: 'select', options: ['DR', 'CR'] },
      { label: 'Basis', field: 'basis', kind: 'text' },
      { label: 'Type', field: 'type', kind: 'select', options: ['RATE_CODE', 'RATE'] },
    ],
  },
  {
    title: 'Rate Parameters',
    fields: [
      { label: 'Rate or Amount', field: 'rateOrAmount', kind: 'text' },
      { label: 'Rate Code', field: 'rateCode', kind: 'text' },
      { label: 'Spread', field: 'spread', kind: 'text' },
      { label: 'Final Rate or Amount', field: '__final__', kind: 'text' },
    ],
  },
  {
    title: 'Liquidation',
    fields: [
      { label: 'Interest Basis', field: 'interestBasis', kind: 'text' },
      { label: 'Liquidation Preference', field: 'liquidationPreference', kind: 'text' },
      { label: 'Liquidation Frequency', field: 'liquidationFrequency', kind: 'text' },
      { label: 'Parent Component', field: 'parentComponent', kind: 'text' },
      { label: 'Liquidation Date', field: 'liquidationDate', kind: 'text' },
    ],
  },
  {
    title: 'Other Settings',
    fields: [
      { label: 'Liquidation Order', field: 'liquidationOrder', kind: 'text' },
      { label: 'Effective Date', field: 'effectiveDate', kind: 'text' },
      { label: 'Accrual Required', field: 'accrualRequired', kind: 'select', options: ['Yes', 'No'] },
      { label: 'Force Debit', field: 'forceDebit', kind: 'select', options: ['Yes', 'No'] },
      { label: 'Accrued Till Date', field: 'accruedTillDate', kind: 'text' },
    ],
  },
]

const finalAmount = (row: ComponentRow) => {
  const rate = Number(row.rateOrAmount) || 0
  const spread = Number(row.spread) || 0
  return (rate + spread).toFixed(2)
}

type ComponentConfigModalProps = {
  row: ComponentRow
  editable: boolean
  onChange: <Field extends keyof ComponentRow>(id: string, field: Field, value: ComponentRow[Field]) => void
  onClose: () => void
}

const ComponentConfigModal = ({ row, editable, onChange, onClose }: ComponentConfigModalProps) => {
  const updateField = (field: keyof ComponentRow, value: string) => {
    ;(onChange as (id: string, field: keyof ComponentRow, value: string) => void)(row.id, field, value)
  }

  const Icon = row.componentType === 'INTEREST' ? PricingIcon : BuildingIcon
  const tone = row.componentType === 'INTEREST' ? styles.tone_blue : styles.tone_orange

  return (
    <Modal
      title="Component Configuration"
      subtitle={`${row.componentCode} • ${row.componentType}`}
      onClose={onClose}
      maxWidth="720px"
      footer={
        <>
          <button type="button" className={modalStyles.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={styles.applyButton} onClick={onClose}>
            Save Changes
          </button>
        </>
      }
    >
      <div className={styles.summaryBlock}>
        <span className={`${styles.summaryIconWrap} ${tone}`}>
          <Icon className={styles.summaryIcon} />
        </span>
        <div className={styles.summaryText}>
          <span className={styles.summaryCode}>{row.componentCode}</span>
          <span className={styles.summaryType}>{row.componentType}</span>
        </div>
        <div className={styles.summaryFinal}>
          <span className={styles.summaryFinalLabel}>Final Rate</span>
          <span className={styles.summaryFinalValue}>{finalAmount(row)}</span>
        </div>
      </div>

      {configSections.map((section) => (
        <div key={section.title} className={styles.section}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionAccent} />
            <span>{section.title}</span>
          </div>
          <div className={styles.sectionGrid}>
            {section.fields.map((spec) => {
              const isFinal = spec.field === '__final__'
              const isCode = spec.field === 'componentCode'
              const isRateCode = spec.field === 'rateCode'
              const value = isFinal ? finalAmount(row) : String(row[spec.field as keyof ComponentRow] ?? '')
              const disabled = !editable || isFinal || isCode || (isRateCode && row.type !== 'RATE_CODE')

              return (
                <label key={spec.label} className={styles.field}>
                  <span className={styles.fieldLabel}>{spec.label}</span>
                  {spec.kind === 'select' ? (
                    <select
                      className={styles.fieldControl}
                      value={value}
                      disabled={disabled}
                      onChange={(event) => updateField(spec.field as keyof ComponentRow, event.target.value)}
                    >
                      {spec.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className={styles.fieldControl}
                      value={value}
                      placeholder="—"
                      disabled={disabled}
                      onChange={(event) => updateField(spec.field as keyof ComponentRow, event.target.value)}
                    />
                  )}
                </label>
              )
            })}
          </div>
        </div>
      ))}
    </Modal>
  )
}

export default ComponentConfigModal
