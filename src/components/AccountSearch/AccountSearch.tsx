import styles from './AccountSearch.module.css'

type SearchFilters = {
  product: string
  customerId: string
  accountNo: string
  status: string
}

type AccountSearchProps = {
  filters: SearchFilters
  onFilterChange: (key: keyof SearchFilters, value: string) => void
  onReset: () => void
}

const AccountSearch = ({ filters, onFilterChange, onReset }: AccountSearchProps) => {
  return (
    <div className={styles.searchCard}>
      <div className={styles.filterRow}>
        <label className={styles.field}>
          <span>Product</span>
          <select value={filters.product} onChange={(event) => onFilterChange('product', event.target.value)}>
            <option value="">All</option>
            <option value="SAV_01">SAV_01</option>
            <option value="CUR_01">CUR_01</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>Customer ID</span>
          <input
            value={filters.customerId}
            placeholder="Enter customer ID"
            onChange={(event) => onFilterChange('customerId', event.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span>Account Number</span>
          <input
            value={filters.accountNo}
            placeholder="Enter account number"
            onChange={(event) => onFilterChange('accountNo', event.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span>Authorization Status</span>
          <select value={filters.status} onChange={(event) => onFilterChange('status', event.target.value)}>
            <option value="">All</option>
            <option value="Authorized">Authorized</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </label>
      </div>

      <div className={styles.buttonRow}>
        <button type="button" className={styles.resetButton} onClick={onReset}>
          Reset
        </button>
        <button type="button" className={styles.searchButton} onClick={() => {}}>
          Search
        </button>
      </div>
    </div>
  )
}

export default AccountSearch
