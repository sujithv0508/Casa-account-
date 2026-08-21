import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dummyAccounts, dummyCustomers } from '../../data/dummyAccounts'
import { dummyJointHolders } from '../../data/dummyJointHolders'
import type { Account } from '../../types/account'
import TopNav from '../../components/TopNav/TopNav'
import type { WorkflowStatus } from '../../components/AccountHero/AccountHero'
import AccountHeader from '../../components/AccountHeader/AccountHeader'
import CustomerSummary from '../../components/CustomerSummary/CustomerSummary'
import CasaTabs from '../../components/CasaTabs/CasaTabs'
import AccountFacilities, { type FacilitiesState } from '../../components/AccountFacilities/AccountFacilities'
import IbanSection from '../../components/IbanSection/IbanSection'
import AccountStatus, { type StatusFlags } from '../../components/AccountStatus/AccountStatus'
import OperatingMode from '../../components/OperatingMode/OperatingMode'
import AddressSection from '../../components/AddressSection/AddressSection'
import StatementSection from '../../components/StatementSection/StatementSection'
import CommunicationSection from '../../components/CommunicationSection/CommunicationSection'
import AuditHistory, { type AuditTrailInfo } from '../../components/AuditHistory/AuditHistory'
import BalanceSection, { type BalanceData } from '../../components/Balance/BalanceSection'
import AccountBalanceSummaryCard from '../../components/Balance/AccountBalanceSummaryCard'
import DocumentsSection, { type DocumentItem } from '../../components/Documents/DocumentsSection'
import AddDocumentModal, { type NewDocumentInput } from '../../components/Documents/AddDocumentModal'
import DocumentPreviewModal from '../../components/Documents/DocumentPreviewModal'
import GlPairSection from '../../components/GlPair/GlPairSection'
import JointAccountSection, { type JointHolder } from '../../components/JointAccount/JointAccountSection'
import type { CustomerOption } from '../../components/JointAccount/CustomerSearchField'
import AuthorizedSignatorySection, {
  type SignatoryGroup,
  type SignatoryMember,
  defaultSignatoryGroups,
} from '../../components/AuthorizedSignatory/AuthorizedSignatorySection'
import OverdraftSection, { type OverdraftData } from '../../components/Overdraft/OverdraftSection'
import AccountComponentsSection, { type ComponentRow, defaultComponents } from '../../components/AccountComponents/AccountComponentsSection'
import type { ComponentFormInput } from '../../components/AccountComponents/ComponentFormModal'
import InterestSummaryCard from '../../components/AccountComponents/InterestSummaryCard'
import BottomActionBar from '../../components/BottomActionBar/BottomActionBar'
import AuthorizationModal, { type ChangeEntry } from '../../components/AccountModals/AuthorizationModal'
import ConfirmDialog from '../../components/AccountModals/ConfirmDialog'
import HistoryModal from '../../components/AccountModals/HistoryModal'
import StatusChangeModal from '../../components/AccountModals/StatusChangeModal'
import type { UserRole } from '../../components/RoleSwitcher/RoleSwitcher'
import styles from './CasaAccountDetailsPage.module.css'

const formatTime = (date: Date) =>
  date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })

const formatDateTime = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const tabs = [
  'General',
  'Documents',
  'Joint',
  'Component',
  'Authorized Signatory',
  'Overdraft',
  'Status',
  'Balance',
  'Audit',
] as const

type Tab = (typeof tabs)[number]

type AuditEntry = {
  timestamp: string
  action: string
  user: string
  activity: string
}

const auditEntries: AuditEntry[] = [
  { timestamp: '2026-08-10 09:22', action: 'Created account', user: 'R. Mehta', activity: 'Initial application submitted for review.' },
  { timestamp: '2026-08-10 10:15', action: 'KYC submitted', user: 'S. Kapoor', activity: 'Customer ID and address proof verified.' },
  { timestamp: '2026-08-10 11:05', action: 'Authorization requested', user: 'A. Thomas', activity: 'Account routed for second-level review.' },
]

const auditTrail: AuditTrailInfo = {
  createdBy: 'SYSTEM',
  createdDate: '2026-07-03T11:15:54.024534',
  checkedBy: undefined,
  checkedDate: undefined,
  updatedBy: 'admin',
  updatedDate: '2026-07-08T09:16:43.160855',
}

const statusToneMap: Record<Account['status'], { label: string; tone: 'success' | 'warning' | 'danger' }> = {
  Authorized: { label: 'Active', tone: 'success' },
  Pending: { label: 'Pending', tone: 'warning' },
  Rejected: { label: 'Rejected', tone: 'danger' },
}

const defaultFacilities: FacilitiesState = { atm: false, cheque: false, overdraft: false, pricing: false }

