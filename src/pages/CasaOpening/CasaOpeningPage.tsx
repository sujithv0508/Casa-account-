import { useEffect, useMemo, useState } from 'react'
import TopNav from '../../components/TopNav/TopNav'
import CustomerInfoCard from '../../components/CustomerDetails/CustomerInfoCard'
import TabNav from '../../components/Tabs/TabNav'
import GeneralSection from '../../components/General/GeneralSection'
import DocumentsSection from '../../components/Documents/DocumentsSection'
import JointAccountSection, { type JointHolder } from '../../components/JointAccount/JointAccountSection'
import type { CustomerOption } from '../../components/JointAccount/CustomerSearchField'
import { dummyCustomers } from '../../data/dummyAccounts'
import AccountComponentsSection, { type ComponentRow, defaultComponents } from '../../components/AccountComponents/AccountComponentsSection'
import type { ComponentFormInput } from '../../components/AccountComponents/ComponentFormModal'
import AuthorizedSignatorySection, {
  type SignatoryGroup,
  type SignatoryMember,
  defaultSignatoryGroups,
} from '../../components/AuthorizedSignatory/AuthorizedSignatorySection'
import OverdraftSection, { type OverdraftData } from '../../components/Overdraft/OverdraftSection'
import StatusSection from '../../components/Status/StatusSection'
import BalanceSection from '../../components/Balance/BalanceSection'
import AuditSection from '../../components/Audit/AuditSection'
import styles from './CasaOpeningPage.module.css'

type GeneralSectionData = {
  customerName: string
  dateOfBirth: string
  mobileNumber: string
  email: string
  customerType: string
  accountType: string
  openingDate: string
  minimumBalance: string
  operatingMode: string
}

type DocumentsSectionData = {
  idProof: string
  taxId: string
  addressProof: string
  photograph: string
  signature: string
  verificationStatus: string
}

type BalanceSectionData = {
  accountNumber: string
  currency: string
  openingBalance: string
  availableBalance: string
}

type AuditEntry = {
  timestamp: string
  action: string
  user: string
  activity: string
}

type FormState = {
  general: GeneralSectionData
  documents: DocumentsSectionData
  joint: JointHolder[]
  components: ComponentRow[]
  authorized: SignatoryGroup[]
  overdraft: OverdraftData
  balance: BalanceSectionData
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
]

const initialFormState: FormState = {
  general: {
    customerName: 'Aditya Sharma',
    dateOfBirth: '1990-05-16',
    mobileNumber: '+91 98765 43210',
    email: 'aditya.sharma@email.com',
    customerType: 'Individual',
    accountType: 'Savings',
    openingDate: '2026-08-10',
    minimumBalance: '5,000',
    operatingMode: 'Single',
  },
  documents: {
    idProof: 'Aadhaar Card',
    taxId: 'PAN Card',
    addressProof: 'Utility Bill',
    photograph: 'Uploaded',
    signature: 'Uploaded',
    verificationStatus: 'Pending',
  },
  joint: [],
  components: defaultComponents,
  authorized: defaultSignatoryGroups,
  overdraft: {
    startDate: '',
    endDate: '',
    transferType: 'Amount',
    transferValue: '',
    limitAmount: '',
    utilizedAmount: '0.00',
    status: 'Active',
  },
  balance: {
    accountNumber: 'AC-1029384756',
    currency: 'INR',
    openingBalance: '25,000.00',
    availableBalance: '24,750.00',
  },
}

const auditEntries: AuditEntry[] = [
  {
    timestamp: '2026-08-10 09:22',
    action: 'Created record',
    user: 'R. Mehta',
    activity: 'Started application review',
  },
  {
    timestamp: '2026-08-10 10:00',
    action: 'Verified documents',
    user: 'S. Kapoor',
    activity: 'Checked ID and address proofs',
  },
  {
    timestamp: '2026-08-10 10:35',
    action: 'Updated status',
    user: 'A. Thomas',
    activity: 'Marked KYC verification as pending',
  },
]

const statusItems = [
  { label: 'Customer details', completed: true },
  { label: 'KYC verification', completed: false },
  { label: 'Documents', completed: false },
  { label: 'Account configuration', completed: false },
  { label: 'Authorization', completed: false },
  { label: 'Final status', completed: false },
]

