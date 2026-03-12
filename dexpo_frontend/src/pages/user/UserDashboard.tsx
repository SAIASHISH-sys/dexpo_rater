import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, User } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { getStallByName } from '../../data/stallData'
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
    isLoading,
    error,
  } = useApp()

  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Get stall ID from scanned company name
  const getStallIdForCompany = (companyName: string): string => {
    const stall = getStallByName(companyName)
    return stall?.stall_id || ''
  }

  const handleInvest = async (amount: number) => {
    const stallId = getStallIdForCompany(scannedCompany)
    if (!stallId) {
      console.error('No stall ID found for company:', scannedCompany)
      return
    }
    
    try {
      await addOrUpdateInvestment(stallId, scannedCompany, amount)
    } catch (err) {
      console.error('Investment failed:', err)
    }
  }

  const handleRemove = async (id: number) => {
    const investment = investments.find(inv => inv.id === id)
    if (investment && (investment as any).investmentId) {
      try {
        await removeInvestment((investment as any).investmentId)
      } catch (err) {
        console.error('Failed to remove investment:', err)
      }
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
          />
        </div>

        <InvestmentAccordion
          investments={investments}
          onUpdate={updateInvestment}
          onRemove={handleRemove}
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
