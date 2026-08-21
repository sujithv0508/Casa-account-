import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import SectionCard from '../SectionCard/SectionCard'
import { PricingIcon } from '../icons/Icons'
import type { ComponentRow } from './AccountComponentsSection'
import { finalAmount, getCrInterestBreakdown, getDrInterestBreakdown } from './drInterestUtils'
import DrInterestDonut, { getComponentColor, type DonutItem } from './DrInterestDonut'
import { getCurrencySymbol } from '../../utils/currency'
import styles from './InterestSummaryCard.module.css'

type InterestSummaryCardProps = {
  components: ComponentRow[]
  currency: string
}

const EASE = [0.16, 1, 0.3, 1] as const

const toDonutItems = (rows: ComponentRow[]): DonutItem[] =>
  rows.map((row) => ({
    id: row.id,
    code: row.componentCode,
    name: row.name,
    drCr: row.drCr,
    value: finalAmount(row),
  }))

const InterestSummaryCard = ({ components, currency }: InterestSummaryCardProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { drRows, crRows, drTotal, crTotal, totalInterest, items, currencySymbol } = useMemo(() => {
    const { rows: drRows, total: drTotal } = getDrInterestBreakdown(components)
    const { rows: crRows, total: crTotal } = getCrInterestBreakdown(components)
    return {
      drRows,
      crRows,
      drTotal,
      crTotal,
      totalInterest: Number((drTotal + crTotal).toFixed(2)),
      items: [...toDonutItems(drRows), ...toDonutItems(crRows)],
      currencySymbol: getCurrencySymbol(currency),
    }
  }, [components, currency])

  const totalComponentCount = drRows.length + crRows.length

  const renderLegendGroup = (label: 'DR' | 'CR', rows: ComponentRow[], groupTotal: number) => {
    if (rows.length === 0) return null
    const groupItems = toDonutItems(rows)
    return (
      <div className={styles.legendGroup} key={label}>
        <div className={styles.legendGroupHeader}>
          <span className={`${styles.groupBadge} ${label === 'DR' ? styles.groupBadgeSquare : styles.groupBadgeCircle}`} />
          <span className={styles.groupLabel}>{label} Components</span>
        </div>
        {groupItems.map((item, index) => {
          const pct = groupTotal > 0 ? (item.value / groupTotal) * 100 : 0
          const color = getComponentColor(item.code)
          return (
            <motion.button
              key={item.id}
              type="button"
              className={`${styles.legendRow} ${item.id === selectedId ? styles.legendRowActive : ''}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE, delay: 0.25 + index * 0.05 }}
              onMouseEnter={() => setSelectedId(item.id)}
              onMouseLeave={() => setSelectedId(null)}
              onFocus={() => setSelectedId(item.id)}
              onBlur={() => setSelectedId(null)}
            >
              <span className={styles.legendDot} style={{ background: color }} />
              <span className={styles.legendCode}>{item.code}</span>
              <span className={styles.legendName}>{item.name}</span>
              <span className={styles.legendValue}>
                {currencySymbol}
                {item.value.toFixed(2)}
              </span>
              <span className={styles.legendPct}>{pct.toFixed(0)}%</span>
            </motion.button>
          )
        })}
      </div>
    )
  }

  return (
    <SectionCard
      icon={<PricingIcon />}
      title="Interest Summary"
      subtitle="Combined breakdown of debit and credit interest components"
      tone="teal"
      reveal
      className={styles.card}
      bodyClassName={styles.body}
    >
      {totalInterest <= 0 ? (
        <div className={styles.emptyWrap}>
          <p className={styles.emptyTitle}>No interest calculated</p>
          <p className={styles.emptyDesc}>Add a DR or CR interest component to see its breakdown here.</p>
        </div>
      ) : (
        <div className={styles.wrap}>
          <div className={styles.mainRow}>
            <DrInterestDonut
              items={items}
              total={totalInterest}
              activeId={selectedId}
              onHoverChange={setSelectedId}
              centerLabel="TOTAL INTEREST"
              currencySymbol={currencySymbol}
            />
            <div className={styles.legendGroups}>
              {renderLegendGroup('DR', drRows, drTotal)}
              {renderLegendGroup('CR', crRows, crTotal)}
            </div>
          </div>

          <div className={styles.footer}>
            <span>
              DR Components: {drRows.length} &nbsp;·&nbsp; CR Components: {crRows.length} &nbsp;·&nbsp; Total Components:{' '}
              {totalComponentCount}
            </span>
            <span>Contribution: {totalComponentCount > 0 ? '100%' : '0%'}</span>
          </div>
        </div>
      )}
    </SectionCard>
  )
}

export default InterestSummaryCard
