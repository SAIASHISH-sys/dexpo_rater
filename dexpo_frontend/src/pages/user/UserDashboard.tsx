import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, User } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Header from '../../components/ui/Header'
import BottomNav from '../../components/ui/BottomNav'
import QRScanner from '../../components/user/QRScanner'
import MoneyBar from '../../components/user/MoneyBar'
import InvestSlider from '../../components/user/InvestSlider'
import InvestmentAccordion from '../../components/user/InvestmentAccordion'
import CompanyDashboard from '../../components/user/CompanyDashboard'

export default function UserDashboard() {
  const {
    logout,
    scannedCompany,
    setScannedCompany,
    investments,
    spent,
    moneyLeft,
    spentPercent,
    totalBudget,
    addOrUpdateInvestment,
    updateInvestment,
    removeInvestment,
  } = useApp()

  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <main className="min-h-screen app-bg px-4 pb-24 pt-6 text-slate-100">
      <div className="mx-auto w-full max-w-4xl space-y-2">
        <Header tag="USER PORTAL" title="Dashboard" onLogout={handleLogout} />

        <div className="glass-group">
          <QRScanner
            activeCompany={scannedCompany}
            onScan={(code) => setScannedCompany(code)}
          />
          <CompanyDashboard company={scannedCompany} />
        </div>

        <div className="glass-group">
          <MoneyBar
            spent={spent}
            moneyLeft={moneyLeft}
            spentPercent={spentPercent}
            totalBudget={totalBudget}
          />
          <InvestSlider
            company={scannedCompany}
            onInvest={(amount) => addOrUpdateInvestment(scannedCompany, amount)}
          />
        </div>

        <InvestmentAccordion
          investments={investments}
          onUpdate={updateInvestment}
          onRemove={removeInvestment}
        />
      </div>

      <BottomNav
        items={[
          {
            label: 'Dashboard',
            icon: <LayoutDashboard size={18} />,
            active: location.pathname === '/user/dashboard',
            onClick: () => navigate('/user/dashboard'),
          },
          {
            label: 'Profile',
            icon: <User size={18} />,
            active: location.pathname === '/user/profile',
            onClick: () => navigate('/user/profile'),
          },
        ]}
      />
    </main>
  )
}
