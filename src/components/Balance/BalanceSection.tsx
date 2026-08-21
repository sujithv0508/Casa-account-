import SectionCard from '../SectionCard/SectionCard'
import { RefreshIcon, WalletIcon } from '../icons/Icons'
import styles from './BalanceSection.module.css'

export type BalanceData = {
  lastRefreshedAt: string
  limitAmount: number
  blockedAmount: number
  uncollectedAmount: number | null
  accountingBalance: number
  availableBalance: number
  authorizedBalance: number
}

type BalanceSectionProps = {
  data: BalanceData
  onRefresh: () => void
}

const formatAmount = (value: number | null) => {
  if (value === null) return '—'
  return value.toFixed(2)
}

const BalanceSection = ({ data, onRefresh }: BalanceSectionProps) => {
  return (
    <SectionCard
      icon={<WalletIcon />}
      title="Account Balance"
      subtitle={`Last refreshed at ${data.lastRefreshedAt}`}
      tone="teal"
      reveal
      action={
        <button type="button" className={styles.refreshButton} onClick={onRefresh}>
          <RefreshIcon className={styles.refreshIcon} />
          Refresh
        </button>
      }
    >
      <p className={styles.groupLabel}>Account Amounts</p>
      <div className={styles.grid}>
        <div className={styles.tile}>
          <p className={styles.label}>Limit Amount</p>
          <p className={styles.value}>{formatAmount(data.limitAmount)}</p>
        </div>
        <div className={styles.tile}>
          <p className={styles.label}>Blocked Amount</p>
          <p className={styles.value}>{formatAmount(data.blockedAmount)}</p>
        </div>
        <div className={styles.tile}>
          <p className={styles.label}>Uncollected Amount</p>
          <p className={`${styles.value} ${data.uncollectedAmount === null ? styles.valueEmpty : ''}`}>
            {formatAmount(data.uncollectedAmount)}
          </p>
        </div>
      </div>

      <p className={styles.groupLabel}>Computed Balances</p>
      <div className={styles.grid}>
        <div className={styles.tile}>
          <p className={styles.label}>Accounting Balance</p>
          <p className={`${styles.value} ${data.accountingBalance < 0 ? styles.valueNegative : ''}`}>
            {formatAmount(data.accountingBalance)}
          </p>
        </div>
        <div className={`${styles.tile} ${styles.tileHighlight}`}>
          <p className={styles.label}>Available Balance</p>
          <p className={`${styles.value} ${data.availableBalance < 0 ? styles.valueNegative : ''}`}>
            {formatAmount(data.availableBalance)}
          </p>
        </div>
        <div className={styles.tile}>
          <p className={styles.label}>Authorized Balance</p>
          <p className={`${styles.value} ${data.authorizedBalance < 0 ? styles.valueNegative : ''}`}>
            {formatAmount(data.authorizedBalance)}
          </p>
        </div>
      </div>
    </SectionCard>
  )
}

export default BalanceSection
