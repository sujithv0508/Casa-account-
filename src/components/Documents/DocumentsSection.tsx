import { motion } from 'framer-motion'
import SectionCard from '../SectionCard/SectionCard'
import {
  CheckCircleIcon,
  DownloadIcon,
  EditIcon,
  EyeIcon,
  FileTextIcon,
  ImageIcon,
  PaperclipIcon,
  PlusIcon,
  RefreshIcon,
  TrashIcon,
} from '../icons/Icons'
import { downloadFile } from '../../utils/downloadFile'
import styles from './DocumentsSection.module.css'

export type DocumentStatus = 'authorized' | 'pending' | 'pendingDelete'

export type DocumentItem = {
  id: string
  documentType: string
  documentName: string
  issueDate: string
  expiryDate: string
  issueCountry: string
  remarks: string
  verified: boolean
  fileName: string
  fileUrl?: string
  uploadedAt: string
  status: DocumentStatus
}

type DocumentsSectionProps = {
  documents: DocumentItem[]
  editable: boolean
  onAdd: () => void
  onView: (doc: DocumentItem) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onUndoDelete: (id: string) => void
}

const isImageFile = (fileName: string) => /\.(png|jpe?g)$/i.test(fileName)

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') return ImageIcon
  if (ext === 'pdf') return FileTextIcon
  return PaperclipIcon
}

const glassPalette = ['blue', 'lavender', 'mint', 'peach', 'cyan', 'pink', 'yellow', 'sky'] as const

const CARD_EASE = [0.16, 1, 0.3, 1] as const

const getGlassTone = (id: string) => {
  let hash = 0
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return glassPalette[hash % glassPalette.length]
}

const DocumentsSection = ({ documents, editable, onAdd, onView, onEdit, onDelete, onUndoDelete }: DocumentsSectionProps) => {
  return (
    <SectionCard
      icon={<PaperclipIcon />}
      title="Documents"
      subtitle={`${documents.length} document${documents.length === 1 ? '' : 's'} attached`}
      tone="teal"
      reveal
      action={
        <button
          type="button"
          className={`${styles.addButton} ${!editable ? styles.addButtonDisabled : ''}`}
          disabled={!editable}
          title={editable ? undefined : 'Click Edit to make changes'}
          onClick={onAdd}
        >
          <PlusIcon className={styles.addIcon} />
          Add Document
        </button>
      }
    >
      {documents.length === 0 ? (
        <div className={styles.emptyState}>
          <PaperclipIcon className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>No documents</p>
          <p className={styles.emptySubtitle}>
            Click <strong>Add Document</strong> to attach documents to this account.
          </p>
        </div>
      ) : (
        <div className={styles.docGrid}>
          {documents.map((doc, index) => {
            const FileIcon = getFileIcon(doc.fileName)
            const isPendingDelete = doc.status === 'pendingDelete'
            const rowEditable = editable && !isPendingDelete
            const canDownload = Boolean(doc.fileUrl && doc.fileName)
            const tone = getGlassTone(doc.id)

            return (
              <motion.div
                key={doc.id}
                className={`${styles.docCard} ${styles[`tone_${tone}`]} ${isPendingDelete ? styles.cardPendingDelete : ''}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: CARD_EASE, delay: index * 0.05 }}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.typeIconWrap}>
                    <FileTextIcon className={styles.typeIcon} />
                  </span>
                  <span className={styles.typeTitle}>{doc.documentType || 'Document'}</span>
                  <span className={`${styles.verifiedBadge} ${doc.verified ? styles.verifiedYes : styles.verifiedNo}`}>
                    {doc.verified && <CheckCircleIcon className={styles.verifiedIcon} />}
                    {doc.verified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.detailCol}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Document Name</span>
                      <span className={styles.detailValue}>{doc.documentName || '—'}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Issue Country</span>
                      <span className={styles.detailValue}>{doc.issueCountry || '—'}</span>
                    </div>
                  </div>

                  {doc.fileName && (
                    <button
                      type="button"
                      className={styles.thumbnail}
                      onClick={() => onView(doc)}
                      aria-label="View document"
                    >
                      {doc.fileUrl && isImageFile(doc.fileName) ? (
                        <img src={doc.fileUrl} alt="" className={styles.thumbnailImage} />
                      ) : (
                        <FileIcon className={styles.thumbnailIcon} />
                      )}
                    </button>
                  )}
                </div>

                <div className={styles.cardActions}>
                  <button type="button" className={styles.actionLink} onClick={() => onView(doc)}>
                    <EyeIcon className={styles.actionIcon} />
                    View
                  </button>
                  <button
                    type="button"
                    className={styles.actionLink}
                    disabled={!canDownload}
                    onClick={() => doc.fileUrl && downloadFile(doc.fileUrl, doc.fileName)}
                  >
                    <DownloadIcon className={styles.actionIcon} />
                    Download
                  </button>
                  {isPendingDelete ? (
                    <button type="button" className={styles.actionLink} disabled={!editable} onClick={() => onUndoDelete(doc.id)}>
                      <RefreshIcon className={styles.actionIcon} />
                      Undo
                    </button>
                  ) : (
                    <>
                      <button type="button" className={styles.actionLink} disabled={!rowEditable} onClick={() => onEdit(doc.id)}>
                        <EditIcon className={styles.actionIcon} />
                        Edit
                      </button>
                      <button
                        type="button"
                        className={`${styles.actionLink} ${styles.actionLinkDanger}`}
                        disabled={!rowEditable}
                        onClick={() => onDelete(doc.id)}
                      >
                        <TrashIcon className={styles.actionIcon} />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </SectionCard>
  )
}

export default DocumentsSection
