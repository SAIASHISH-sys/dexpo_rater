import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { LoginRole, Investment, UserProfile } from '../types'
import { COMPANIES, TOTAL_BUDGET } from '../data/constants'

type AppState = {
  // Auth
  isAuthed: boolean
  loginRole: LoginRole
  email: string

  // User profile
  userProfile: UserProfile

  // Investments
  investments: Investment[]
  scannedCompany: string
  totalBudget: number
  spent: number
  moneyLeft: number
  spentPercent: number

  // Actions
  login: (role: LoginRole) => void
  logout: () => void
  setScannedCompany: (company: string) => void
  addOrUpdateInvestment: (company: string, amount: number) => void
  updateInvestment: (id: number, amount: number) => void
  removeInvestment: (id: number) => void
  updateUserProfile: (field: keyof UserProfile, value: string) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthed, setIsAuthed] = useState(false)
  const [loginRole, setLoginRole] = useState<LoginRole>('user')
  const [email, setEmail] = useState('')

  const [userProfile, setUserProfile] = useState<UserProfile>({
    email: '',
    name: '',
    mobile: '',
    city: '',
    college: '',
    interests: '',
  })

  const [investments, setInvestments] = useState<Investment[]>([
    { id: 1, company: 'Neon Robotics', amount: 2000 },
    { id: 2, company: 'GreenGrid Energy', amount: 1400 },
  ])

  const [scannedCompany, setScannedCompany] = useState(COMPANIES[0])

  const spent = investments.reduce((sum, item) => sum + item.amount, 0)
  const moneyLeft = Math.max(TOTAL_BUDGET - spent, 0)
  const spentPercent = Math.min((spent / TOTAL_BUDGET) * 100, 100)

  const login = useCallback((role: LoginRole) => {
    const userEmail =
      role === 'user' ? 'visitor@deltaexpo.com' : 'stall@deltaexpo.com'
    setEmail(userEmail)
    setLoginRole(role)
    setIsAuthed(true)
    setUserProfile((prev) => ({ ...prev, email: userEmail }))
  }, [])

  const logout = useCallback(() => {
    setIsAuthed(false)
    setLoginRole('user')
    setEmail('')
  }, [])

  const addOrUpdateInvestment = useCallback(
    (company: string, amount: number) => {
      if (amount <= 0) return
      setInvestments((prev) => {
        const existing = prev.find((item) => item.company === company)
        if (existing) {
          return prev.map((item) =>
            item.company === company
              ? { ...item, amount: item.amount + amount }
              : item,
          )
        }
        return [...prev, { id: Date.now(), company, amount }]
      })
    },
    [],
  )

  const updateInvestment = useCallback((id: number, amount: number) => {
    setInvestments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, amount: Math.max(amount, 0) } : item,
      ),
    )
  }, [])

  const removeInvestment = useCallback((id: number) => {
    setInvestments((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const updateUserProfile = useCallback(
    (field: keyof UserProfile, value: string) => {
      setUserProfile((prev) => ({ ...prev, [field]: value }))
    },
    [],
  )

  return (
    <AppContext.Provider
      value={{
        isAuthed,
        loginRole,
        email,
        userProfile,
        investments,
        scannedCompany,
        totalBudget: TOTAL_BUDGET,
        spent,
        moneyLeft,
        spentPercent,
        login,
        logout,
        setScannedCompany,
        addOrUpdateInvestment,
        updateInvestment,
        removeInvestment,
        updateUserProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
