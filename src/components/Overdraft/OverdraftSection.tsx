import SectionCard from '../SectionCard/SectionCard'
import { OverdraftIcon } from '../icons/Icons'
import DatePicker from '../DatePicker/DatePicker'
import SegmentedControl from '../SegmentedControl/SegmentedControl'
import styles from './OverdraftSection.module.css'

const transferTypeOptions = ['Amount', 'Percentage'] as const
const statusOptions = ['Active', 'Inactive'] as const

export type OverdraftData = {
  startDate: string
  endDate: string
  transferType: 'Amount' | 'Percentage'
  transferValue: string
  limitAmount: string
  utilizedAmount: string
  status: 'Active' | 'Inactive'
}

type OverdraftSectionProps = {
  data: OverdraftData
  editable: boolean
  onChange: <Field extends keyof OverdraftData>(field: Field, value: OverdraftData[Field]) => void
}

const formatAmount = (value: number) =>
  value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const OverdraftSection = ({ data, editable, onChange }: OverdraftSectionProps) => {
  const availableAmount = (Number(data.limitAmount) || 0) - (Number(data.utilizedAmount) || 0)

  return (
    <SectionCard icon={<OverdraftIcon />} title="Overdraft" tone="teal" reveal>
      <div className={styles.grid}>
        <div className={styles.field}>
          <span>
            Start Date <span className={styles.required}>*</span>
          </span>
          <DatePicker
            value={data.startDate}
            disabled={!editable}
            onChange={(value) => onChange('startDate', value)}
          />
        </div>

        <div className={styles.field}>
          <span>End Date</span>
          <DatePicker
            value={data.endDate}
            disabled={!editable}
            onChange={(value) => onChange('endDate', value)}
          />
          <span className={styles.helper}>Leave blank for an open-ended overdraft.</span>
        </div>

        <div className={styles.field}>
          <span>Transfer Type</span>
          <SegmentedControl
            value={data.transferType}
            options={transferTypeOptions}
            disabled={!editable}
            ariaLabel="Transfer Type"
            onChange={(value) => onChange('transferType', value)}
          />
        </div>

        <label className={styles.field}>
          <span>Transfer Amount/Percentage</span>
          <input
            value={data.transferValue}
            disabled={!editable}
            onChange={(event) => onChange('transferValue', event.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span>Limit Amount</span>
          <input
            value={data.limitAmount}
            disabled={!editable}
            onChange={(event) => onChange('limitAmount', event.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span>Available Amount</span>
          <input value={formatAmount(availableAmount)} disabled />
        </label>

        <label className={styles.field}>
          <span>Utilized Amount</span>
          <input
            value={data.utilizedAmount}
            disabled={!editable}
            onChange={(event) => onChange('utilizedAmount', event.target.value)}
          />
        </label>

        <div className={styles.field}>
          <span>Status</span>
          <SegmentedControl
            value={data.status}
            options={statusOptions}
            disabled={!editable}
            ariaLabel="Status"
            onChange={(value) => onChange('status', value)}
          />
        </div>
      </div>
    </SectionCard>
  )
}

export default OverdraftSection
