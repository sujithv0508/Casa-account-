import { useState } from 'react'
import type { Account } from '../../types/account'
import SectionCard from '../SectionCard/SectionCard'
import FormField from '../FormField/FormField'
import { LocationIcon, SearchIcon, UserIcon } from '../icons/Icons'
import CustomerAddressModal from './CustomerAddressModal'
import styles from './AddressSection.module.css'

type AddressSectionProps = {
  account: Account
  editable: boolean
  onFieldChange: (field: keyof Account, value: string) => void
}

const AddressSection = ({ account, editable, onFieldChange }: AddressSectionProps) => {
  const [showCustomerAddress, setShowCustomerAddress] = useState(false)

  return (
    <>
      <SectionCard
        icon={<LocationIcon />}
        title="Address"
        tone="teal"
        reveal
        action={
          <button type="button" className={styles.linkButton} onClick={() => setShowCustomerAddress(true)}>
            <UserIcon className={styles.linkIcon} />
            Customer Address
          </button>
        }
      >
        <div className={styles.gridFour}>
          <FormField
            as="input"
            label="Address Line 1"
            value={account.addressLine1}
            disabled={!editable}
            onChange={(value) => onFieldChange('addressLine1', value)}
          />
          <FormField
            as="input"
            label="Address Line 2"
            value={account.addressLine2}
            disabled={!editable}
            onChange={(value) => onFieldChange('addressLine2', value)}
          />
          <FormField
            as="input"
            label="Address Line 3"
            value={account.addressLine3}
            disabled={!editable}
            onChange={(value) => onFieldChange('addressLine3', value)}
          />
          <FormField
            as="input"
            label="Address Line 4"
            value={account.addressLine4 || '-'}
            disabled={!editable}
            onChange={(value) => onFieldChange('addressLine4', value)}
          />
        </div>
        <div className={styles.gridTwo}>
          <FormField
            as="input"
            label="Country"
            value={account.country}
            disabled={!editable}
            onChange={(value) => onFieldChange('country', value)}
            suffix={<SearchIcon className={styles.searchIcon} />}
          />
          <FormField
            as="input"
            label="Postal Code"
            value={account.postalCode}
            disabled={!editable}
            onChange={(value) => onFieldChange('postalCode', value)}
          />
        </div>
      </SectionCard>
      {showCustomerAddress && (
        <CustomerAddressModal account={account} onClose={() => setShowCustomerAddress(false)} />
      )}
    </>
  )
}

export default AddressSection
