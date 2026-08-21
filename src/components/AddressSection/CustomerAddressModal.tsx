import type { Account } from '../../types/account'
import Modal from '../Modal/Modal'
import FormField from '../FormField/FormField'
import styles from './CustomerAddressModal.module.css'

type CustomerAddressModalProps = {
  account: Account
  onClose: () => void
}

const CustomerAddressModal = ({ account, onClose }: CustomerAddressModalProps) => {
  const fullAddress = [
    account.addressLine1,
    account.addressLine2,
    account.addressLine3,
    account.addressLine4,
    account.postalCode,
    account.country,
  ]
    .filter((part) => part && part !== '-')
    .join(', ')

  return (
    <Modal title="Customer Address" subtitle="Registered address on file for this account" onClose={onClose}>
      <p className={styles.fullAddress}>{fullAddress || 'No address on file'}</p>
      <div className={styles.grid}>
        <FormField as="static" label="Address Line 1" value={account.addressLine1 || '-'} />
        <FormField as="static" label="Address Line 2" value={account.addressLine2 || '-'} />
        <FormField as="static" label="Address Line 3" value={account.addressLine3 || '-'} />
        <FormField as="static" label="Address Line 4" value={account.addressLine4 || '-'} />
        <FormField as="static" label="Country" value={account.country || '-'} />
        <FormField as="static" label="Postal Code" value={account.postalCode || '-'} />
      </div>
    </Modal>
  )
}

export default CustomerAddressModal
