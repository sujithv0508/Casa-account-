import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Modal from '../Modal/Modal'
import { CheckCircleIcon, ChevronDownIcon, FileTextIcon, UploadCloudIcon } from '../icons/Icons'
import LookupModal, { type LookupOption } from '../LookupModal/LookupModal'
import modalStyles from '../AccountModals/AccountModals.module.css'
import styles from './AddDocumentModal.module.css'

export type NewDocumentInput = {
  documentType: string
  documentName: string
  issueDate: string
  expiryDate: string
  issueCountry: string
  remarks: string
  verified: boolean
  fileName?: string
  file?: File
}

type AddDocumentModalProps = {
  documentNumber: number
  initial?: NewDocumentInput
  onClose: () => void
  onSubmit: (document: NewDocumentInput) => void
}

const documentTypes = ['Passport', 'National ID Card', 'Driving Licence', 'Utility Bill', 'Bank Statement', 'Tax Certificate', 'Other']

const documentTypeDescriptions: Record<string, string> = {
  Passport: 'Identity & Travel Proof',
  'National ID Card': 'Government-Issued Identity Proof',
  'Driving Licence': 'Identity & Address Proof',
  'Utility Bill': 'Address Proof',
  'Bank Statement': 'Financial Proof',
  'Tax Certificate': 'Income Proof',
  Other: 'Supporting Document',
}

const documentTypeOptions: LookupOption[] = documentTypes.map((type) => ({
  primary: type,
  secondary: documentTypeDescriptions[type] ?? '',
}))

const countries = ['Portugal', 'Spain', 'France', 'Germany', 'Ireland', 'Italy', 'United Kingdom', 'United States', 'India', 'Other']

const countryCodes: Record<string, string> = {
  Portugal: 'PT',
  Spain: 'ES',
  France: 'FR',
  Germany: 'DE',
  Ireland: 'IE',
  Italy: 'IT',
  'United Kingdom': 'GB',
  'United States': 'US',
  India: 'IN',
  Other: '—',
}

const countryOptions: LookupOption[] = countries.map((country) => ({
  primary: country,
  secondary: countryCodes[country] ?? '',
}))

const REMARKS_LIMIT = 250
const VERIFY_DURATION_MS = 1400
const VERIFIED_HOLD_MS = 700
const EASE = [0.16, 1, 0.3, 1] as const

type SubmitPhase = 'form' | 'verifying' | 'verified'

