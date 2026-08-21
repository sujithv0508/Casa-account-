import { Fragment, useEffect, useRef, useState } from 'react'
import Modal from '../Modal/Modal'
import { RefreshIcon, SearchIcon } from '../icons/Icons'
import type { CustomerOption } from './CustomerSearchField'
import styles from './CustomerSearchModal.module.css'

const PAGE_SIZE = 10

type Filters = {
  clientNo: string
  name: string
  sector: string
  branch: string
}

const emptyFilters: Filters = { clientNo: '', name: '', sector: '', branch: '' }

const highlightMatch = (text: string, query: string) => {
  const trimmed = query.trim()
  if (!trimmed) return text
  const index = text.toLowerCase().indexOf(trimmed.toLowerCase())
  if (index === -1) return text
  return (
    <Fragment>
      {text.slice(0, index)}
      <mark className={styles.highlight}>{text.slice(index, index + trimmed.length)}</mark>
      {text.slice(index + trimmed.length)}
    </Fragment>
  )
}

const searchCustomerDirectory = (directory: CustomerOption[], filters: Filters): Promise<CustomerOption[]> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      const clientNo = filters.clientNo.trim().toLowerCase()
      const name = filters.name.trim().toLowerCase()
      const sector = filters.sector.trim().toLowerCase()
      const branch = filters.branch.trim().toLowerCase()
      resolve(
        directory.filter(
          (customer) =>
            (!clientNo || customer.customerNo.toLowerCase().includes(clientNo)) &&
            (!name || customer.customerName.toLowerCase().includes(name)) &&
            (!sector || customer.clientSector.toLowerCase().includes(sector)) &&
            (!branch || customer.branchCode.toLowerCase().includes(branch)),
        ),
      )
    }, 350)
  })

type CustomerSearchModalProps = {
  directory: CustomerOption[]
  primaryCustomerId?: string
  duplicateIds: string[]
  onSelect: (customer: CustomerOption) => void
  onClose: () => void
}

