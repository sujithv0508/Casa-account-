import Modal from '../Modal/Modal'
import modalStyles from '../AccountModals/AccountModals.module.css'
import type { DocumentItem } from './DocumentsSection'
import { DownloadIcon } from '../icons/Icons'
import { downloadFile } from '../../utils/downloadFile'
import styles from './DocumentPreviewModal.module.css'

type DocumentPreviewModalProps = {
  document: DocumentItem
  onClose: () => void
}

const isImageFile = (fileName: string) => /\.(png|jpe?g)$/i.test(fileName)
const isPdfFile = (fileName: string) => /\.pdf$/i.test(fileName)

const DocumentPreviewModal = ({ document, onClose }: DocumentPreviewModalProps) => {
  const canDownload = Boolean(document.fileUrl && document.fileName)

  const handleDownload = () => {
    if (document.fileUrl && document.fileName) {
      downloadFile(document.fileUrl, document.fileName)
    }
  }

  return (
    <Modal
      title={document.documentType || 'Document Preview'}
      onClose={onClose}
      maxWidth="640px"
      footer={
        <>
          <button type="button" className={modalStyles.secondaryButton} onClick={onClose}>
            Close
          </button>
          <button type="button" className={modalStyles.primaryButton} disabled={!canDownload} onClick={handleDownload}>
            <DownloadIcon className={modalStyles.buttonIcon} />
            Download
          </button>
        </>
      }
    >
      <div className={styles.previewArea}>
        {document.fileUrl && isImageFile(document.fileName) ? (
          <img src={document.fileUrl} alt="Document preview" className={styles.previewImage} />
        ) : document.fileUrl && isPdfFile(document.fileName) ? (
          <iframe title="Document preview" src={document.fileUrl} className={styles.previewFrame} />
        ) : (
          <div className={styles.noPreview}>
            <p>No file attached to preview.</p>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default DocumentPreviewModal