const AddDocumentModal = ({ documentNumber, initial, onClose, onSubmit }: AddDocumentModalProps) => {
  const [documentType, setDocumentType] = useState(initial?.documentType ?? '')
  const [documentName, setDocumentName] = useState(initial?.documentName ?? '')
  const [issueDate, setIssueDate] = useState(initial?.issueDate ?? '')
  const [expiryDate, setExpiryDate] = useState(initial?.expiryDate ?? '')
  const [issueCountry, setIssueCountry] = useState(initial?.issueCountry ?? '')
  const [remarks, setRemarks] = useState(initial?.remarks ?? '')
  const [verified, setVerified] = useState(initial?.verified ?? false)
  const [fileName, setFileName] = useState(initial?.fileName ?? '')
  const [file, setFile] = useState<File | undefined>(undefined)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [activeLookup, setActiveLookup] = useState<'documentType' | 'issueCountry' | null>(null)
  const [phase, setPhase] = useState<SubmitPhase>('form')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pendingSubmitRef = useRef<NewDocumentInput | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0]
    if (selected) {
      setFileName(selected.name)
      setFile(selected)
      setVerified(true)
    }
  }

  useEffect(() => {
    if (phase !== 'verifying') return
    const timer = window.setTimeout(() => setPhase('verified'), prefersReducedMotion ? 0 : VERIFY_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [phase, prefersReducedMotion])

  useEffect(() => {
    if (phase !== 'verified') return
    const timer = window.setTimeout(() => {
      if (pendingSubmitRef.current) onSubmit(pendingSubmitRef.current)
    }, prefersReducedMotion ? 0 : VERIFIED_HOLD_MS)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, prefersReducedMotion])

  const handleDone = () => {
    if (phase !== 'form') return

    const nextErrors: Record<string, boolean> = {
      documentType: !documentType,
      documentName: !documentName.trim(),
      issueDate: !issueDate,
      issueCountry: !issueCountry,
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    const payload: NewDocumentInput = {
      documentType,
      documentName: documentName.trim(),
      issueDate,
      expiryDate,
      issueCountry,
      remarks,
      verified,
      fileName: fileName || undefined,
      file,
    }

    if (!fileName) {
      onSubmit(payload)
      return
    }

    pendingSubmitRef.current = payload
    setPhase('verifying')
  }

  if (phase === 'verifying' || phase === 'verified') {
    const isVerified = phase === 'verified'
    return (
      <Modal title={isVerified ? 'Document Submitted' : 'Verifying Document'} onClose={() => {}} maxWidth="480px">
        {isVerified ? (
          <div className={modalStyles.successWrap}>
            <motion.div
              className={modalStyles.successIconCircle}
              initial={prefersReducedMotion ? undefined : { scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <CheckCircleIcon className={modalStyles.successIcon} />
            </motion.div>
            <h3 className={modalStyles.verifyTitle}>Document Submitted</h3>
            <p className={modalStyles.verifySubtitle}>Document submitted successfully.</p>
          </div>
        ) : (
          <div className={modalStyles.verifyWrap}>
            <div className={modalStyles.verifyRing}>
              <div className={modalStyles.verifyTrack} />
              <motion.div
                className={modalStyles.verifySpinner}
                animate={prefersReducedMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className={modalStyles.verifyOrbit}
                animate={prefersReducedMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 1.9, repeat: Infinity, ease: 'linear' }}
              >
                <span className={modalStyles.verifyOrbitDot} />
              </motion.div>
              <div className={modalStyles.verifyScanClip}>
                <motion.div
                  className={modalStyles.verifyScanBeam}
                  animate={prefersReducedMotion ? undefined : { y: ['-60%', '160%'] }}
                  transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
              <div className={modalStyles.verifyIconCircle}>
                <FileTextIcon className={modalStyles.verifyIcon} />
              </div>
            </div>

            <h3 className={modalStyles.verifyTitle}>Verifying Document</h3>
            <p className={modalStyles.verifySubtitle}>Please wait while we verify the uploaded document...</p>

            <span className={styles.verifyDots} aria-hidden="true">
              <motion.span animate={prefersReducedMotion ? undefined : { opacity: [0.25, 1, 0.25] }} transition={{ duration: 1.1, repeat: Infinity, delay: 0 }} />
              <motion.span animate={prefersReducedMotion ? undefined : { opacity: [0.25, 1, 0.25] }} transition={{ duration: 1.1, repeat: Infinity, delay: 0.18 }} />
              <motion.span animate={prefersReducedMotion ? undefined : { opacity: [0.25, 1, 0.25] }} transition={{ duration: 1.1, repeat: Infinity, delay: 0.36 }} />
            </span>
          </div>
        )}
      </Modal>
    )
  }

  return (
    <Modal
      title={initial ? `Edit Document · #${documentNumber}` : `Document Details #${documentNumber}`}
      onClose={onClose}
      maxWidth="720px"
      footer={
        <>
          <button type="button" className={modalStyles.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={modalStyles.primaryButton} onClick={handleDone}>
            Done
          </button>
        </>
      }
    >
      <div className={styles.grid}>
        <div className={styles.field}>
          <span className={styles.label}>
            Document Type<span className={styles.required}>*</span>
          </span>
          <button
            type="button"
            className={`${styles.control} ${styles.lookupTrigger} ${errors.documentType ? styles.invalid : ''}`}
            onClick={() => setActiveLookup('documentType')}
          >
            <span className={documentType ? undefined : styles.lookupPlaceholder}>
              {documentType || 'Select document type'}
            </span>
            <ChevronDownIcon className={styles.lookupChevron} />
          </button>
          {errors.documentType && <span className={styles.errorText}>Document type is required.</span>}
        </div>

        <label className={styles.field}>
          <span className={styles.label}>
            Document Name<span className={styles.required}>*</span>
          </span>
          <input
            className={`${styles.control} ${errors.documentName ? styles.invalid : ''}`}
            value={documentName}
            placeholder="e.g. Passport"
            onChange={(event) => setDocumentName(event.target.value)}
          />
          {errors.documentName && <span className={styles.errorText}>Document name is required.</span>}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>
            Issue Date<span className={styles.required}>*</span>
          </span>
          <input
            type="date"
            className={`${styles.control} ${errors.issueDate ? styles.invalid : ''}`}
            value={issueDate}
            onChange={(event) => setIssueDate(event.target.value)}
          />
          {errors.issueDate && <span className={styles.errorText}>Issue date is required.</span>}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Expiry Date</span>
          <input type="date" className={styles.control} value={expiryDate} onChange={(event) => setExpiryDate(event.target.value)} />
        </label>

        <div className={styles.field}>
          <span className={styles.label}>
            Issue Country<span className={styles.required}>*</span>
          </span>
          <button
            type="button"
            className={`${styles.control} ${styles.lookupTrigger} ${errors.issueCountry ? styles.invalid : ''}`}
            onClick={() => setActiveLookup('issueCountry')}
          >
            <span className={issueCountry ? undefined : styles.lookupPlaceholder}>
              {issueCountry || 'Select country'}
            </span>
            <ChevronDownIcon className={styles.lookupChevron} />
          </button>
          {errors.issueCountry && <span className={styles.errorText}>Issue country is required.</span>}
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Verified</span>
          <div className={styles.verifiedRow}>
            <button
              type="button"
              className={`${styles.toggle} ${verified ? styles.on : ''}`}
              role="switch"
              aria-checked={verified}
              aria-label="Verified"
              onClick={() => setVerified((prev) => !prev)}
            >
              <span className={styles.knob} />
            </button>
            <span className={styles.verifiedCaption}>Upload a file to mark as verified</span>
          </div>
        </div>

        <label className={`${styles.field} ${styles.fieldWide}`}>
          <span className={styles.label}>Remarks</span>
          <textarea
            className={styles.textarea}
            value={remarks}
            maxLength={REMARKS_LIMIT}
            placeholder="Optional notes"
            onChange={(event) => setRemarks(event.target.value)}
          />
          <span className={styles.charCount}>
            {remarks.length} / {REMARKS_LIMIT}
          </span>
        </label>

        <div className={`${styles.field} ${styles.fieldWide}`}>
          <div className={styles.uploadArea}>
            <UploadCloudIcon className={styles.uploadIcon} />
            <button type="button" className={styles.uploadLabel} onClick={() => fileInputRef.current?.click()}>
              Choose file
            </button>
            <p className={styles.uploadHint}>PDF, JPG, PNG</p>
            {fileName && <p className={styles.fileName}>{fileName}</p>}
            <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className={styles.hiddenInput} onChange={handleFileChange} />
          </div>
        </div>
      </div>

      {activeLookup === 'documentType' && (
        <LookupModal
          primaryLabel="Document Type"
          secondaryLabel="Document"
          options={documentTypeOptions}
          selectedValue={documentType}
          onSelect={(option) => {
            setDocumentType(option.primary)
            setActiveLookup(null)
          }}
          onClose={() => setActiveLookup(null)}
        />
      )}

      {activeLookup === 'issueCountry' && (
        <LookupModal
          primaryLabel="Country Name"
          secondaryLabel="Country Code"
          options={countryOptions}
          selectedValue={issueCountry}
          onSelect={(option) => {
            setIssueCountry(option.primary)
            setActiveLookup(null)
          }}
          onClose={() => setActiveLookup(null)}
        />
      )}
    </Modal>
  )
}

export default AddDocumentModal
