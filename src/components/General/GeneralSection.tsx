import styles from './GeneralSection.module.css'

type GeneralData = {
  customerName: string
  dateOfBirth: string
  mobileNumber: string
  email: string
  customerType: string
  accountType: string
  openingDate: string
  minimumBalance: string
  operatingMode: string
}

type GeneralSectionProps = {
  data: GeneralData
  errors: Record<string, string>
  onChange: <Field extends keyof GeneralData>(section: 'general', field: Field, value: GeneralData[Field]) => void
}

const GeneralSection = ({ data, errors, onChange }: GeneralSectionProps) => {
  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2>General</h2>
        <p>Review the basic customer and account details.</p>
      </div>

      <div className={styles.grid}>
        <label className={styles.field}>
          <span>Customer name</span>
          <input
            value={data.customerName}
            onChange={(event) => onChange('general', 'customerName', event.target.value)}
          />
          {errors['general.customerName'] && <span className={styles.error}>{errors['general.customerName']}</span>}
        </label>

        <label className={styles.field}>
          <span>Date of birth</span>
          <input
            type="date"
            value={data.dateOfBirth}
            onChange={(event) => onChange('general', 'dateOfBirth', event.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span>Mobile number</span>
          <input
            value={data.mobileNumber}
            onChange={(event) => onChange('general', 'mobileNumber', event.target.value)}
          />
          {errors['general.mobileNumber'] && <span className={styles.error}>{errors['general.mobileNumber']}</span>}
        </label>

        <label className={styles.field}>
          <span>Email</span>
          <input
            type="email"
            value={data.email}
            onChange={(event) => onChange('general', 'email', event.target.value)}
          />
          {errors['general.email'] && <span className={styles.error}>{errors['general.email']}</span>}
        </label>

        <label className={styles.field}>
          <span>Customer type</span>
          <select
            value={data.customerType}
            onChange={(event) => onChange('general', 'customerType', event.target.value)}
          >
            <option value="Individual">Individual</option>
            <option value="Business">Business</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>Account type</span>
          <select
            value={data.accountType}
            onChange={(event) => onChange('general', 'accountType', event.target.value)}
          >
            <option value="Savings">Savings</option>
            <option value="Current">Current</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>Opening date</span>
          <input
            type="date"
            value={data.openingDate}
            onChange={(event) => onChange('general', 'openingDate', event.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span>Minimum balance</span>
          <input
            value={data.minimumBalance}
            onChange={(event) => onChange('general', 'minimumBalance', event.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span>Operating mode</span>
          <select
            value={data.operatingMode}
            onChange={(event) => onChange('general', 'operatingMode', event.target.value)}
          >
            <option value="Single">Single</option>
            <option value="Joint">Joint</option>
          </select>
        </label>
      </div>
    </div>
  )
}

export default GeneralSection
