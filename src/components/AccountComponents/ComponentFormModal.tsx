import { useState } from 'react'
import Modal from '../Modal/Modal'
import modalStyles from '../AccountModals/AccountModals.module.css'
import { SearchIcon } from '../icons/Icons'
import styles from './ComponentFormModal.module.css'

export type ComponentFormInput = {
  componentCode: string
  componentType: 'INTEREST' | 'TAX'
  drCr: 'DR' | 'CR'
  type: 'RATE_CODE' | 'RATE'
  rateCode: string
  rateOrAmount: string
  spread: string
}

type ComponentFormModalProps = {
  initial?: ComponentFormInput
  onClose: () => void
  onSubmit: (input: ComponentFormInput) => void
}

const emptyForm: ComponentFormInput = {
  componentCode: '',
  componentType: 'INTEREST',
  drCr: 'DR',
  type: 'RATE',
  rateCode: '',
  rateOrAmount: '',
  spread: '',
}

const ComponentFormModal = ({ initial, onClose, onSubmit }: ComponentFormModalProps) => {
  const [form, setForm] = useState<ComponentFormInput>(initial ?? emptyForm)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const updateField = <Field extends keyof ComponentFormInput>(field: Field, value: ComponentFormInput[Field]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    const nextErrors = {
      componentCode: !form.componentCode.trim(),
      rateOrAmount: !form.rateOrAmount.trim(),
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return
    onSubmit({ ...form, componentCode: form.componentCode.trim() })
  }

  return (
    <Modal
      title={initial ? `Edit Component · ${initial.componentCode}` : 'Add Component'}
      subtitle={initial ? undefined : 'Define the component and its rate parameters'}
      onClose={onClose}
      maxWidth="560px"
      footer={
        <>
          <button type="button" className={modalStyles.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={modalStyles.primaryButton} onClick={handleSave}>
            Save
          </button>
        </>
      }
    >
      <div className={styles.grid}>
        <label className={styles.field}>
          <span className={styles.label}>
            Component Code<span className={styles.required}>*</span>
          </span>
          <input
            className={`${styles.control} ${errors.componentCode ? styles.invalid : ''}`}
            value={form.componentCode}
            placeholder="e.g. DR_06"
            disabled={Boolean(initial)}
            onChange={(event) => updateField('componentCode', event.target.value)}
          />
          {errors.componentCode && <span className={styles.errorText}>Component code is required.</span>}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Component Type</span>
          <select
            className={styles.control}
            value={form.componentType}
            onChange={(event) => updateField('componentType', event.target.value as ComponentFormInput['componentType'])}
          >
            <option value="INTEREST">INTEREST</option>
            <option value="TAX">TAX</option>
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>D/C</span>
          <select
            className={styles.control}
            value={form.drCr}
            onChange={(event) => updateField('drCr', event.target.value as ComponentFormInput['drCr'])}
          >
            <option value="DR">DR</option>
            <option value="CR">CR</option>
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Type</span>
          <select
            className={styles.control}
            value={form.type}
            onChange={(event) => updateField('type', event.target.value as ComponentFormInput['type'])}
          >
            <option value="RATE_CODE">RATE CODE</option>
            <option value="RATE">RATE</option>
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Rate Code</span>
          <span className={styles.controlWrap}>
            <input
              className={styles.control}
              value={form.rateCode}
              placeholder="Rate code"
              disabled={form.type !== 'RATE_CODE'}
              onChange={(event) => updateField('rateCode', event.target.value)}
            />
            {form.type === 'RATE_CODE' && <SearchIcon className={styles.suffixIcon} />}
          </span>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>
            Rate Amount<span className={styles.required}>*</span>
          </span>
          <input
            className={`${styles.control} ${errors.rateOrAmount ? styles.invalid : ''}`}
            value={form.rateOrAmount}
            placeholder="e.g. 5"
            onChange={(event) => updateField('rateOrAmount', event.target.value)}
          />
          {errors.rateOrAmount && <span className={styles.errorText}>Rate amount is required.</span>}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Spread</span>
          <input
            className={styles.control}
            value={form.spread}
            placeholder="e.g. 0.5"
            onChange={(event) => updateField('spread', event.target.value)}
          />
        </label>
      </div>
    </Modal>
  )
}

export default ComponentFormModal
