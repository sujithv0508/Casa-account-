import { Routes, Route, Navigate } from 'react-router-dom'
import styles from './App.module.css'
import CasaAccountsPage from './pages/CasaAccounts/CasaAccountsPage'
import CasaAccountDetailsPage from './pages/CasaAccountDetails/CasaAccountDetailsPage'

function App() {
  return (
    <div className={styles.appContainer}>
      <Routes>
        <Route path="/" element={<Navigate replace to="/casa" />} />
        <Route path="/casa" element={<CasaAccountsPage />} />
        <Route path="/casa/:accountId" element={<CasaAccountDetailsPage />} />
      </Routes>
    </div>
  )
}

export default App

