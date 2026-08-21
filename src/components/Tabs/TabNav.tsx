import { LockIcon } from '../icons/Icons'
import styles from './TabNav.module.css'

type TabNavProps = {
  tabs: string[]
  activeTab: string
  onTabChange: (tab: string) => void
  disabledTabs?: Partial<Record<string, string>>
}

const TabNav = ({ tabs, activeTab, onTabChange, disabledTabs }: TabNavProps) => {
  return (
    <div className={styles.tabWrapper}>
      <div className={styles.tabList}>
        {tabs.map((tab) => {
          const disabledReason = disabledTabs?.[tab]
          const isDisabled = Boolean(disabledReason)
          return (
            <button
              key={tab}
              type="button"
              aria-disabled={isDisabled}
              disabled={isDisabled}
              tabIndex={isDisabled ? -1 : 0}
              title={disabledReason}
              className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''} ${isDisabled ? styles.disabledTab : ''}`}
              onClick={() => {
                if (isDisabled) return
                onTabChange(tab)
              }}
            >
              {tab}
              {isDisabled && <LockIcon className={styles.lockIcon} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TabNav
