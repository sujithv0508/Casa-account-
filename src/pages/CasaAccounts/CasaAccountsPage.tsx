import { useMemo, useState } from 'react'
import { dummyAccounts } from '../../data/dummyAccounts'
import TopNav from '../../components/TopNav/TopNav'
import AccountSearch from '../../components/AccountSearch/AccountSearch'
import AccountTable from '../../components/AccountTable/AccountTable'
import styles from './CasaAccountsPage.module.css'

type Filters = {
  product: string
  customerId: string
  accountNo: string
  status: string
}

const initialFilters: Filters = {
  product: '',
  customerId: '',
  accountNo: '',
  status: '',
}

const CasaAccountsPage = () => {
  const [filters, setFilters] = useState<Filters>(initialFilters)

  const filteredAccounts = useMemo(() => {
    return dummyAccounts.filter((account) => {
      const productMatch = filters.product ? account.product === filters.product : true
      const customerMatch = filters.customerId ? account.customerId.includes(filters.customerId) : true
      const accountMatch = filters.accountNo ? account.accountNo.includes(filters.accountNo) : true
      const statusMatch = filters.status ? account.status === filters.status : true
      return productMatch && customerMatch && accountMatch && statusMatch
    })
  }, [filters])

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleReset = () => {
    setFilters(initialFilters)
  }

  return (
    <div className={styles.page}>
      <TopNav crumbs={['Core Banking', 'Accounts', 'CASA']} />

      <div className={styles.content}>
        <div className={styles.sectionTitle}>
          <h1>CASA Accounts</h1>
          <p>Browse and manage current accounts with a clean enterprise-style workflow.</p>
        </div>

        <AccountSearch filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />
        <AccountTable accounts={filteredAccounts} />
      </div>
    </div>
  )
}

export default CasaAccountsPage
