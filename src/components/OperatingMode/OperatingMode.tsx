import type { Account } from '../../types/account'
import SectionCard from '../SectionCard/SectionCard'
import formFieldStyles from '../FormField/FormField.module.css'
import SegmentedControl from '../SegmentedControl/SegmentedControl'
import DatePicker from '../DatePicker/DatePicker'
import { ModeIcon } from '../icons/Icons'
import styles from './OperatingMode.module.css'

const operatingModeOptions = ['Single', 'Joint'] as const

const isoToDmy = (iso: string) => {
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(iso.trim())
  if (!match) return ''
  const [, year, month, day] = match
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
}

const dmyToIso = (dmy: string) => {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(dmy.trim())
  if (!match) return ''
  const [, day, month, year] = match
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

type OperatingModeProps = {
  account: Account
  editable: boolean
  onModeChange: (value: string) => void
  onOpeningDateChange: (value: string) => void
}

const OperatingMode = ({ account, editable, onModeChange, onOpeningDateChange }: OperatingModeProps) => {
  return (
    <SectionCard icon={<ModeIcon />} title="Operating Mode" tone="teal" reveal>
      <div className={styles.row}>
        <div className={formFieldStyles.field}>
          <span className={formFieldStyles.label}>Operating Mode</span>
          <SegmentedControl
            ariaLabel="Operating Mode"
            value={account.operatingMode as (typeof operatingModeOptions)[number]}
            options={operatingModeOptions}
            disabled={!editable}
            onChange={onModeChange}
          />
        </div>
        <div className={formFieldStyles.field}>
          <span className={formFieldStyles.label}>Account Open Date</span>
          <DatePicker
            value={isoToDmy(account.openingDate)}
            disabled={!editable}
            onChange={(value) => onOpeningDateChange(dmyToIso(value))}
          />
        </div>
      </div>
    </SectionCard>
  )
}

export default OperatingMode
