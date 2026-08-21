import type { Account } from '../../types/account'
import SectionCard from '../SectionCard/SectionCard'
import formFieldStyles from '../FormField/FormField.module.css'
import SegmentedControl from '../SegmentedControl/SegmentedControl'
import { MessageIcon } from '../icons/Icons'
import styles from './CommunicationSection.module.css'

const communicationTypeOptions = ['Email', 'Post'] as const

type CommunicationSectionProps = {
  account: Account
  editable: boolean
  onChange: (value: string) => void
}

const CommunicationSection = ({ account, editable, onChange }: CommunicationSectionProps) => {
  return (
    <SectionCard icon={<MessageIcon />} title="Communication" tone="teal" reveal>
      <div className={styles.row}>
        <div className={formFieldStyles.field}>
          <span className={formFieldStyles.label}>Communication Type</span>
          <SegmentedControl
            ariaLabel="Communication Type"
            value={account.communicationType as (typeof communicationTypeOptions)[number]}
            options={communicationTypeOptions}
            disabled={!editable}
            onChange={onChange}
          />
        </div>
      </div>
    </SectionCard>
  )
}

export default CommunicationSection
