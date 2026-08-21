import { useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './SectionCard.module.css'

type SectionCardProps = {
  icon?: ReactNode
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
  bodyClassName?: string
  /** Opt-in visual tone. Defaults to the standard glass card used everywhere else. */
  tone?: 'default' | 'teal'
  /** Opt-in fade/rise-in animation when the card enters the viewport. */
  reveal?: boolean
  children: ReactNode
}

const SectionCard = ({
  icon,
  title,
  subtitle,
  action,
  className,
  bodyClassName,
  tone = 'default',
  reveal = false,
  children,
}: SectionCardProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(!reveal)

  useEffect(() => {
    if (!reveal) return
    const node = cardRef.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [reveal])

  const toneClass = tone === 'teal' ? styles.tealTone : ''
  const revealClass = reveal ? `${styles.reveal} ${isVisible ? styles.visible : ''}` : ''

  return (
    <div ref={cardRef} className={`${styles.card} ${toneClass} ${revealClass} ${className ?? ''}`}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <div>
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
        {action && <div className={styles.headerAction}>{action}</div>}
      </div>
      <div className={`${styles.body} ${bodyClassName ?? ''}`}>{children}</div>
    </div>
  )
}

export default SectionCard
