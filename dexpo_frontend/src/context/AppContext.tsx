import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { LoginRole, Investment, UserProfile } from '../types'
import { COMPANIES, TOTAL_BUDGET } from '../data/constants'
import { authAPI, investmentAPI, setAuthToken, removeAuthToken, stallAPI } from '../services/api'
import type { InvestmentWithStall, Stall } from '../services/api'

type AppState = {
  // Auth
  isAuthed: boolean
  loginRole: LoginRole
  email: string
  userId: string | null
  
  // Loading states
  isLoading: boolean
  error: string | null

  // User profile
  userProfile: UserProfile

  // Stalls data
  stalls: Stall[]

  // Investments
  investments: Investment[]
  scannedCompany: string
  totalBudget: number
  spent: number
  moneyLeft: number
  spentPercent: number

  // Actions
  loginWithCredentials: (role: LoginRole, email: string, password: string) => Promise<boolean>
  logout: () => void
  setScannedCompany: (company: string) => void
  addOrUpdateInvestment: (stallId: string, company: string, amount: number) => Promise<void>
  updateInvestment: (id: number, amount: number) => void
  removeInvestment: (investmentId: string) => Promise<void>
  updateUserProfile: (field: keyof UserProfile, value: string) => void
  fetchUserInvestments: () => Promise<void>
  clearError: () => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthed, setIsAuthed] = useState(false)
  const [loginRole, setLoginRole] = useState<LoginRole>('user')
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stalls, setStalls] = useState<Stall[]>([])

  const [userProfile, setUserProfile] = useState<UserProfile>({
    email: '',
    name: '',
    mobile: '',
    city: '',
    college: '',
    interests: '',
  })

  const [investments, setInvestments] = useState<Investment[]>([])

  const [scannedCompany, setScannedCompany] = useState(COMPANIES[0])

  // Fetch stalls data on mount
  useEffect(() => {
    const fetchStalls = async () => {
      try {
        const stallsData = await stallAPI.getAllStalls()
        console.log('📊 Fetched stalls from backend:', stallsData.map(s => s.name))
        setStalls(stallsData)
      } catch (err) {
        console.error('Failed to fetch stalls:', err)
      }
    }
    fetchStalls()
  }, [])

  // Define fetchUserInvestments early so it can be used in the auth check useEffect
  const fetchUserInvestments = useCallback(async () => {
    if (!isAuthed || loginRole !== 'user') return
    
    try {
      const portfolio = await investmentAPI.getUserPortfolio()
      
      // Transform backend investments to frontend format
      const transformedInvestments: Investment[] = portfolio.investments.map((inv: InvestmentWithStall) => ({
        id: inv.investment_id as unknown as number,
        company: inv.stalls.name || inv.stalls.organisations || 'Unknown Company',
        amount: Number(inv.amount_invested) || 0, // Convert to number to prevent string concatenation
        investmentId: inv.investment_id, // Store original ID for deletion
        stallId: inv.stall_id,
      })) as Investment[]
      
      setInvestments(transformedInvestments)
    } catch (err) {
      console.error('Failed to fetch investments:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch investments')
    }
  }, [isAuthed, loginRole])

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const storedUserId = localStorage.getItem('userId')
    const storedRole = localStorage.getItem('userRole') as LoginRole
    const storedEmail = localStorage.getItem('userEmail')

    if (token && storedUserId && storedRole) {
      setIsAuthed(true)
      setUserId(storedUserId)
      setLoginRole(storedRole)
      setEmail(storedEmail || '')
      setUserProfile(prev => ({ ...prev, email: storedEmail || '' }))
      
      // Fetch investments if user role
      if (storedRole === 'user') {
        fetchUserInvestments()
      }
    }
  }, [fetchUserInvestments])

  // Ensure amounts are numbers before calculating - convert strings to numbers
  const spent = investments.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  const moneyLeft = Math.max(TOTAL_BUDGET - spent, 0)
  const spentPercent = Math.min((spent / TOTAL_BUDGET) * 100, 100)

  const loginWithCredentials = useCallback(async (role: LoginRole, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = role === 'user' 
        ? await authAPI.userLogin(email, password)
        : await authAPI.stallLogin(email, password)
      
      // Store auth data
      setAuthToken(response.token)
      localStorage.setItem('userId', response.u_id)
      localStorage.setItem('userRole', role)
      localStorage.setItem('userEmail', email)
      
      // Update state
      setEmail(email)
      setUserId(response.u_id)
      setLoginRole(role)
      setIsAuthed(true)
      setUserProfile((prev) => ({ ...prev, email }))
      
      // Fetch investments if user
      if (role === 'user') {
        await fetchUserInvestments()
      }
      
      setIsLoading(false)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      setIsLoading(false)
      return false
    }
  }, [])

  const logout = useCallback(() => {
    removeAuthToken()
    setIsAuthed(false)
    setLoginRole('user')
    setEmail('')
    setUserId(null)
    setInvestments([])
    setUserProfile({
      email: '',
      name: '',
      mobile: '',
      city: '',
      college: '',
      interests: '',
    })
  }, [])

  const addOrUpdateInvestment = useCallback(
    async (stallId: string, company: string, amount: number) => {
      // Calculate current spent
      const currentSpent = investments.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
      const remainingBudget = TOTAL_BUDGET - currentSpent

      // Validation
      if (amount < 100 || !isAuthed || loginRole !== 'user' || !stallId) {
        setError('Investment must be at least ₹100')
        console.error('Invalid investment:', { stallId, company, amount, isAuthed, loginRole })
        return
      }
      
      // Check if investment exceeds remaining budget
      if (amount > remainingBudget) {
        setError(`Cannot invest ₹${amount.toLocaleString()}. Only ₹${remainingBudget.toLocaleString()} remaining in your budget.`)
        return
      }
      
      setIsLoading(true)
      setError(null)
      
      try {
        console.log('Creating investment:', { stallId, company, amount })
        // Create investment in backend using the stallId
        await investmentAPI.createInvestment(stallId, amount)
        
        // Refresh investments from backend
        await fetchUserInvestments()
        
        setIsLoading(false)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to create investment'
        setError(errorMsg)
        setIsLoading(false)
        throw err
      }
    },
    [isAuthed, loginRole, fetchUserInvestments, investments],
  )

  const updateInvestment = useCallback((id: number, amount: number) => {
    // Local update only for now - could be extended to call backend
    setInvestments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, amount: Math.max(amount, 0) } : item,
      ),
    )
  }, [])

  const removeInvestment = useCallback(async (investmentId: string) => {
    if (!isAuthed || loginRole !== 'user') return
    
    setIsLoading(true)
    setError(null)
    
    try {
      await investmentAPI.deleteInvestment(investmentId)
      
      // Optimistically remove from local state
      setInvestments((prev) => prev.filter((item) => (item as any).investmentId !== investmentId))
      
      setIsLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete investment')
      setIsLoading(false)
      throw err
    }
  }, [isAuthed, loginRole])

  const updateUserProfile = useCallback(
    (field: keyof UserProfile, value: string) => {
      setUserProfile((prev) => ({ ...prev, [field]: value }))
    },
    [],
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return (
    <AppContext.Provider
      value={{
        isAuthed,
        loginRole,
        email,
        userId,
        isLoading,
        error,
        userProfile,
        stalls,
        investments,
        scannedCompany,
        totalBudget: TOTAL_BUDGET,
        spent,
        moneyLeft,
        spentPercent,
        loginWithCredentials,
        logout,
        setScannedCompany,
        addOrUpdateInvestment,
        updateInvestment,
        removeInvestment,
        updateUserProfile,
        fetchUserInvestments,
        clearError,
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
