import Modal from '../Modal/Modal'
import modalStyles from '../AccountModals/AccountModals.module.css'
import { CheckCircleIcon } from '../icons/Icons'
import type { ComponentRow } from './AccountComponentsSection'
import styles from './ImportFromProductModal.module.css'

type ImportFromProductModalProps = {
  productTemplate: ComponentRow[]
  existingComponents: ComponentRow[]
  onClose: () => void
  onImport: (rows: ComponentRow[]) => void
}

const ImportFromProductModal = ({ productTemplate, existingComponents, onClose, onImport }: ImportFromProductModalProps) => {
  const missing = productTemplate.filter(
    (template) => !existingComponents.some((row) => row.componentCode === template.componentCode),
  )

  const handleImport = () => {
    if (missing.length === 0) return
    onImport(missing.map((row) => ({ ...row })))
    onClose()
  }

  return (
    <Modal
      title="Import from Product"
      subtitle="Standard component template for this product"
      onClose={onClose}
      maxWidth="560px"
      footer={
        <>
          <button type="button" className={modalStyles.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={modalStyles.primaryButton} disabled={missing.length === 0} onClick={handleImport}>
            Import {missing.length > 0 ? `${missing.length} Component${missing.length === 1 ? '' : 's'}` : ''}
          </button>
        </>
      }
    >
      {missing.length === 0 ? (
        <div className={styles.emptyState}>
          <CheckCircleIcon className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>All product components are already configured</p>
          <p className={styles.emptyDesc}>This account already has every standard component from the product template.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {missing.map((row) => (
            <div key={row.componentCode} className={styles.listRow}>
              <div className={styles.listMeta}>
                <span className={styles.listCode}>{row.componentCode}</span>
                <span className={styles.listType}>{row.componentType}</span>
              </div>
              <div className={styles.listValues}>
                <span>{row.drCr}</span>
                <span>{row.type === 'RATE_CODE' ? 'RATE CODE' : 'RATE'}</span>
                <span>{row.rateOrAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}

export default ImportFromProductModal
