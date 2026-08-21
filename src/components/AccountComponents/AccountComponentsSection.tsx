import { useState, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ConfirmDialog from '../AccountModals/ConfirmDialog'
import {
  BoxIcon,
  BuildingIcon,
  ChevronRightIcon,
  EuroIcon,
  PlusIcon,
  PricingIcon,
  TrashIcon,
  UploadCloudIcon,
} from '../icons/Icons'
import ComponentFormModal, { type ComponentFormInput } from './ComponentFormModal'
import ImportFromProductModal from './ImportFromProductModal'
import ComponentConfigModal from './ComponentConfigModal'
import DrInterestModal from './DrInterestModal'
import SectionCard from '../SectionCard/SectionCard'
import styles from './AccountComponentsSection.module.css'

export type ComponentRow = {
  id: string
  componentCode: string
  name: string
  componentType: 'INTEREST' | 'TAX'
  basis: string
  type: 'RATE_CODE' | 'RATE'
  rateOrAmount: string
  rateCode: string
  spread: string
  drCr: 'DR' | 'CR'
  interestBasis: string
  liquidationPreference: string
  liquidationFrequency: string
  parentComponent: string
  liquidationDate: string
  liquidationOrder: string
  effectiveDate: string
  accrualRequired: 'Yes' | 'No'
  forceDebit: 'Yes' | 'No'
  accruedTillDate: string
}

export const defaultComponents: ComponentRow[] = [
  {
    id: 'DR_03',
    componentCode: 'DR_03',
    name: 'Debit Interest - Limit Amount',
    componentType: 'INTEREST',
    basis: 'Limit Amount',
    type: 'RATE_CODE',
    rateOrAmount: '10',
    rateCode: 'DR01',
    spread: '',
    drCr: 'DR',
    interestBasis: '30 / Actual',
    liquidationPreference: 'MONTH_END',
    liquidationFrequency: 'MONTHLY',
    parentComponent: '',
    liquidationDate: '',
    liquidationOrder: '',
    effectiveDate: '',
    accrualRequired: 'Yes',
    forceDebit: 'No',
    accruedTillDate: '',
  },
  {
    id: 'DR_04',
    componentCode: 'DR_04',
    name: 'Debit Interest - Available Balance',
    componentType: 'INTEREST',
    basis: 'Available Balance',
    type: 'RATE',
    rateOrAmount: '4',
    rateCode: '',
    spread: '',
    drCr: 'DR',
    interestBasis: '365 / Actual',
    liquidationPreference: 'QUARTER_END',
    liquidationFrequency: 'QUARTERLY',
    parentComponent: '',
    liquidationDate: '',
    liquidationOrder: '',
    effectiveDate: '',
    accrualRequired: 'Yes',
    forceDebit: 'No',
    accruedTillDate: '',
  },
  {
    id: 'DR_05',
    componentCode: 'DR_05',
    name: 'Debit Interest - Overdraft Amount',
    componentType: 'INTEREST',
    basis: 'Overdraft Amount',
    type: 'RATE',
    rateOrAmount: '5',
    rateCode: '',
    spread: '',
    drCr: 'DR',
    interestBasis: '30 / Actual',
    liquidationPreference: 'MONTH_END',
    liquidationFrequency: 'MONTHLY',
    parentComponent: '',
    liquidationDate: '',
    liquidationOrder: '',
    effectiveDate: '',
    accrualRequired: 'Yes',
    forceDebit: 'No',
    accruedTillDate: '',
  },
  {
    id: 'CR_01',
    componentCode: 'CR_01',
    name: 'Credit Interest - Balance',
    componentType: 'INTEREST',
    basis: 'Credit Balance',
    type: 'RATE',
    rateOrAmount: '3',
    rateCode: '',
    spread: '',
    drCr: 'CR',
    interestBasis: '365 / Actual',
    liquidationPreference: 'MONTH_END',
    liquidationFrequency: 'MONTHLY',
    parentComponent: '',
    liquidationDate: '',
    liquidationOrder: '',
    effectiveDate: '',
    accrualRequired: 'Yes',
    forceDebit: 'No',
    accruedTillDate: '',
  },
  {
    id: 'CR_02',
    componentCode: 'CR_02',
    name: 'Withholding Tax',
    componentType: 'TAX',
    basis: 'Interest Earned',
    type: 'RATE',
    rateOrAmount: '2',
    rateCode: '',
    spread: '',
    drCr: 'DR',
    interestBasis: '—',
    liquidationPreference: 'MONTH_END',
    liquidationFrequency: 'MONTHLY',
    parentComponent: 'CR_01',
    liquidationDate: '',
    liquidationOrder: '',
    effectiveDate: '',
    accrualRequired: 'No',
    forceDebit: 'No',
    accruedTillDate: '',
  },
  {
    id: 'DR_01',
    componentCode: 'DR_01',
    name: 'Debit Interest - Minimum Balance',
    componentType: 'INTEREST',
    basis: 'Minimum Balance',
    type: 'RATE',
    rateOrAmount: '5',
    rateCode: '',
    spread: '',
    drCr: 'DR',
    interestBasis: '30 / Actual',
    liquidationPreference: 'MONTH_END',
    liquidationFrequency: 'MONTHLY',
    parentComponent: '',
    liquidationDate: '',
    liquidationOrder: '',
    effectiveDate: '',
    accrualRequired: 'Yes',
    forceDebit: 'No',
    accruedTillDate: '',
  },
  {
    id: 'DR_02',
    componentCode: 'DR_02',
    name: 'Service Tax',
    componentType: 'TAX',
    basis: 'Interest Paid',
    type: 'RATE',
    rateOrAmount: '1',
    rateCode: '',
    spread: '',
    drCr: 'DR',
    interestBasis: '—',
    liquidationPreference: 'MONTH_END',
    liquidationFrequency: 'MONTHLY',
    parentComponent: 'DR_01',
    liquidationDate: '',
    liquidationOrder: '',
    effectiveDate: '',
    accrualRequired: 'No',
    forceDebit: 'No',
    accruedTillDate: '',
  },
]

const finalAmount = (row: ComponentRow) => {
  const rate = Number(row.rateOrAmount) || 0
  const spread = Number(row.spread) || 0
  return (rate + spread).toFixed(2)
}

const typeLabel = (type: ComponentRow['type']) => (type === 'RATE_CODE' ? 'RATE CODE' : 'RATE')

const CARD_EASE = [0.16, 1, 0.3, 1] as const

const COMPONENT_ACCENTS: Record<string, string> = {
  DR_01: 'var(--success)',
  DR_03: 'var(--purple-tint)',
  DR_04: '#2563EB',
  DR_05: 'var(--orange-tint)',
  CR_01: 'var(--blue-600)',
  CR_02: 'var(--cyan-tint)',
  CR_03: 'var(--rose-700)',
}
const DEFAULT_ACCENT = 'var(--ink-soft)'
const getCardAccent = (code: string) => COMPONENT_ACCENTS[code] ?? DEFAULT_ACCENT

type AccountComponentsSectionProps = {
  components: ComponentRow[]
  editable: boolean
  onChange: <Field extends keyof ComponentRow>(id: string, field: Field, value: ComponentRow[Field]) => void
  onAddComponent: (input: ComponentFormInput) => void
  onImportComponents: (rows: ComponentRow[]) => void
  onDelete: (id: string) => void
}

const AccountComponentsSection = ({
  components,
  editable,
  onChange,
  onAddComponent,
  onImportComponents,
  onDelete,
}: AccountComponentsSectionProps) => {
  const [configTargetId, setConfigTargetId] = useState<string | null>(null)
  const [showDrBreakdown, setShowDrBreakdown] = useState(false)
  const [showCrBreakdown, setShowCrBreakdown] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const drInterestRows = components.filter((row) => row.drCr === 'DR' && row.componentType === 'INTEREST')
  const crInterestRows = components.filter((row) => row.drCr === 'CR' && row.componentType === 'INTEREST')
  const totalDrInterest = drInterestRows.reduce((sum, row) => sum + Number(finalAmount(row)), 0)
  const totalCrInterest = crInterestRows.reduce((sum, row) => sum + Number(finalAmount(row)), 0)

  const interestCount = components.filter((row) => row.componentType === 'INTEREST').length
  const taxCount = components.filter((row) => row.componentType === 'TAX').length
  const totalConfigured = components.reduce((sum, row) => sum + Number(finalAmount(row)), 0)

  const deleteTargetRow = deleteTargetId ? components.find((row) => row.id === deleteTargetId) : undefined
  const configTargetRow = configTargetId ? components.find((row) => row.id === configTargetId) : undefined

  const handleOpenAdd = () => {
    setShowFormModal(true)
  }

  const handleSubmitForm = (input: ComponentFormInput) => {
    onAddComponent(input)
    setShowFormModal(false)
  }

  return (
    <SectionCard
      icon={<BoxIcon />}
      title="Components"
      subtitle="Configure account components and rate parameters"
      tone="teal"
      reveal
      action={
        <div className={styles.headerActions}>
          <button type="button" className={styles.importButton} onClick={() => setShowImportModal(true)}>
            <UploadCloudIcon className={styles.importIcon} />
            Import from product
          </button>
          <button
            type="button"
            className={`${styles.addButton} ${!editable ? styles.addButtonDisabled : ''}`}
            disabled={!editable}
            title={editable ? undefined : 'Click Edit to make changes'}
            onClick={handleOpenAdd}
          >
            <PlusIcon className={styles.addIcon} />
            Add Component
          </button>
        </div>
      }
    >
      <div className={styles.summaryStrip}>
        <div className={styles.summaryCard}>
          <span className={`${styles.summaryIconWrap} ${styles.tone_blue}`}>
            <BoxIcon className={styles.summaryIcon} />
          </span>
          <span className={styles.summaryText}>
            <span className={styles.summaryValue}>{components.length}</span>
            <span className={styles.summaryLabel}>Components</span>
          </span>
        </div>
        <div className={styles.summaryCard}>
          <span className={`${styles.summaryIconWrap} ${styles.tone_blue}`}>
            <PricingIcon className={styles.summaryIcon} />
          </span>
          <span className={styles.summaryText}>
            <span className={styles.summaryValue}>{interestCount}</span>
            <span className={styles.summaryLabel}>Interest Components</span>
          </span>
        </div>
        <div className={styles.summaryCard}>
          <span className={`${styles.summaryIconWrap} ${styles.tone_orange}`}>
            <BuildingIcon className={styles.summaryIcon} />
          </span>
          <span className={styles.summaryText}>
            <span className={styles.summaryValue}>{taxCount}</span>
            <span className={styles.summaryLabel}>Tax Components</span>
          </span>
        </div>
        <div className={styles.summaryCard}>
          <span className={`${styles.summaryIconWrap} ${styles.tone_mint}`}>
            <EuroIcon className={styles.summaryIcon} />
          </span>
          <span className={styles.summaryText}>
            <span className={styles.summaryValue}>{totalConfigured.toFixed(2)}</span>
            <span className={styles.summaryLabel}>Total Configured</span>
          </span>
        </div>
      </div>

      {components.length === 0 ? (
        <div className={styles.emptyState}>
          <BoxIcon className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>No components configured</p>
          <p className={styles.emptyDesc}>Click Add Component or Import from product to get started.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {components.map((row, index) => {
            const isConfigOpen = configTargetId === row.id
            const Icon = row.componentType === 'INTEREST' ? PricingIcon : BuildingIcon
            const accent = getCardAccent(row.componentCode)

            return (
              <motion.div
                key={row.id}
                className={styles.cardItem}
                style={{ '--card-accent': accent } as CSSProperties}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: CARD_EASE, delay: index * 0.05 }}
                role="button"
                tabIndex={0}
                onClick={() => setConfigTargetId(row.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setConfigTargetId(row.id)
                  }
                }}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.cardIconWrap}>
                    <Icon className={styles.cardIcon} />
                  </span>
                  <span className={styles.cardHeaderText}>
                    <span className={styles.cardCode}>{row.componentCode}</span>
                    <span className={styles.cardType}>{row.componentType}</span>
                  </span>
                  <ChevronRightIcon className={`${styles.chevron} ${isConfigOpen ? styles.chevronOpen : ''}`} />
                </div>

                <div className={styles.cardValues}>
                  <div className={styles.valueRow}>
                    <span className={styles.valueLabel}>D/C</span>
                    <span className={styles.valueBox}>{row.drCr}</span>
                  </div>
                  <div className={styles.valueRow}>
                    <span className={styles.valueLabel}>Rate</span>
                    <span className={styles.valueBox}>{row.rateOrAmount}</span>
                  </div>
                  <div className={styles.valueRow}>
                    <span className={styles.valueLabel}>Type</span>
                    <span className={styles.valueBox}>{typeLabel(row.type)}</span>
                  </div>
                  <div className={styles.valueRow}>
                    <span className={styles.valueLabel}>Rate Code</span>
                    <span className={styles.valueBox}>{row.rateCode || '—'}</span>
                  </div>
                  <div className={styles.valueRow}>
                    <span className={styles.valueLabel}>Spread</span>
                    <span className={styles.valueBox}>{row.spread || '—'}</span>
                  </div>
                </div>

                <div className={styles.cardFinalRow}>
                  <span className={styles.valueLabel}>Final</span>
                  <span className={styles.finalValue}>{finalAmount(row)}</span>
                </div>

                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={`${styles.actionLink} ${styles.actionLinkDanger}`}
                    disabled={!editable}
                    title={editable ? undefined : 'Click Edit to make changes'}
                    onClick={(event) => {
                      event.stopPropagation()
                      setDeleteTargetId(row.id)
                    }}
                  >
                    <TrashIcon className={styles.actionIcon} />
                    Delete
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <div className={styles.totalsRow}>
        <button type="button" className={styles.totalCard} onClick={() => setShowDrBreakdown(true)}>
          <span className={`${styles.totalIconWrap} ${styles.tone_mint}`}>
            <EuroIcon className={styles.totalIcon} />
          </span>
          <span className={styles.totalTextCol}>
            <span className={styles.totalLabel}>TOTAL DR INTEREST</span>
            <span className={styles.totalAmountRow}>
              <span className={styles.totalValue}>€{totalDrInterest.toFixed(2)}</span>
              <ChevronRightIcon className={styles.totalArrow} />
            </span>
            <span className={styles.totalSubtitle}>Debit interest breakdown</span>
          </span>
        </button>
        <button type="button" className={styles.totalCard} onClick={() => setShowCrBreakdown(true)}>
          <span className={`${styles.totalIconWrap} ${styles.tone_mint}`}>
            <EuroIcon className={styles.totalIcon} />
          </span>
          <span className={styles.totalTextCol}>
            <span className={styles.totalLabel}>TOTAL CR INTEREST</span>
            <span className={styles.totalAmountRow}>
              <span className={styles.totalValue}>€{totalCrInterest.toFixed(2)}</span>
              <ChevronRightIcon className={styles.totalArrow} />
            </span>
            <span className={styles.totalSubtitle}>Credit interest breakdown</span>
          </span>
        </button>
      </div>

      <AnimatePresence>
        {showDrBreakdown && (
          <DrInterestModal
            key="dr-interest-modal"
            rows={drInterestRows}
            total={totalDrInterest}
            onClose={() => setShowDrBreakdown(false)}
          />
        )}
        {showCrBreakdown && (
          <DrInterestModal
            key="cr-interest-modal"
            rows={crInterestRows}
            total={totalCrInterest}
            title="Total CR Interest"
            subtitle="Breakdown of credit-interest components"
            emptyTitle="No accrued interest to break down."
            emptyDescription=""
            centerLabel="TOTAL CR INTEREST"
            onClose={() => setShowCrBreakdown(false)}
          />
        )}
      </AnimatePresence>

      {showFormModal && (
        <ComponentFormModal onClose={() => setShowFormModal(false)} onSubmit={handleSubmitForm} />
      )}

      {showImportModal && (
        <ImportFromProductModal
          productTemplate={defaultComponents}
          existingComponents={components}
          onClose={() => setShowImportModal(false)}
          onImport={onImportComponents}
        />
      )}

      {deleteTargetRow && (
        <ConfirmDialog
          title="Delete component?"
          message={`Are you sure you want to remove ${deleteTargetRow.componentCode}?`}
          confirmLabel="Delete"
          onCancel={() => setDeleteTargetId(null)}
          onConfirm={() => {
            onDelete(deleteTargetRow.id)
            setDeleteTargetId(null)
          }}
        />
      )}

      {configTargetRow && (
        <ComponentConfigModal
          row={configTargetRow}
          editable={editable}
          onChange={onChange}
          onClose={() => setConfigTargetId(null)}
        />
      )}
    </SectionCard>
  )
}

export default AccountComponentsSection
