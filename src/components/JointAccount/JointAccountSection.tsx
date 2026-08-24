import { useState } from 'react'
import ConfirmDialog from '../AccountModals/ConfirmDialog'
import CustomerSearchField, { type CustomerOption } from './CustomerSearchField'
import { CheckCircleIcon, LockIcon, PlusIcon, RefreshIcon, TrashIcon, UserIcon } from '../icons/Icons'
import SectionCard from '../SectionCard/SectionCard'
import styles from './JointAccountSection.module.css'

export type JointHolderStatus = 'authorized' | 'pendingAdd' | 'pendingDelete'

export type JointHolder = {
  id: string
  customerNo: string
  customerName: string
  relationship: string
  status: JointHolderStatus
}

const relationshipOptions = ['Spouse', 'Sibling', 'Parent', 'Child', 'Business Partner', 'Other']

const statusMeta: Partial<Record<JointHolderStatus, { label: string; tone: 'add' | 'remove' }>> = {
  pendingAdd: { label: 'Pending Addition', tone: 'add' },
  pendingDelete: { label: 'Pending Removal', tone: 'remove' },
}

type JointAccountSectionProps = {
  holders: JointHolder[]
  editable: boolean
  dependencyNotice?: string
  primaryCustomerId?: string
  customerDirectory: CustomerOption[]
  onAddHolder: () => void
  onRemoveHolder: (id: string) => void
  onHolderFieldChange: <Field extends keyof JointHolder>(id: string, field: Field, value: JointHolder[Field]) => void
  onSelectHolderCustomer: (id: string, customer: CustomerOption) => void
}

const JointAccountSection = ({
  holders,
  editable,
  dependencyNotice,
  primaryCustomerId,
  customerDirectory,
  onAddHolder,
  onRemoveHolder,
  onHolderFieldChange,
  onSelectHolderCustomer,
}: JointAccountSectionProps) => {
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null)

  const activeCustomerNos = holders
    .filter((holder) => holder.status !== 'pendingDelete' && holder.customerNo)
    .map((holder) => holder.customerNo)

  const handleDeleteClick = (holder: JointHolder) => {
    if (holder.status === 'pendingAdd') {
      onRemoveHolder(holder.id)
      return
    }
    setConfirmRemoveId(holder.id)
  }

  return (
    <SectionCard
      icon={<UserIcon />}
      title="Joint Account"
      subtitle={
        holders.length > 0
          ? `${holders.length} Joint holder${holders.length === 1 ? '' : 's'}`
          : 'Configure joint holders for this account.'
      }
      tone="teal"
      reveal
      action={
        <button
          type="button"
          className={`${styles.addHolderButton} ${!editable ? styles.disabledButton : ''}`}
          disabled={!editable}
          title={editable ? undefined : dependencyNotice ?? 'Click Edit to make changes'}
          onClick={onAddHolder}
        >
          <PlusIcon className={styles.addHolderIcon} />
          Add Holder
        </button>
      }
    >
      {dependencyNotice && (
        <p className={styles.notice}>
          <LockIcon className={styles.noticeIcon} />
          {dependencyNotice}
        </p>
      )}

      {holders.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIconWrap}>
            <UserIcon className={styles.emptyIcon} />
          </span>
          <p className={styles.emptyTitle}>No Joint holders</p>
          <p className={styles.emptyDesc}>Click Add Holder to attach customers to this account.</p>
        </div>
      ) : (
        <div className={styles.holderTable}>
          <div className={styles.holderHeaderRow}>
            <span>Joint Customer No</span>
            <span>Customer Name</span>
            <span>Relationship</span>
            <span>Actions</span>
          </div>

          {holders.map((holder) => {
            const meta = statusMeta[holder.status]
            const rowEditable = editable && holder.status === 'pendingAdd'
            const duplicateIds = activeCustomerNos.filter((id) => id !== holder.customerNo)

            return (
              <div
                key={holder.id}
                className={`${styles.holderRow} ${holder.status === 'pendingDelete' ? styles.rowPendingDelete : ''}`}
              >
                <span className={styles.cell} data-label="Joint Customer No">
                  {rowEditable ? (
                    <CustomerSearchField
                      value={holder.customerNo}
                      directory={customerDirectory}
                      primaryCustomerId={primaryCustomerId}
                      duplicateIds={duplicateIds}
                      onSelect={(customer) => onSelectHolderCustomer(holder.id, customer)}
                    />
                  ) : (
                    <span className={styles.staticValue}>{holder.customerNo || '—'}</span>
                  )}
                </span>

                <span className={styles.cell} data-label="Customer Name">
                  <span className={styles.staticValue}>{holder.customerName || '—'}</span>
                </span>

                <span className={styles.cell} data-label="Relationship">
                  {rowEditable ? (
                    <>
                      <input
                        className={styles.relationshipInput}
                        list="joint-relationship-options"
                        placeholder="e.g. SPOUSE"
                        value={holder.relationship}
                        onChange={(event) => onHolderFieldChange(holder.id, 'relationship', event.target.value)}
                      />
                    </>
                  ) : (
                    <span className={styles.staticValue}>{holder.relationship || '—'}</span>
                  )}
                </span>

                <span className={styles.cell} data-label="Actions">
                  <span className={styles.actionsCell}>
                    {meta && <span className={`${styles.statusBadge} ${styles[`tone_${meta.tone}`]}`}>{meta.label}</span>}
                    {holder.status === 'authorized' && (
                      <span className={styles.authorizedBadge}>
                        <CheckCircleIcon className={styles.authorizedIcon} />
                        Authorized
                      </span>
                    )}
                    {holder.status === 'pendingDelete' ? (
                      <button
                        type="button"
                        className={styles.undoButton}
                        disabled={!editable}
                        title={editable ? 'Undo removal' : 'Click Edit to make changes'}
                        onClick={() => onHolderFieldChange(holder.id, 'status', 'authorized')}
                      >
                        <RefreshIcon className={styles.actionIcon} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={styles.deleteButton}
                        disabled={!editable}
                        title={editable ? 'Remove holder' : 'Click Edit to make changes'}
                        onClick={() => handleDeleteClick(holder)}
                      >
                        <TrashIcon className={styles.actionIcon} />
                      </button>
                    )}
                  </span>
                </span>
              </div>
            )
          })}
        </div>
      )}

      <datalist id="joint-relationship-options">
        {relationshipOptions.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>

      {confirmRemoveId && (
        <ConfirmDialog
          title="Remove Joint Holder?"
          message="This holder will be marked for removal and the change requires authorization before it takes effect."
          confirmLabel="Remove Holder"
          onCancel={() => setConfirmRemoveId(null)}
          onConfirm={() => {
            onRemoveHolder(confirmRemoveId)
            setConfirmRemoveId(null)
          }}
        />
      )}
    </SectionCard>
  )
}

export default JointAccountSection
