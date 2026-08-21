import styles from './Sidebar.module.css'

type SidebarProps = {
  activeIndex: number
  onSelect: (index: number) => void
}

const icons = [
  { label: 'Menu', symbol: '☰' },
  { label: 'Home', symbol: '🏠' },
  { label: 'Global', symbol: '🌐' },
  { label: 'Document', symbol: '📄' },
  { label: 'Account', symbol: '💳' },
  { label: 'Settings', symbol: '⚙️' },
  { label: 'Building', symbol: '🏦' },
  { label: 'View', symbol: '👁️' },
  { label: 'User', symbol: '👤' },
]

const Sidebar = ({ activeIndex, onSelect }: SidebarProps) => {
  return (
    <nav className={styles.sidebar} aria-label="Page navigation">
      <div className={styles.iconColumn}>
        {icons.map((item, index) => (
          <button
            key={item.label}
            type="button"
            className={`${styles.iconButton} ${activeIndex === index ? styles.active : ''}`}
            onClick={() => onSelect(index)}
            aria-label={item.label}
          >
            <span>{item.symbol}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

export default Sidebar