const accountFieldLabels: Partial<Record<keyof Account, string>> = {
  operatingMode: 'Operating Mode',
  ibanNumber: 'IBAN Number',
  addressLine1: 'Address Line 1',
  addressLine2: 'Address Line 2',
  addressLine3: 'Address Line 3',
  addressLine4: 'Address Line 4',
  country: 'Country',
  postalCode: 'Postal Code',
  dormant: 'Dormant',
  frozen: 'Frozen',
  noDebits: 'No Debits',
  noCredits: 'No Credits',
  statementRequired: 'Statement Required',
  statementFrequency: 'Statement Frequency',
  statementUnit: 'Statement Unit',
  statementDay: 'Statement Day',
  communicationType: 'Communication Type',
}

const facilityLabels: Record<keyof FacilitiesState, string> = {
  atm: 'ATM',
  cheque: 'Cheque Book',
  overdraft: 'Overdraft Facility',
  pricing: 'Account Pricing',
}

const emptyOverdraftData: OverdraftData = {
  startDate: '',
  endDate: '',
  transferType: 'Amount',
  transferValue: '',
  limitAmount: '',
  utilizedAmount: '0.00',
  status: 'Inactive',
}

const toOverdraftData = (source: Account | null): OverdraftData =>
  source
    ? {
        startDate: source.overdraftStartDate,
        endDate: source.overdraftEndDate,
        transferType: source.overdraftTransferType,
        transferValue: source.overdraftTransferValue,
        limitAmount: source.overdraftLimitAmount,
        utilizedAmount: source.overdraftUtilizedAmount,
        status: source.overdraftStatus,
      }
    : emptyOverdraftData

const computeChanges = (
  originalAccount: Account,
  currentAccount: Account,
  originalFacilities: FacilitiesState,
  currentFacilities: FacilitiesState,
  originalDocuments: DocumentItem[],
  currentDocuments: DocumentItem[],
  currentJointHolders: JointHolder[],
): ChangeEntry[] => {
  const entries: ChangeEntry[] = []

  ;(Object.keys(accountFieldLabels) as (keyof Account)[]).forEach((key) => {
    const label = accountFieldLabels[key]
    if (!label) return
    const rawBefore = originalAccount[key]
    const rawAfter = currentAccount[key]
    const before = typeof rawBefore === 'boolean' ? (rawBefore ? 'Yes' : 'No') : String(rawBefore ?? '')
    const after = typeof rawAfter === 'boolean' ? (rawAfter ? 'Yes' : 'No') : String(rawAfter ?? '')
    if (before !== after) {
      entries.push({ field: String(key), label, before: before || '—', after: after || '—' })
    }
  })

  ;(Object.keys(facilityLabels) as (keyof FacilitiesState)[]).forEach((key) => {
    if (originalFacilities[key] !== currentFacilities[key]) {
      entries.push({
        field: `facility-${key}`,
        label: facilityLabels[key],
        before: originalFacilities[key] ? 'Yes' : 'No',
        after: currentFacilities[key] ? 'Yes' : 'No',
      })
    }
  })

  originalDocuments.forEach((original) => {
    const current = currentDocuments.find((doc) => doc.id === original.id)
    if (!current) {
      entries.push({ field: `doc-remove-${original.id}`, label: `Document Removed: ${original.documentName}`, before: 'Attached', after: 'Removed' })
      return
    }
    if (current.status === 'pendingDelete' && original.status !== 'pendingDelete') {
      entries.push({ field: `doc-remove-${original.id}`, label: `Document Removed: ${original.documentName}`, before: 'Attached', after: 'Removed' })
      return
    }
    const documentFieldLabels: Partial<Record<keyof DocumentItem, string>> = {
      documentType: 'Document Type',
      documentName: 'Document Name',
      issueCountry: 'Issue Country',
      issueDate: 'Issue Date',
      expiryDate: 'Expiry Date',
      remarks: 'Remarks',
      verified: 'Verified',
      fileName: 'File',
    }
    ;(Object.keys(documentFieldLabels) as (keyof DocumentItem)[]).forEach((key) => {
      const label = documentFieldLabels[key]
      if (!label) return
      const rawBefore = original[key]
      const rawAfter = current[key]
      const before = typeof rawBefore === 'boolean' ? (rawBefore ? 'Yes' : 'No') : String(rawBefore ?? '')
      const after = typeof rawAfter === 'boolean' ? (rawAfter ? 'Yes' : 'No') : String(rawAfter ?? '')
      if (before !== after) {
        entries.push({
          field: `doc-${original.id}-${key}`,
          label: `${original.documentName || 'Document'} — ${label}`,
          before: before || '—',
          after: after || '—',
        })
      }
    })
  })

  currentDocuments
    .filter((doc) => !originalDocuments.some((original) => original.id === doc.id))
    .forEach((doc) => {
      entries.push({ field: `doc-add-${doc.id}`, label: `Document Added: ${doc.documentName}`, before: '—', after: 'Attached' })
    })

  currentJointHolders.forEach((holder) => {
    if (holder.status === 'pendingAdd') {
      entries.push({
        field: `joint-add-${holder.id}`,
        label: `Joint Holder Added: ${holder.customerName || holder.customerNo || 'Unnamed'}`,
        before: '—',
        after: `${holder.customerNo} · ${holder.relationship || 'Relationship not set'}`,
      })
    }
    if (holder.status === 'pendingDelete') {
      entries.push({
        field: `joint-remove-${holder.id}`,
        label: `Joint Holder Removed: ${holder.customerName || holder.customerNo}`,
        before: `${holder.customerNo} · ${holder.relationship}`,
        after: 'Removed',
      })
    }
  })

  return entries
}

