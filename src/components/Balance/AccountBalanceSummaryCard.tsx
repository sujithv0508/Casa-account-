import SectionCard from '../SectionCard/SectionCard'
import { ChevronRightIcon, WalletIcon } from '../icons/Icons'
import CountUpNumber from '../AccountComponents/CountUpNumber'
import { formatCurrencyAmount, getCurrencySymbol } from '../../utils/currency'
import type { BalanceData } from './BalanceSection'
import BalanceIllustration, { type BalanceMood } from './BalanceIllustration'
import styles from './AccountBalanceSummaryCard.module.css'

type AccountBalanceSummaryCardProps = {
  data: BalanceData
  currency: string
  onViewDetails: () => void
}

const formatRowValue = (value: number | null, currency: string) =>
  value === null ? '—' : formatCurrencyAmount(value, currency)

const getBalanceMood = (value: number): BalanceMood => {
  if (value < 0) return 'negative'
  if (value > 0) return 'positive'
  return 'zero'
}

const AccountBalanceSummaryCard = ({ data, currency, onViewDetails }: AccountBalanceSummaryCardProps) => {
  const isNegative = data.availableBalance < 0
  const mood = getBalanceMood(data.availableBalance)

  const rows: { label: string; value: number | null; negative?: boolean }[] = [
    { label: 'Ledger Balance', value: data.accountingBalance, negative: data.accountingBalance < 0 },
    { label: 'Blocked Amount', value: data.blockedAmount },
  ]

  return (
    <SectionCard
      icon={<WalletIcon />}
      title="Account Balance"
      subtitle="Balance summary for this account"
      tone="teal"
      reveal
      className={styles.card}
      bodyClassName={styles.body}
    >
      <div
        className={`${styles.hero} ${mood === 'negative' ? styles.heroNegative : ''} ${mood === 'positive' ? styles.heroPositive : ''}`}
      >
        <div className={styles.heroText}>
          <span className={styles.heroLabel}>Available Balance</span>
          <span className={`${styles.heroValue} ${isNegative ? styles.heroValueNegative : ''}`}>
            <CountUpNumber value={data.availableBalance} prefix={getCurrencySymbol(currency)} decimals={2} durationMs={900} />
          </span>
          <span className={styles.heroAsOf}>As on {data.lastRefreshedAt}</span>
        </div>
        <BalanceIllustration mood={mood} className={styles.heroIllustration} />
      </div>

      <div className={styles.rows}>
        {rows.map((row) => (
          <div className={styles.row} key={row.label}>
            <span className={styles.rowLabel}>{row.label}</span>
            <span className={`${styles.rowValue} ${row.negative ? styles.rowValueNegative : ''}`}>
              {formatRowValue(row.value, currency)}
            </span>
          </div>
        ))}
      </div>

      <button type="button" className={styles.detailsLink} onClick={onViewDetails}>
        View Balance Details
        <ChevronRightIcon className={styles.detailsIcon} />
      </button>
    </SectionCard>
  )
}

export default AccountBalanceSummaryCard
