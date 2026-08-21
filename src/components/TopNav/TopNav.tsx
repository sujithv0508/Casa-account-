import { BankIcon, BellIcon, ChevronDownIcon, ChevronRightIcon, HelpIcon, MenuIcon, SearchIcon } from '../icons/Icons'
import styles from './TopNav.module.css'

type Crumb = string

type TopNavProps = {
  crumbs: Crumb[]
}

const TopNav = ({ crumbs }: TopNavProps) => {
  return (
    <header className={styles.nav}>
      <div className={styles.left}>
        <button type="button" className={styles.iconButton} aria-label="Menu">
          <MenuIcon className={styles.icon} />
        </button>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>
            <BankIcon className={styles.brandIconGlyph} />
          </span>
          <span className={styles.brandName}>Core Banking</span>
        </div>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          {crumbs.map((crumb, index) => (
            <span key={crumb} className={styles.crumbGroup}>
              <span className={index === crumbs.length - 1 ? styles.crumbActive : styles.crumb}>{crumb}</span>
              {index < crumbs.length - 1 && <ChevronRightIcon className={styles.crumbSep} />}
            </span>
          ))}
        </nav>
      </div>

      <div className={styles.right}>
        <button type="button" className={styles.iconButton} aria-label="Search">
          <SearchIcon className={styles.icon} />
        </button>
        <button type="button" className={styles.iconButton} aria-label="Notifications">
          <BellIcon className={styles.icon} />
          <span className={styles.badge}>3</span>
        </button>
        <button type="button" className={styles.iconButton} aria-label="Help">
          <HelpIcon className={styles.icon} />
        </button>
        <span className={styles.divider} />
        <button type="button" className={styles.userChip}>
          <span className={styles.avatar}>OU</span>
          <span className={styles.userName}>Operations User</span>
          <ChevronDownIcon className={styles.chevron} />
        </button>
      </div>
    </header>
  )
}

export default TopNav
