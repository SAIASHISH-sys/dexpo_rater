import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, User } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Header from '../../components/ui/Header'
import BottomNav from '../../components/ui/BottomNav'
import QRScanner from '../../components/user/QRScanner'
import MoneyBar from '../../components/user/MoneyBar'
import InvestSlider from '../../components/user/InvestSlider'
import InvestmentAccordion from '../../components/user/InvestmentAccordion'
import InvestmentStats from '../../components/user/InvestmentStats'
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
    isLoading,
    error,
    stalls,
  } = useApp()

  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleInvest = async (amount: number) => {
    if (!scannedCompany) {
      console.error('No company selected')
      return
    }
    
    try {
      // Find the stall with matching name
      const stall = stalls.find(s => s.name === scannedCompany)
      if (!stall) {
        console.error('Stall not found for company:', scannedCompany)
        return
      }
      
      // Pass the actual stall_id
      await addOrUpdateInvestment(stall.stall_id, scannedCompany, amount)
    } catch (err) {
      console.error('Investment failed:', err)
    }
  }

  return (
    <main className="min-h-screen app-bg px-4 pb-24 pt-6 text-slate-100">
      <div className="mx-auto w-full max-w-4xl space-y-2">
        <Header tag="USER PORTAL" title="Dashboard" onLogout={handleLogout} />

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="glass-group">
          <QRScanner
            activeCompany={scannedCompany}
            onScan={(code) => setScannedCompany(code)}
            stalls={stalls}
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
            onInvest={handleInvest}
            isLoading={isLoading}
            moneyLeft={moneyLeft}
          />
        </div>

        <InvestmentStats
          spent={spent}
          moneyLeft={moneyLeft}
          totalBudget={totalBudget}
          investmentCount={investments.length}
        />

        <InvestmentAccordion
          investments={investments}
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
