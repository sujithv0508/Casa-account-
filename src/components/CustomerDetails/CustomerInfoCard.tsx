import styles from './CustomerInfoCard.module.css'

type CustomerInfo = {
  id: string
  name: string
  accountNumber: string
  product: string
  currency: string
  branchCode: string
}

type CustomerInfoCardProps = {
  customer: CustomerInfo
}

const CustomerInfoCard = ({ customer }: CustomerInfoCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <div>
          <p className={styles.label}>Customer ID</p>
          <p className={styles.value}>{customer.id}</p>
        </div>
        <div>
          <p className={styles.label}>Customer Name</p>
          <p className={styles.value}>{customer.name}</p>
        </div>
      </div>
      <div className={styles.row}>
        <div>
          <p className={styles.label}>Account Number</p>
          <p className={styles.value}>{customer.accountNumber}</p>
        </div>
        <div>
          <p className={styles.label}>Product</p>
          <p className={styles.value}>{customer.product}</p>
        </div>
      </div>
      <div className={styles.row}>
        <div>
          <p className={styles.label}>Currency</p>
          <p className={styles.value}>{customer.currency}</p>
        </div>
        <div>
          <p className={styles.label}>Branch Code</p>
          <p className={styles.value}>{customer.branchCode}</p>
        </div>
      </div>
    </div>
  )
}

export default CustomerInfoCard
