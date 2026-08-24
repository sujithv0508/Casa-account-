import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { CloseIcon } from '../icons/Icons'
import styles from './SignatureImagePreview.module.css'

type SignatureImagePreviewProps = {
  imageUrl: string
  onClose: () => void
}

const EASE = [0.16, 1, 0.3, 1] as const

const SignatureImagePreview = ({ imageUrl, onClose }: SignatureImagePreviewProps) => {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return createPortal(
    <motion.div
      className={styles.overlay}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: EASE }}
    >
      <motion.div
        className={styles.panel}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
          <CloseIcon className={styles.closeIcon} />
        </button>
        <img src={imageUrl} alt="Signature preview" className={styles.image} />
      </motion.div>
    </motion.div>,
    document.body,
  )
}

export default SignatureImagePreview