const CustomerSearchModal = ({ directory, primaryCustomerId, duplicateIds, onSelect, onClose }: CustomerSearchModalProps) => {
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [appliedFilters, setAppliedFilters] = useState<Filters>(emptyFilters)
  const [results, setResults] = useState<CustomerOption[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selectionError, setSelectionError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const requestIdRef = useRef(0)

  useEffect(() => {
    firstFieldRef.current?.focus()
    runSearch(emptyFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const runSearch = async (activeFilters: Filters) => {
    const requestId = ++requestIdRef.current
    setLoading(true)
    setErrorMessage(null)
    setSelectionError(null)
    setAppliedFilters(activeFilters)
    try {
      const data = await searchCustomerDirectory(directory, activeFilters)
      if (requestId !== requestIdRef.current) return
      setResults(data)
      setPage(1)
    } catch {
      if (requestId !== requestIdRef.current) return
      setErrorMessage('Unable to load customers. Please try again.')
    } finally {
      if (requestId === requestIdRef.current) setLoading(false)
    }
  }

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      runSearch(filters)
    }
  }

  const handleClearCache = () => {
    setFilters(emptyFilters)
    runSearch(emptyFilters)
    firstFieldRef.current?.focus()
  }

  const handleRowClick = (customer: CustomerOption) => {
    if (primaryCustomerId && customer.customerId === primaryCustomerId) {
      setSelectionError('The primary account customer cannot be added as a joint holder.')
      return
    }
    if (duplicateIds.includes(customer.customerNo)) {
      setSelectionError('This customer is already added as a joint holder.')
      return
    }
    onSelect(customer)
  }

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const pagedResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const rangeStart = results.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(page * PAGE_SIZE, results.length)

  return (
    <Modal
      title="Select value"
      onClose={onClose}
      maxWidth="1150px"
      headerExtra={
        <button type="button" className={styles.clearCacheButton} onClick={handleClearCache}>
          <RefreshIcon className={styles.clearCacheIcon} />
          Clear cache
        </button>
      }
    >
      <div className={styles.wrap}>
        <div className={styles.filterRow}>
          <label className={styles.field}>
            <SearchIcon className={styles.fieldIcon} />
            <input
              ref={firstFieldRef}
              aria-label="Client No"
              placeholder="Client No"
              value={filters.clientNo}
              onChange={(event) => handleFilterChange('clientNo', event.target.value)}
              onKeyDown={handleKeyDown}
            />
          </label>
          <label className={styles.field}>
            <SearchIcon className={styles.fieldIcon} />
            <input
              aria-label="Filter client name"
              placeholder="Filter client name"
              value={filters.name}
              onChange={(event) => handleFilterChange('name', event.target.value)}
              onKeyDown={handleKeyDown}
            />
          </label>
          <label className={styles.field}>
            <SearchIcon className={styles.fieldIcon} />
            <input
              aria-label="Filter client sector"
              placeholder="Filter client sector"
              value={filters.sector}
              onChange={(event) => handleFilterChange('sector', event.target.value)}
              onKeyDown={handleKeyDown}
            />
          </label>
          <label className={styles.field}>
            <SearchIcon className={styles.fieldIcon} />
            <input
              aria-label="Filter branch code"
              placeholder="Filter branch code"
              value={filters.branch}
              onChange={(event) => handleFilterChange('branch', event.target.value)}
              onKeyDown={handleKeyDown}
            />
          </label>
          <button type="button" className={styles.searchButton} onClick={() => runSearch(filters)}>
            <SearchIcon className={styles.searchButtonIcon} />
            Search
          </button>
        </div>

        {selectionError && <p className={styles.selectionError}>{selectionError}</p>}

        <div className={styles.resultsMeta}>
          {!loading && !errorMessage && (
            <span>
              {results.length} RESULT{results.length === 1 ? '' : 'S'}
            </span>
          )}
        </div>

        <div className={styles.resultsArea}>
          {loading ? (
            <div className={styles.stateMessage}>
              <span className={styles.spinner} />
              <p>Searching customers…</p>
            </div>
          ) : errorMessage ? (
            <div className={styles.stateMessage}>
              <p className={styles.errorTitle}>{errorMessage}</p>
              <button type="button" className={styles.retryButton} onClick={() => runSearch(filters)}>
                Retry
              </button>
            </div>
          ) : results.length === 0 ? (
            <div className={styles.stateMessage}>
              <p className={styles.emptyTitle}>No customers found</p>
              <p className={styles.emptyDesc}>Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Client No</th>
                    <th>Client Name</th>
                    <th>Client Sector</th>
                    <th>Branch Code</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedResults.map((customer) => {
                    const isPrimary = primaryCustomerId === customer.customerId
                    const isDuplicate = duplicateIds.includes(customer.customerNo)
                    const disabled = isPrimary || isDuplicate
                    return (
                      <tr
                        key={customer.customerId}
                        className={`${styles.row} ${disabled ? styles.rowDisabled : ''}`}
                        onClick={() => handleRowClick(customer)}
                      >
                        <td>{highlightMatch(customer.customerNo, appliedFilters.clientNo)}</td>
                        <td>{highlightMatch(customer.customerName, appliedFilters.name)}</td>
                        <td>{highlightMatch(customer.clientSector, appliedFilters.sector)}</td>
                        <td>
                          {highlightMatch(customer.branchCode, appliedFilters.branch)}
                          {disabled && (
                            <span className={styles.rowBadge}>
                              {isPrimary ? 'Primary holder' : 'Already added'}
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!loading && !errorMessage && results.length > 0 && pageCount > 1 && (
          <div className={styles.pagination}>
            <span className={styles.pageSummary}>
              Showing {rangeStart}–{rangeEnd} of {results.length}
            </span>
            <div className={styles.pageControls}>
              <button type="button" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
                Previous
              </button>
              <span>
                Page {page} of {pageCount}
              </span>
              <button type="button" disabled={page === pageCount} onClick={() => setPage((prev) => prev + 1)}>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default CustomerSearchModal
