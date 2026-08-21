import { useEffect, useRef, useState } from 'react'
import { LockIcon } from '../icons/Icons'
import styles from './CasaTabs.module.css'

type CasaTabsProps<T extends string> = {
  tabs: readonly T[]
  activeTab: T
  onTabSelect: (tab: T) => void
  disabledTabs?: Partial<Record<T, string>>
}

const CasaTabs = <T extends string>({ tabs, activeTab, onTabSelect, disabledTabs }: CasaTabsProps<T>) => {
  const tabListRef = useRef<HTMLDivElement | null>(null)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number } | null>(null)

  useEffect(() => {
    const updateIndicator = () => {
      const activeButton = tabRefs.current[activeTab]
      const container = tabListRef.current
      if (!activeButton || !container) return
      const containerRect = container.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()
      setIndicatorStyle({
        left: Math.max(0, buttonRect.left - containerRect.left + container.scrollLeft),
        width: buttonRect.width,
      })
    }

    updateIndicator()
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [activeTab, tabs])

  return (
    <div className={styles.tabCard}>
      <div className={styles.tabList} role="tablist" ref={tabListRef}>
        <div className={styles.tabIndicator} style={indicatorStyle ? { left: `${indicatorStyle.left}px`, width: `${indicatorStyle.width}px` } : undefined} aria-hidden="true" />
        <div className={styles.tabUnderline} style={indicatorStyle ? { left: `${indicatorStyle.left}px`, width: `${indicatorStyle.width}px` } : undefined} aria-hidden="true" />
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab
          const disabledReason = disabledTabs?.[tab]
          const isDisabled = Boolean(disabledReason)
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-disabled={isDisabled}
              disabled={isDisabled}
              tabIndex={isDisabled ? -1 : 0}
              title={disabledReason}
              ref={(el) => {
                tabRefs.current[tab] = el
              }}
              className={`${styles.tabButton} ${isActive ? styles.active : ''} ${isDisabled ? styles.disabledTab : ''}`}
              onClick={() => {
                if (isDisabled) return
                onTabSelect(tab)
              }}
            >
              <span className={styles.tabNumber}>{String(index + 1).padStart(2, '0')}</span>
              {tab}
              {isDisabled && <LockIcon className={styles.lockIcon} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CasaTabs
