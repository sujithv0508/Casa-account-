import type { Account } from '../../types/account'
import { BoxIcon, BuildingIcon, CardIcon, EuroIcon, IdIcon, SearchIcon, UserIcon } from '../icons/Icons'
import styles from './CustomerSummary.module.css'

type CustomerSummaryProps = {
  account: Account
}

type Tone = 'blue' | 'mint' | 'lavender' | 'peach' | 'cyan' | 'pink'

const CustomerSummary = ({ account }: CustomerSummaryProps) => {
  const fields: { key: string; label: string; value: string; icon: typeof IdIcon; tone: Tone; lookup: boolean }[] = [
    { key: 'customerId', label: 'Customer ID', value: account.customerId, icon: IdIcon, tone: 'blue', lookup: true },
    { key: 'customerName', label: 'Customer Name', value: account.customerName, icon: UserIcon, tone: 'mint', lookup: false },
    { key: 'accountNo', label: 'Account No', value: account.accountNo, icon: CardIcon, tone: 'lavender', lookup: false },
    { key: 'product', label: 'Product', value: account.product, icon: BoxIcon, tone: 'peach', lookup: false },
    { key: 'currency', label: 'Currency', value: account.currency, icon: EuroIcon, tone: 'cyan', lookup: true },
    { key: 'branchCode', label: 'Branch Code', value: account.branch, icon: BuildingIcon, tone: 'pink', lookup: false },
  ]

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.headerIcon}>
          <BuildingIcon className={styles.headerIconSvg} />
        </span>
        <h2 className={styles.headerTitle}>Account Summary</h2>
      </div>
      <div className={styles.grid}>
        {fields.map((field) => {
          const Icon = field.icon
          return (
            <div key={field.key} className={styles.field}>
              <span className={`${styles.iconWrap} ${styles[`tone_${field.tone}`]}`}>
                <Icon className={styles.icon} />
              </span>
              <span className={styles.textCol}>
                <span className={styles.label}>{field.label}</span>
                <span className={`${styles.valueRow} ${styles.valueBox}`}>
                  <span className={styles.value}>{field.value}</span>
                  {field.lookup && <SearchIcon className={styles.searchIcon} />}
                </span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CustomerSummary
