import { useState } from 'react'
import { SearchIcon } from '../icons/Icons'
import CustomerSearchModal from './CustomerSearchModal'
import styles from './CustomerSearchField.module.css'

export type CustomerOption = {
  customerId: string
  customerNo: string
  customerName: string
  clientSector: string
  branchCode: string
}

type CustomerSearchFieldProps = {
  value: string
  directory: CustomerOption[]
  primaryCustomerId?: string
  duplicateIds: string[]
  onSelect: (customer: CustomerOption) => void
}

const CustomerSearchField = ({ value, directory, primaryCustomerId, duplicateIds, onSelect }: CustomerSearchFieldProps) => {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.trigger} onClick={() => setModalOpen(true)}>
        <span className={value ? styles.triggerValue : styles.triggerPlaceholder}>{value || 'Select customer'}</span>
        <SearchIcon className={styles.searchIcon} />
      </button>

      {modalOpen && (
        <CustomerSearchModal
          directory={directory}
          primaryCustomerId={primaryCustomerId}
          duplicateIds={duplicateIds}
          onSelect={(customer) => {
            onSelect(customer)
            setModalOpen(false)
          }}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}

export default CustomerSearchField
