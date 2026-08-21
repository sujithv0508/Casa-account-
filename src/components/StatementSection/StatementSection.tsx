import type { Account } from '../../types/account'
import SectionCard from '../SectionCard/SectionCard'
import FormField from '../FormField/FormField'
import formFieldStyles from '../FormField/FormField.module.css'
import SegmentedToggle from '../SegmentedToggle/SegmentedToggle'
import SegmentedControl from '../SegmentedControl/SegmentedControl'
import { CalendarIcon } from '../icons/Icons'
import styles from './StatementSection.module.css'

const frequencyUnitOptions = ['Days', 'Months', 'Quarterly', 'Annually'] as const

type StatementSectionProps = {
  account: Account
  editable: boolean
  onFieldChange: (field: keyof Account, value: string) => void
  onStatementRequiredChange: (value: boolean) => void
}

const StatementSection = ({ account, editable, onFieldChange, onStatementRequiredChange }: StatementSectionProps) => {
  const statementRequired = account.statementRequired
  const configEditable = editable && statementRequired

  return (
    <SectionCard
      icon={<CalendarIcon />}
      title="Statement"
      tone="teal"
      reveal
      action={
        <div className={styles.requiredRow}>
          <span className={styles.requiredLabel}>Statement Required</span>
          <SegmentedToggle
            ariaLabel="Statement Required"
            value={statementRequired}
            onChange={onStatementRequiredChange}
            disabled={!editable}
          />
        </div>
      }
    >
      <div className={`${styles.gridThree} ${!statementRequired ? styles.muted : ''}`}>
        <FormField
          as="input"
          label="Frequency Value"
          value={account.statementFrequency}
          disabled={!configEditable}
          onChange={(value) => onFieldChange('statementFrequency', value)}
        />
        <div className={formFieldStyles.field}>
          <span className={formFieldStyles.label}>Frequency Unit</span>
          <SegmentedControl
            ariaLabel="Frequency Unit"
            value={(account.statementUnit || 'Months') as (typeof frequencyUnitOptions)[number]}
            options={frequencyUnitOptions}
            disabled={!configEditable}
            onChange={(value) => onFieldChange('statementUnit', value)}
          />
        </div>
        <FormField
          as="input"
          label="Statement Day"
          value={account.statementDay}
          placeholder="e.g. 1"
          disabled={!configEditable}
          onChange={(value) => onFieldChange('statementDay', value)}
        />
      </div>
    </SectionCard>
  )
}

export default StatementSection
