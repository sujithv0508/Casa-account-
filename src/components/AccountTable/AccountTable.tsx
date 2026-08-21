import { useNavigate } from 'react-router-dom'
import type { Account } from '../../types/account'
import styles from './AccountTable.module.css'

type AccountTableProps = {
  accounts: Account[]
}

const AccountTable = ({ accounts }: AccountTableProps) => {
  const navigate = useNavigate()

  return (
    <div className={styles.tableCard}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Account No</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Currency</th>
            <th>Branch</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.accountId}>
              <td>{account.accountNo}</td>
              <td>{`${account.customerId} — ${account.customerName}`}</td>
              <td>{account.product}</td>
              <td>{account.currency}</td>
              <td>{account.branch}</td>
              <td>
                <span className={`${styles.statusBadge} ${styles[account.status.toLowerCase()]}`}>
                  {account.status}
                </span>
              </td>
              <td>
                <button type="button" className={styles.viewButton} onClick={() => navigate(`/casa/${account.accountId}`)}>
                  View
                </button>
              </td>
            </tr>
          ))}
          {accounts.length === 0 && (
            <tr>
              <td colSpan={7} className={styles.emptyState}>
                No accounts found for the selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default AccountTable