const CasaOpeningPage = () => {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [formData, setFormData] = useState<FormState>(initialFormState)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateFormValue = <Section extends keyof FormState,
    Field extends keyof FormState[Section]>(
    section: Section,
    field: Field,
    value: FormState[Section][Field],
  ) => {
    setFormData((previous) => ({
      ...previous,
      [section]: {
        ...previous[section],
        [field]: value,
      },
    }))

    const errorKey = `${section}.${String(field)}`
    if (errors[errorKey]) {
      setErrors((previous) => {
        const next = { ...previous }
        delete next[errorKey]
        return next
      })
    }
  }

  const handleAddJointHolder = () => {
    setFormData((previous) => ({
      ...previous,
      joint: [
        ...previous.joint,
        { id: `jh-${Date.now()}`, customerNo: '', customerName: '', relationship: '', status: 'pendingAdd' },
      ],
    }))
  }

  const handleRemoveJointHolder = (id: string) => {
    setFormData((previous) => ({
      ...previous,
      joint: previous.joint.filter((holder) => holder.id !== id),
    }))
  }

  const handleSelectJointHolderCustomer = (id: string, customer: CustomerOption) => {
    setFormData((previous) => ({
      ...previous,
      joint: previous.joint.map((holder) =>
        holder.id === id
          ? { ...holder, customerNo: customer.customerNo, customerName: customer.customerName }
          : holder,
      ),
    }))
  }

  const handleJointHolderFieldChange = <Field extends keyof JointHolder>(id: string, field: Field, value: JointHolder[Field]) => {
    setFormData((previous) => ({
      ...previous,
      joint: previous.joint.map((holder) => (holder.id === id ? { ...holder, [field]: value } : holder)),
    }))
  }

  const handleComponentChange = <Field extends keyof ComponentRow>(id: string, field: Field, value: ComponentRow[Field]) => {
    setFormData((previous) => ({
      ...previous,
      components: previous.components.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    }))
  }

  const handleAddComponent = (input: ComponentFormInput) => {
    setFormData((previous) => ({
      ...previous,
      components: [
        ...previous.components,
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
      ],
    }))
  }

  const handleImportComponents = (rows: ComponentRow[]) => {
    if (rows.length === 0) return
    setFormData((previous) => ({
      ...previous,
      components: [...previous.components, ...rows],
    }))
  }

  const handleDeleteComponent = (id: string) => {
    setFormData((previous) => ({
      ...previous,
      components: previous.components.filter((row) => row.id !== id),
    }))
  }

  const handleAddGroup = () => {
    const groupId = `G${String(formData.authorized.length + 1).padStart(3, '0')}`
    setFormData((previous) => ({
      ...previous,
      authorized: [
        ...previous.authorized,
        { id: `grp-${Date.now()}`, groupId, requiredSignatures: '1', members: [] },
      ],
    }))
  }

  const handleDeleteGroup = (groupId: string) => {
    setFormData((previous) => ({
      ...previous,
      authorized: previous.authorized.filter((group) => group.id !== groupId),
    }))
  }

  const handleGroupFieldChange = (groupId: string, field: 'groupId' | 'requiredSignatures', value: string) => {
    setFormData((previous) => ({
      ...previous,
      authorized: previous.authorized.map((group) => (group.id === groupId ? { ...group, [field]: value } : group)),
    }))
  }

  const handleAddMember = (groupId: string) => {
    setFormData((previous) => ({
      ...previous,
      authorized: previous.authorized.map((group) =>
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
    }))
  }

  const handleDeleteMember = (groupId: string, memberId: string) => {
    setFormData((previous) => ({
      ...previous,
      authorized: previous.authorized.map((group) =>
        group.id === groupId ? { ...group, members: group.members.filter((member) => member.id !== memberId) } : group,
      ),
    }))
  }

  const handleMemberFieldChange = <Field extends keyof SignatoryMember>(
    groupId: string,
    memberId: string,
    field: Field,
    value: SignatoryMember[Field],
  ) => {
    setFormData((previous) => ({
      ...previous,
      authorized: previous.authorized.map((group) =>
        group.id === groupId
          ? {
              ...group,
              members: group.members.map((member) => (member.id === memberId ? { ...member, [field]: value } : member)),
            }
          : group,
      ),
    }))
  }

  const handleSelectSignature = (groupId: string, memberId: string, fileNames: string[]) => {
    setFormData((previous) => ({
      ...previous,
      authorized: previous.authorized.map((group) =>
        group.id === groupId
          ? {
              ...group,
              members: group.members.map((member) =>
                member.id === memberId ? { ...member, signatureCount: fileNames.length } : member,
              ),
            }
          : group,
      ),
    }))
    setMessage(`${fileNames.length} signature file${fileNames.length === 1 ? '' : 's'} uploaded.`)
  }

  const isJointEnabled = formData.general.operatingMode === 'Joint'
  const jointDependencyNotice = 'Joint account configuration is available only when Operating Mode is Joint.'
  const disabledTabs: Partial<Record<string, string>> = isJointEnabled ? {} : { Joint: jointDependencyNotice }

  useEffect(() => {
    if (!isJointEnabled && activeTab === 'Joint') {
      setActiveTab('General')
    }
  }, [isJointEnabled, activeTab])

  const validateForm = () => {
    const nextErrors: Record<string, string> = {}
    if (!formData.general.customerName.trim()) {
      nextErrors['general.customerName'] = 'Customer name is required.'
    }
    if (!formData.general.mobileNumber.trim()) {
      nextErrors['general.mobileNumber'] = 'Mobile number is required.'
    }
    if (!formData.general.email.trim()) {
      nextErrors['general.email'] = 'Email address is required.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSaveDraft = () => {
    setMessage('Draft saved successfully.')
  }

  const handleValidate = () => {
    const isValid = validateForm()
    setMessage(isValid ? 'Validation passed. All required fields are filled.' : 'Validation found missing fields.')
  }

  const handleSubmit = () => {
    if (validateForm()) {
      setMessage('Application submitted successfully. A confirmation email has been sent.')
    } else {
      setMessage('Please fix the highlighted fields before submission.')
    }
  }

  const activeSection = useMemo(() => {
    switch (activeTab) {
      case 'General':
        return (
          <GeneralSection
            data={formData.general}
            errors={errors}
            onChange={updateFormValue}
          />
        )
      case 'Documents':
        return (
          <DocumentsSection
            documents={[]}
            editable
            onAdd={() => setMessage('Upload document action opened.')}
            onView={() => setMessage('Document preview opened.')}
            onEdit={() => setMessage('Edit document action opened.')}
            onDelete={() => setMessage('Delete document action opened.')}
            onUndoDelete={() => setMessage('Document delete undone.')}
          />
        )
      case 'Joint':
        return (
          <JointAccountSection
            holders={formData.joint}
            editable={isJointEnabled}
            dependencyNotice={isJointEnabled ? undefined : jointDependencyNotice}
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
            components={formData.components}
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
            groups={formData.authorized}
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
        return (
          <OverdraftSection
            data={formData.overdraft}
            editable
            onChange={(field, value) => updateFormValue('overdraft', field, value)}
          />
        )
      case 'Status':
        return <StatusSection items={statusItems} />
      case 'Balance':
        return (
          <BalanceSection
            data={{
              lastRefreshedAt: '—',
              limitAmount: 0,
              blockedAmount: 0,
              uncollectedAmount: null,
              accountingBalance: 0,
              availableBalance: 0,
              authorizedBalance: 0,
            }}
            onRefresh={() => setMessage('Balance refreshed.')}
          />
        )
      case 'Audit':
        return <AuditSection entries={auditEntries} />
      default:
        return null
    }
  }, [activeTab, formData, errors])

  const customer = {
    id: 'CUST-20260810-01',
    name: formData.general.customerName,
    accountNumber: formData.balance.accountNumber,
    product: 'CASA Savings',
    currency: formData.balance.currency,
    branchCode: 'BKC-0021',
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerArea}>
        <TopNav crumbs={['Core Banking', 'Accounts', 'CASA', 'Account Opening']} />
      </div>

      <CustomerInfoCard customer={customer} />
      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} disabledTabs={disabledTabs} />

      <div className={styles.sectionArea}>{activeSection}</div>

      <div className={styles.footerArea}>
        <div className={styles.message}>{message}</div>
        <div className={styles.buttonGroup}>
          <button type="button" className={styles.secondaryButton} onClick={handleSaveDraft}>
            Save Draft
          </button>
          <button type="button" className={styles.secondaryButton} onClick={handleValidate}>
            Validate
          </button>
          <button type="button" className={styles.primaryButton} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default CasaOpeningPage
