import SectionCard from '../SectionCard/SectionCard'
import { ListIcon } from '../icons/Icons'
import styles from './GlPairSection.module.css'

export type GlPair = {
  label: string
  glCode: string
  description: string
}

type GlPairSectionProps = {
  product: string
  lastCreditDate?: string
  lastDebitDate?: string
  lastActivityDate?: string
  glPairs: GlPair[]
}

const GlPairSection = ({ product, lastCreditDate, lastDebitDate, lastActivityDate, glPairs }: GlPairSectionProps) => {
  return (
    <SectionCard icon={<ListIcon />} title="GL Pair" tone="teal" reveal>
      <p className={styles.subheading}>Activity Dates</p>
      <div className={styles.dateGrid}>
        <div className={styles.dateTile}>
          <p className={styles.dateLabel}>Last Credit Date</p>
          <p className={`${styles.dateValue} ${!lastCreditDate ? styles.dateValueEmpty : ''}`}>
            {lastCreditDate ?? '—'}
          </p>
        </div>
        <div className={styles.dateTile}>
          <p className={styles.dateLabel}>Last Debit Date</p>
          <p className={`${styles.dateValue} ${!lastDebitDate ? styles.dateValueEmpty : ''}`}>
            {lastDebitDate ?? '—'}
          </p>
        </div>
        <div className={styles.dateTile}>
          <p className={styles.dateLabel}>Last Activity Date</p>
          <p className={`${styles.dateValue} ${!lastActivityDate ? styles.dateValueEmpty : ''}`}>
            {lastActivityDate ?? '—'}
          </p>
        </div>
      </div>

      {glPairs.length === 0 ? (
        <p className={styles.emptyMessage}>
          No GL pairs configured for product <strong>{product}</strong>.
        </p>
      ) : (
        <div className={styles.pairList}>
          {glPairs.map((pair) => (
            <div key={pair.glCode} className={styles.pairRow}>
              <span className={styles.pairLabel}>{pair.label}</span>
              <span className={styles.pairCode}>{pair.glCode}</span>
              <span className={styles.pairDesc}>{pair.description}</span>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  )
}

export default GlPairSection
