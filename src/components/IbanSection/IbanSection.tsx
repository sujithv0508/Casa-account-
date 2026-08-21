import { useState } from 'react'
import SectionCard from '../SectionCard/SectionCard'
import FormField from '../FormField/FormField'
import { CopyIcon, IbanIcon } from '../icons/Icons'
import styles from './IbanSection.module.css'

type IbanSectionProps = {
  ibanRequired: boolean
  ibanNumber: string
  editable: boolean
  onChange: (value: string) => void
}

const IbanSection = ({ ibanRequired, ibanNumber, editable, onChange }: IbanSectionProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ibanNumber)
    } catch {
      // clipboard unavailable, still show feedback
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <SectionCard
      icon={<IbanIcon />}
      title="IBAN Details"
      className={styles.card}
      tone="teal"
      reveal
    >
      <div className={styles.row}>
        <FormField as="static" label="IBAN Required" value={ibanRequired ? 'Yes (from product)' : 'No'} />
        <FormField
          as="input"
          label="IBAN Account No"
          value={ibanNumber}
          disabled={!editable}
          onChange={onChange}
          suffix={
            <button type="button" className={styles.copyButton} onClick={handleCopy} aria-label="Copy IBAN">
              <CopyIcon className={styles.copyIcon} />
            </button>
          }
        />
      </div>
      {copied && <span className={styles.copiedBadge}>Copied</span>}
    </SectionCard>
  )
}

export default IbanSection
