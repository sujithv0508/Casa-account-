import { useState } from 'react'
import { motion } from 'framer-motion'
import type { ComponentRow } from './AccountComponentsSection'
import DrInterestDonut, { getComponentColor, type DonutItem } from './DrInterestDonut'
import styles from './DrInterestBreakdown.module.css'

type DrInterestBreakdownProps = {
  rows: ComponentRow[]
  total: number
  emptyTitle?: string
  emptyDescription?: string
  centerLabel?: string
}

const EASE = [0.16, 1, 0.3, 1] as const

const formatEuro = (value: number) => `€${value.toFixed(2)}`

const rowMetrics = (row: ComponentRow) => {
  const rate = Number(row.rateOrAmount) || 0
  const spread = Number(row.spread) || 0
  return {
    rate,
    spread,
    finalAmount: Number((rate + spread).toFixed(2)),
  }
}

const DrInterestBreakdown = ({
  rows,
  total,
  emptyTitle = 'No DR interest calculated',
  emptyDescription = 'Add or configure a DR interest component to see its breakdown here.',
  centerLabel = 'TOTAL DR INTEREST',
}: DrInterestBreakdownProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const activeId = selectedId

  const items: DonutItem[] = rows.map((row) => ({
    id: row.id,
    code: row.componentCode,
    name: row.name,
    drCr: row.drCr,
    value: rowMetrics(row).finalAmount,
  }))

  const visibleItems = items.filter((item) => item.value > 0)
  const colorById = new Map<string, string>()
  items.forEach((item) => {
    if (item.value > 0) {
      colorById.set(item.id, getComponentColor(item.code))
    }
  })

  const handleHoverChange = (id: string | null) => {
    setSelectedId(id)
  }

  if (total <= 0) {
    return (
      <div className={styles.emptyWrap}>
        <p className={styles.emptyTitle}>{emptyTitle}</p>
        {emptyDescription && <p className={styles.emptyDesc}>{emptyDescription}</p>}
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.mainRow}>
        <DrInterestDonut
          items={items}
          total={total}
          activeId={activeId}
          onHoverChange={handleHoverChange}
          centerLabel={centerLabel}
        />

        <div className={styles.legend}>
          {items.map((item, index) => {
            const pct = total > 0 ? (item.value / total) * 100 : 0
            const color = colorById.get(item.id) ?? '#9CA8A2'
            const isZero = item.value <= 0
            return (
              <motion.button
                key={item.id}
                type="button"
                className={`${styles.legendRow} ${item.id === activeId ? styles.legendRowActive : ''} ${isZero ? styles.legendRowMuted : ''}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE, delay: 0.35 + index * 0.06 }}
                onMouseEnter={() => !isZero && handleHoverChange(item.id)}
                onMouseLeave={() => handleHoverChange(null)}
                onFocus={() => !isZero && handleHoverChange(item.id)}
                onBlur={() => handleHoverChange(null)}
                disabled={isZero}
              >
                <span className={styles.legendDot} style={{ background: color }} />
                <span className={styles.legendCode}>{item.code}</span>
                <span className={styles.legendName}>{item.name}</span>
                <span className={styles.legendValue}>{formatEuro(item.value)}</span>
                <span className={styles.legendPct}>{pct.toFixed(0)}%</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className={styles.footer}>
        <span>Components: {visibleItems.length}</span>
        <span>Contribution: {visibleItems.length > 0 ? '100%' : '0%'}</span>
      </div>
    </div>
  )
}

export default DrInterestBreakdown