const CasaAccountDetailsPage = () => {
  const { accountId } = useParams()
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState<Tab>('General')
  const [previousTab, setPreviousTab] = useState<Tab | null>(null)
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right'>('left')
  const [isAnimating, setIsAnimating] = useState(false)
  const [wrapperHeight, setWrapperHeight] = useState<number | undefined>()
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const tabPanelWrapperRef = useRef<HTMLDivElement | null>(null)
  const previousPanelRef = useRef<HTMLDivElement | null>(null)
  const currentPanelRef = useRef<HTMLDivElement | null>(null)
  const [account, setAccount] = useState<Account | null>(
    () => dummyAccounts.find((item) => item.accountId === accountId) ?? null,
  )
  const authorizedAccountRef = useRef<Account | null>(account)
  const [toast, setToast] = useState('')
  const [copied, setCopied] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false)
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null)
  const [documentToDeleteId, setDocumentToDeleteId] = useState<string | null>(null)
  const [previewDocument, setPreviewDocument] = useState<DocumentItem | null>(null)
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>('view')
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)
    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  const handleTabSelect = (tab: Tab) => {
    if (tab === selectedTab) return
    const nextIndex = tabs.indexOf(tab)
    const currentIndex = tabs.indexOf(selectedTab)
    const direction = nextIndex > currentIndex ? 'left' : 'right'

    if (prefersReducedMotion) {
      setSelectedTab(tab)
      setPreviousTab(null)
      setIsAnimating(false)
      setWrapperHeight(undefined)
      setTransitionDirection(direction)
      return
    }

    setPreviousTab(selectedTab)
    setSelectedTab(tab)
    setTransitionDirection(direction)
    setIsAnimating(true)
  }

  useEffect(() => {
    if (!isAnimating || !previousTab) return

    const wrapper = tabPanelWrapperRef.current
    const entering = currentPanelRef.current
    const leaving = previousPanelRef.current
    if (!wrapper || !entering || !leaving) return

    const previousHeight = leaving.getBoundingClientRect().height
    const currentHeight = entering.getBoundingClientRect().height
    setWrapperHeight(previousHeight)

    requestAnimationFrame(() => {
      if (wrapper) wrapper.style.height = `${previousHeight}px`
      requestAnimationFrame(() => setWrapperHeight(currentHeight))
    })

    const timeout = window.setTimeout(() => {
      setIsAnimating(false)
      setPreviousTab(null)
      setWrapperHeight(undefined)
    }, 360)

    return () => window.clearTimeout(timeout)
  }, [isAnimating, previousTab, selectedTab])

  const renderTabContent = (tab: Tab) => {
    if (!account) return null
    switch (tab) {
      case 'General':
        return (
          <>
            <div className={styles.evenGrid}>
              <AccountFacilities state={facilities} editable={isEditing} onToggle={handleToggleFacility} />
              <AccountStatus
                account={account}
                editable={isEditing}
                onToggle={handleToggleStatus}
                onViewHistory={() => setShowHistoryModal(true)}
                onStatusChange={() => setShowStatusModal(true)}
              />
            </div>
            <div className={styles.generalGrid}>
              <IbanSection
                ibanRequired={ibanRequired}
                ibanNumber={account.ibanNumber}
                editable={isEditing}
                onChange={(value) => handleFieldChange('ibanNumber', value)}
              />
              <StatementSection
                account={account}
                editable={isEditing}
                onFieldChange={handleFieldChange}
                onStatementRequiredChange={handleStatementRequiredChange}
              />
            </div>
            <div className={styles.generalGrid}>
              <OperatingMode
                account={account}
                editable={isEditing}
                onModeChange={(value) => handleFieldChange('operatingMode', value)}
                onOpeningDateChange={(value) => handleFieldChange('openingDate', value)}
              />
              <CommunicationSection
                account={account}
                editable={isEditing}
                onChange={(value) => handleFieldChange('communicationType', value)}
              />
            </div>
            <AddressSection account={account} editable={isEditing} onFieldChange={handleFieldChange} />
          </>
        )
      case 'Documents':
        return (
          <DocumentsSection
            documents={documents}
            editable={isEditing}
            onAdd={handleAddDocument}
            onView={handleViewDocument}
            onEdit={handleEditDocument}
            onDelete={handleRequestDeleteDocument}
            onUndoDelete={handleUndoDeleteDocument}
          />
        )
      case 'Joint':
        return (
          <JointAccountSection
            holders={jointHolders}
            editable={isEditing && isJointEnabled}
            dependencyNotice={isJointEnabled ? undefined : jointDependencyNotice}
            primaryCustomerId={account.customerId}
            customerDirectory={dummyCustomers}
            onAddHolder={handleAddJointHolder}
            onRemoveHolder={handleRemoveJointHolder}
            onHolderFieldChange={handleJointHolderFieldChange}
            onSelectHolderCustomer={handleSelectJointHolderCustomer}
          />
        )
      case 'Component':
        return (
          <AccountComponentsSection
            components={components}
            editable
            onChange={handleComponentChange}
            onAddComponent={handleAddComponent}
            onImportComponents={handleImportComponents}
            onDelete={handleDeleteComponent}
          />
        )
      case 'Authorized Signatory':
        return (
          <AuthorizedSignatorySection
            groups={signatoryGroups}
            editable
            onAddGroup={handleAddGroup}
            onDeleteGroup={handleDeleteGroup}
            onGroupFieldChange={handleGroupFieldChange}
            onAddMember={handleAddMember}
            onDeleteMember={handleDeleteMember}
            onMemberFieldChange={handleMemberFieldChange}
            onSelectSignature={handleSelectSignature}
          />
        )
      case 'Overdraft':
        return <OverdraftSection data={overdraftData} editable={isEditing} onChange={updateOverdraftData} />
      case 'Status':
        return (
          <GlPairSection
            product={account.product}
            lastCreditDate={undefined}
            lastDebitDate={undefined}
            lastActivityDate={undefined}
            glPairs={[]}
          />
        )
      case 'Balance':
        return <BalanceSection data={balanceData} onRefresh={handleRefreshBalance} />
      case 'Audit':
        return (
          <AuditHistory
            authorization={{
              status: isPendingAuthorization ? 'Pending Authorization' : account.status,
              tone: isPendingAuthorization ? 'warning' : statusMeta.tone,
              active: false,
              changeVersion,
              deleted: false,
            }}
            trail={{
              createdBy: auditTrail.createdBy,
              createdDate: auditTrail.createdDate,
              checkedBy: authorizedByChecker ?? auditTrail.checkedBy,
              checkedDate: authorizedDateChecker ?? auditTrail.checkedDate,
              updatedBy: changedBy ?? auditTrail.updatedBy,
              updatedDate: submittedDate ?? auditTrail.updatedDate,
            }}
          />
        )
      default:
        return null
    }
  }

  const [facilities, setFacilities] = useState<FacilitiesState>(defaultFacilities)
  const authorizedFacilitiesRef = useRef<FacilitiesState>(defaultFacilities)
  const authorizedDocumentsRef = useRef<DocumentItem[]>([])
  const [changeVersion, setChangeVersion] = useState(5)
  const [pendingChanges, setPendingChanges] = useState<ChangeEntry[]>([])
  const currentUserRole: UserRole = 'checker'
  const [changedBy, setChangedBy] = useState<string | undefined>(undefined)
  const [submittedDate, setSubmittedDate] = useState<string | undefined>(undefined)
  const [authorizedByChecker, setAuthorizedByChecker] = useState<string | undefined>(undefined)
  const [authorizedDateChecker, setAuthorizedDateChecker] = useState<string | undefined>(undefined)

  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [balanceData, setBalanceData] = useState<BalanceData>({
    lastRefreshedAt: formatTime(new Date()),
    limitAmount: 0,
    blockedAmount: 10.2,
    uncollectedAmount: null,
    accountingBalance: 0,
    availableBalance: -10.2,
    authorizedBalance: -10.2,
  })
  const [jointHolders, setJointHolders] = useState<JointHolder[]>(
    () => dummyJointHolders[accountId ?? ''] ?? [],
  )
  const authorizedJointHoldersRef = useRef<JointHolder[]>(jointHolders)
  const [signatoryGroups, setSignatoryGroups] = useState<SignatoryGroup[]>(defaultSignatoryGroups)
  const [overdraftData, setOverdraftData] = useState<OverdraftData>(() => toOverdraftData(account))
  const [components, setComponents] = useState<ComponentRow[]>(defaultComponents)

  useEffect(() => {
    const next = dummyAccounts.find((item) => item.accountId === accountId) ?? null
    setAccount(next)
    authorizedAccountRef.current = next
    setWorkflowStatus('view')
    setFacilities(defaultFacilities)
    authorizedFacilitiesRef.current = defaultFacilities
    setDocuments([])
    authorizedDocumentsRef.current = []
    setPendingChanges([])
    setChangeVersion(5)
    setChangedBy(undefined)
    setSubmittedDate(undefined)
    setAuthorizedByChecker(undefined)
    setAuthorizedDateChecker(undefined)
    setOverdraftData(toOverdraftData(next))
    const nextJointHolders = dummyJointHolders[accountId ?? ''] ?? []
    setJointHolders(nextJointHolders)
    authorizedJointHoldersRef.current = nextJointHolders
  }, [accountId])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timeout)
  }, [toast])

  useEffect(() => {
    if (account && account.operatingMode !== 'Joint' && selectedTab === 'Joint') {
      setSelectedTab('General')
    }
  }, [account, selectedTab])

  if (!account) {
    return (
      <div className={styles.page}>
        <TopNav crumbs={['Core Banking', 'Accounts', 'CASA', 'Account Opening']} />
        <div className={styles.content}>
          <div className={styles.notFoundCard}>
            <p>Account not found.</p>
            <button type="button" className={styles.backButton} onClick={() => navigate('/casa')}>
              Back to accounts
            </button>
          </div>
        </div>
      </div>
    )
  }

  const showToast = (text: string) => setToast(text)

  const handleFieldChange = (field: keyof Account, value: string) => {
    setAccount((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const handleStatementRequiredChange = (value: boolean) => {
    setAccount((prev) => (prev ? { ...prev, statementRequired: value } : prev))
  }

  const handleToggleStatus = (key: keyof StatusFlags) => {
    setAccount((prev) => (prev ? { ...prev, [key]: !prev[key] } : prev))
  }

  const handleToggleFacility = (key: keyof FacilitiesState) => {
    setFacilities((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleStartEdit = () => {
    authorizedAccountRef.current = account
    authorizedFacilitiesRef.current = facilities
    authorizedDocumentsRef.current = documents
    authorizedJointHoldersRef.current = jointHolders
    setWorkflowStatus('editing')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(account.accountNo)
    } catch {
      // clipboard unavailable in this environment
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
    showToast('Account number copied to clipboard.')
  }

  const handleCancelEdit = () => {
    setAccount(authorizedAccountRef.current)
    setFacilities(authorizedFacilitiesRef.current)
    setDocuments(authorizedDocumentsRef.current)
    setJointHolders(authorizedJointHoldersRef.current)
    setWorkflowStatus('view')
    showToast('Changes discarded.')
  }

  const handleSaveClick = () => {
    if (!authorizedAccountRef.current) return
    const incompleteHolder = jointHolders.find(
      (holder) => holder.status === 'pendingAdd' && (!holder.customerNo || !holder.relationship),
    )
    if (incompleteHolder) {
      showToast(!incompleteHolder.customerNo ? 'Please select a customer.' : 'Please enter/select the relationship.')
      return
    }
    const changes = computeChanges(
      authorizedAccountRef.current,
      account,
      authorizedFacilitiesRef.current,
      facilities,
      authorizedDocumentsRef.current,
      documents,
      jointHolders,
    )
    if (changes.length === 0) {
      setWorkflowStatus('view')
      showToast('No changes to save.')
      return
    }
    setPendingChanges(changes)
    setShowConfirmSubmit(true)
  }

  const handleConfirmSubmit = () => {
    setChangedBy('OPSUSER01')
    setSubmittedDate(formatDateTime(new Date()))
    setWorkflowStatus('pendingAuthorization')
    setShowConfirmSubmit(false)
    showToast('Changes submitted for authorization.')
  }

  const handleApprove = () => {
    authorizedAccountRef.current = account
    authorizedFacilitiesRef.current = facilities
    const approvedDocuments = documents
      .filter((doc) => doc.status !== 'pendingDelete')
      .map((doc) => ({ ...doc, status: 'authorized' as const }))
    authorizedDocumentsRef.current = approvedDocuments
    setDocuments(approvedDocuments)
    const finalizedJointHolders = jointHolders
      .filter((holder) => holder.status !== 'pendingDelete')
      .map((holder) => ({ ...holder, status: 'authorized' as const }))
    authorizedJointHoldersRef.current = finalizedJointHolders
    setJointHolders(finalizedJointHolders)
    setChangeVersion((prev) => prev + 1)
    setAuthorizedByChecker('AUTHUSER01')
    setAuthorizedDateChecker(formatDateTime(new Date()))
    setPendingChanges([])
    setWorkflowStatus('view')
    showToast('Account changes authorized successfully.')
  }

  const handleReject = () => {
    setAccount(authorizedAccountRef.current)
    setFacilities(authorizedFacilitiesRef.current)
    setDocuments(authorizedDocumentsRef.current)
    setJointHolders(authorizedJointHoldersRef.current)
    setPendingChanges([])
    setWorkflowStatus('view')
    showToast('Changes rejected. Original account information remains unchanged.')
  }

  const handleStatusApply = (flags: StatusFlags) => {
    setAccount((prev) => (prev ? { ...prev, ...flags } : prev))
    setShowStatusModal(false)
    showToast('Account status updated.')
  }

  const handleAddJointHolder = () => {
    setJointHolders((prev) => [
      ...prev,
      { id: `jh-${Date.now()}`, customerNo: '', customerName: '', relationship: '', status: 'pendingAdd' },
    ])
  }

  const handleRemoveJointHolder = (id: string) => {
    setJointHolders((prev) => {
      const target = prev.find((holder) => holder.id === id)
      if (!target) return prev
      if (target.status === 'pendingAdd') {
        return prev.filter((holder) => holder.id !== id)
      }
      return prev.map((holder) => (holder.id === id ? { ...holder, status: 'pendingDelete' } : holder))
    })
  }

  const handleJointHolderFieldChange = <Field extends keyof JointHolder>(
    id: string,
    field: Field,
    value: JointHolder[Field],
  ) => {
    setJointHolders((prev) => prev.map((holder) => (holder.id === id ? { ...holder, [field]: value } : holder)))
  }

  const handleSelectJointHolderCustomer = (id: string, customer: CustomerOption) => {
    setJointHolders((prev) =>
      prev.map((holder) =>
        holder.id === id
          ? { ...holder, customerNo: customer.customerNo, customerName: customer.customerName }
          : holder,
      ),
    )
  }

  const handleAddGroup = () => {
    const nextIndex = signatoryGroups.length + 1
    const groupId = `G${String(nextIndex).padStart(3, '0')}`
    setSignatoryGroups((prev) => [
      ...prev,
      { id: `grp-${Date.now()}`, groupId, requiredSignatures: '1', members: [] },
    ])
    showToast('Signatory group added.')
  }

  const handleDeleteGroup = (groupId: string) => {
    setSignatoryGroups((prev) => prev.filter((group) => group.id !== groupId))
    showToast('Signatory group removed.')
  }

  const handleGroupFieldChange = (groupId: string, field: 'groupId' | 'requiredSignatures', value: string) => {
    setSignatoryGroups((prev) =>
      prev.map((group) => (group.id === groupId ? { ...group, [field]: value } : group)),
    )
  }

  const handleAddMember = (groupId: string) => {
    setSignatoryGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              members: [
                ...group.members,
                { id: `mem-${Date.now()}`, customerNo: '', customerName: '', mandatory: false, signatureCount: 0 },
              ],
            }
          : group,
      ),
    )
  }

  const handleDeleteMember = (groupId: string, memberId: string) => {
    setSignatoryGroups((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, members: group.members.filter((member) => member.id !== memberId) } : group,
      ),
    )
  }

  const handleMemberFieldChange = <Field extends keyof SignatoryMember>(
    groupId: string,
    memberId: string,
    field: Field,
    value: SignatoryMember[Field],
  ) => {
    setSignatoryGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              members: group.members.map((member) => (member.id === memberId ? { ...member, [field]: value } : member)),
            }
          : group,
      ),
    )
  }

  const handleSelectSignature = (groupId: string, memberId: string, fileNames: string[]) => {
    setSignatoryGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              members: group.members.map((member) =>
                member.id === memberId ? { ...member, signatureCount: fileNames.length } : member,
              ),
            }
          : group,
      ),
    )
    showToast(`${fileNames.length} signature file${fileNames.length === 1 ? '' : 's'} uploaded.`)
  }

  const updateOverdraftData = <Field extends keyof OverdraftData>(field: Field, value: OverdraftData[Field]) => {
    setOverdraftData((prev) => ({ ...prev, [field]: value }))
  }

  const handleComponentChange = <Field extends keyof ComponentRow>(id: string, field: Field, value: ComponentRow[Field]) => {
    setComponents((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)))
  }

  const handleAddComponent = (input: ComponentFormInput) => {
    setComponents((prev) => [
      ...prev,
      {
        id: `${input.componentCode}-${Date.now()}`,
        componentCode: input.componentCode,
        name: '',
        componentType: input.componentType,
        basis: '',
        type: input.type,
        rateOrAmount: input.rateOrAmount,
        rateCode: input.rateCode,
        spread: input.spread,
        drCr: input.drCr,
        interestBasis: '',
        liquidationPreference: '',
        liquidationFrequency: '',
        parentComponent: '',
        liquidationDate: '',
        liquidationOrder: '',
        effectiveDate: '',
        accrualRequired: 'No',
        forceDebit: 'No',
        accruedTillDate: '',
      },
    ])
    showToast('Component added.')
  }

  const handleImportComponents = (rows: ComponentRow[]) => {
    if (rows.length === 0) return
    setComponents((prev) => [...prev, ...rows])
    showToast(`${rows.length} component${rows.length === 1 ? '' : 's'} imported from product.`)
  }

  const handleDeleteComponent = (id: string) => {
    setComponents((prev) => prev.filter((row) => row.id !== id))
    showToast('Component removed.')
  }

  const handleAddDocument = () => {
    if (workflowStatus !== 'editing') return
    setEditingDocumentId(null)
    setShowAddDocumentModal(true)
  }

  const handleEditDocument = (id: string) => {
    if (workflowStatus !== 'editing') return
    setEditingDocumentId(id)
    setShowAddDocumentModal(true)
  }

  const handleSubmitDocument = (input: NewDocumentInput) => {
    const now = new Date()
    const fileUrl = input.file ? URL.createObjectURL(input.file) : undefined

    setDocuments((prev) => {
      if (editingDocumentId) {
        return prev.map((doc) =>
          doc.id === editingDocumentId
            ? {
                ...doc,
                documentType: input.documentType,
                documentName: input.documentName,
                issueDate: input.issueDate,
                expiryDate: input.expiryDate,
                issueCountry: input.issueCountry,
                remarks: input.remarks,
                verified: input.verified,
                fileName: input.fileName || doc.fileName,
                fileUrl: fileUrl || doc.fileUrl,
                status: doc.status === 'authorized' ? 'pending' : doc.status,
              }
            : doc,
        )
      }
      return [
        ...prev,
        {
          id: `doc-${prev.length + 1}-${now.getTime()}`,
          documentType: input.documentType,
          documentName: input.documentName,
          issueDate: input.issueDate,
          expiryDate: input.expiryDate,
          issueCountry: input.issueCountry,
          remarks: input.remarks,
          verified: input.verified,
          fileName: input.fileName || '',
          fileUrl,
          uploadedAt: now.toLocaleDateString('en-GB'),
          status: 'pending',
        },
      ]
    })
    setShowAddDocumentModal(false)
    showToast(editingDocumentId ? 'Document updated.' : 'Document added successfully.')
    setEditingDocumentId(null)
  }

  const handleRequestDeleteDocument = (id: string) => {
    if (workflowStatus !== 'editing') return
    setDocumentToDeleteId(id)
  }

  const handleConfirmDeleteDocument = () => {
    if (!documentToDeleteId) return
    setDocuments((prev) => {
      const target = prev.find((doc) => doc.id === documentToDeleteId)
      if (!target) return prev
      if (target.status === 'pending') {
        return prev.filter((doc) => doc.id !== documentToDeleteId)
      }
      return prev.map((doc) => (doc.id === documentToDeleteId ? { ...doc, status: 'pendingDelete' } : doc))
    })
    setDocumentToDeleteId(null)
    showToast('Document removed.')
  }

  const handleUndoDeleteDocument = (id: string) => {
    if (workflowStatus !== 'editing') return
    setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, status: 'authorized' } : doc)))
  }

  const handleViewDocument = (doc: DocumentItem) => {
    setPreviewDocument(doc)
  }

  const handleRefreshBalance = () => {
    setBalanceData((prev) => ({ ...prev, lastRefreshedAt: formatTime(new Date()) }))
    showToast('Balance refreshed.')
  }

  const statusMeta = statusToneMap[account.status]
  const ibanRequired = Boolean(account.ibanNumber)
  const isJointEnabled = account.operatingMode === 'Joint'
  const jointDependencyNotice = 'Joint account configuration is available only when Operating Mode is Joint.'
  const disabledTabs: Partial<Record<Tab, string>> = isJointEnabled ? {} : { Joint: jointDependencyNotice }
  const isEditing = workflowStatus === 'editing'
  const isPendingAuthorization = workflowStatus === 'pendingAuthorization'
  const modalChangeVersion = isPendingAuthorization ? changeVersion + 1 : changeVersion
  const liveChanges =
    isEditing && authorizedAccountRef.current
      ? computeChanges(
          authorizedAccountRef.current,
          account,
          authorizedFacilitiesRef.current,
          facilities,
          authorizedDocumentsRef.current,
          documents,
          jointHolders,
        )
      : []
  const displayedChangeCount = isEditing ? liveChanges.length : pendingChanges.length
  const editingDocumentIndex = editingDocumentId ? documents.findIndex((doc) => doc.id === editingDocumentId) : -1
  const editingDocument = editingDocumentIndex >= 0 ? documents[editingDocumentIndex] : undefined
  const editingDocumentInitial: NewDocumentInput | undefined = editingDocument
    ? {
        documentType: editingDocument.documentType,
        documentName: editingDocument.documentName,
        issueDate: editingDocument.issueDate,
        expiryDate: editingDocument.expiryDate,
        issueCountry: editingDocument.issueCountry,
        remarks: editingDocument.remarks,
        verified: editingDocument.verified,
        fileName: editingDocument.fileName || undefined,
      }
    : undefined

  return (
    <div className={styles.page}>
      <TopNav crumbs={['Core Banking', 'Accounts', 'CASA', 'Account Opening']} />

      <div className={styles.content}>
        <AccountHeader
          isEditing={isEditing}
          copied={copied}
          onEdit={isEditing ? handleCancelEdit : handleStartEdit}
          onCopy={handleCopy}
          onAuthorization={() => setShowAuthModal(true)}
        />

        <CustomerSummary account={account} />

        <div className={styles.evenGrid}>
          <InterestSummaryCard components={components} currency={account.currency} />
          <AccountBalanceSummaryCard
            data={balanceData}
            currency={account.currency}
            onViewDetails={() => handleTabSelect('Balance')}
          />
        </div>

        <CasaTabs tabs={tabs} activeTab={selectedTab} onTabSelect={handleTabSelect} disabledTabs={disabledTabs} />

        <div className={styles.tabPanelWrapper} ref={tabPanelWrapperRef} style={wrapperHeight !== undefined ? { height: `${wrapperHeight}px` } : undefined}>
          {isAnimating && previousTab ? (
            <>
              <div
                ref={previousPanelRef}
                className={`${styles.tabPanelSlide} ${
                  transitionDirection === 'left' ? styles.tabPanelExitToLeft : styles.tabPanelExitToRight
                }`}
              >
                {renderTabContent(previousTab)}
              </div>
              <div
                ref={currentPanelRef}
                className={`${styles.tabPanelSlide} ${
                  transitionDirection === 'left' ? styles.tabPanelSlideEnterFromRight : styles.tabPanelSlideEnterFromLeft
                }`}
              >
                {renderTabContent(selectedTab)}
              </div>
            </>
          ) : (
            <div ref={currentPanelRef} className={styles.tabPanelStatic}>
              {renderTabContent(selectedTab)}
            </div>
          )}
        </div>
      </div>

      <BottomActionBar
        updatedBy="OPSUSER01"
        updatedAt="Today, 10:42 AM"
        isEditing={isEditing}
        changeCount={displayedChangeCount}
        onCancel={handleCancelEdit}
        onSave={handleSaveClick}
      />

      {toast && <div className={styles.toast}>{toast}</div>}

      {showConfirmSubmit && (
        <ConfirmDialog
          title="Submit Changes for Authorization?"
          message="Your changes will be submitted for authorization. They will not become effective until an authorized user approves them."
          confirmLabel="Submit for Authorization"
          onCancel={() => setShowConfirmSubmit(false)}
          onConfirm={handleConfirmSubmit}
          verifyBeforeConfirm
        />
      )}

      {showAuthModal && (
        <AuthorizationModal
          accountNo={account.accountNo}
          customerName={account.customerName}
          changeVersion={modalChangeVersion}
          status={isPendingAuthorization ? 'pendingAuthorization' : 'authorized'}
          changes={pendingChanges}
          changedBy={changedBy}
          submittedDate={submittedDate}
          authorizedBy={authorizedByChecker}
          authorizedDate={authorizedDateChecker}
          currentUserRole={currentUserRole}
          onClose={() => setShowAuthModal(false)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {showHistoryModal && <HistoryModal entries={auditEntries} onClose={() => setShowHistoryModal(false)} />}

      {showAddDocumentModal && (
        <AddDocumentModal
          documentNumber={editingDocumentIndex >= 0 ? editingDocumentIndex + 1 : documents.length + 1}
          initial={editingDocumentInitial}
          onClose={() => {
            setShowAddDocumentModal(false)
            setEditingDocumentId(null)
          }}
          onSubmit={handleSubmitDocument}
        />
      )}

      {documentToDeleteId && (
        <ConfirmDialog
          title="Delete this document?"
          message="This action cannot be undone."
          confirmLabel="Delete"
          onCancel={() => setDocumentToDeleteId(null)}
          onConfirm={handleConfirmDeleteDocument}
        />
      )}

      {previewDocument && <DocumentPreviewModal document={previewDocument} onClose={() => setPreviewDocument(null)} />}

      {showStatusModal && (
        <StatusChangeModal
          initial={{
            dormant: account.dormant,
            frozen: account.frozen,
            noDebits: account.noDebits,
            noCredits: account.noCredits,
          }}
          onClose={() => setShowStatusModal(false)}
          onApply={handleStatusApply}
        />
      )}
    </div>
  )
}

export default CasaAccountDetailsPage
