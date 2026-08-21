import SectionCard from '../SectionCard/SectionCard'
import { AtmIcon, CardIcon, ChequeIcon, OverdraftIcon, PricingIcon } from '../icons/Icons'
import styles from './AccountFacilities.module.css'

export type FacilitiesState = {
  atm: boolean
  cheque: boolean
  overdraft: boolean
  pricing: boolean
}

type Facility = {
  key: keyof FacilitiesState
  label: string
  description: string
  icon: typeof AtmIcon
  tone: 'blue' | 'purple' | 'orange' | 'green'
}

const facilities: Facility[] = [
  { key: 'atm', label: 'ATM', description: 'Cash withdrawal services', icon: AtmIcon, tone: 'blue' },
  { key: 'cheque', label: 'Cheque Book', description: 'Cheque management', icon: ChequeIcon, tone: 'purple' },
  { key: 'overdraft', label: 'Overdraft Facility', description: 'Credit facility', icon: OverdraftIcon, tone: 'orange' },
  { key: 'pricing', label: 'Account Pricing Applicable', description: 'Pricing configuration', icon: PricingIcon, tone: 'green' },
]

type AccountFacilitiesProps = {
  state: FacilitiesState
  editable: boolean
  onToggle: (key: keyof FacilitiesState) => void
}

const AccountFacilities = ({ state, editable, onToggle }: AccountFacilitiesProps) => {
  return (
    <SectionCard
      icon={<CardIcon />}
      title="Account Facilities"
      subtitle="Available services for this account"
      tone="teal"
      reveal
    >
      <div className={styles.grid}>
        {facilities.map((item) => {
          const Icon = item.icon
          const isOn = state[item.key]
          return (
            <div key={item.key} className={styles.tile}>
              <span className={`${styles.iconWrap} ${styles[`tone_${item.tone}`]}`}>
                <Icon className={styles.icon} />
              </span>
              <span className={styles.textCol}>
                <span className={styles.tileLabel}>{item.label}</span>
                <span className={styles.tileDesc}>{item.description}</span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={isOn}
                aria-label={item.label}
                disabled={!editable}
                className={`${styles.toggle} ${isOn ? styles.on : ''} ${!editable ? styles.disabled : ''}`}
                onClick={() => onToggle(item.key)}
              >
                <span className={styles.knob} />
              </button>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}

export default AccountFacilities
