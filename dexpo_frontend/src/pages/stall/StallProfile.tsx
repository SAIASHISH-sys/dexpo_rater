import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  User,
  Trophy,
  Building2,
  Mail,
  Layers,
  FileText,
  Pencil,
  Check,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { stallAPI } from '../../services/api'
import type { Stall } from '../../services/api'
import { DEFAULT_STALL_INFO } from '../../data/constants'
import Header from '../../components/ui/Header'
import BottomNav from '../../components/ui/BottomNav'
import GlassCard from '../../components/ui/GlassCard'

export default function StallProfile() {
  const { logout, userId, isAuthed } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [stallData, setStallData] = useState<Stall | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({
    name: '',
    organisations: '',
    about: '',
  })

  useEffect(() => {
    if (isAuthed && userId) {
      fetchStallData()
    }
  }, [isAuthed, userId])

  const fetchStallData = async () => {
    if (!userId) return
    
    setIsLoading(true)
    try {
      const data = await stallAPI.getStallById(userId)
      setStallData(data)
      setEditedData({
        name: data.name || '',
        organisations: data.organisations || '',
        about: data.about || '',
      })
    } catch (err) {
      console.error('Failed to fetch stall data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load stall data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const updated = await stallAPI.updateStallData(editedData)
      setStallData(updated)
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to update stall data:', err)
      setError(err instanceof Error ? err.message : 'Failed to update stall data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Use fetched data or fallback to default
  const displayData = stallData || {
    name: DEFAULT_STALL_INFO.companyName,
    organisations: DEFAULT_STALL_INFO.companyName,
    about: DEFAULT_STALL_INFO.description,
    email_id: '',
  }

  const INFO_ITEMS = [
    { icon: <Building2 size={15} />, label: 'Company Name', value: displayData.name },
    { icon: <Layers size={15} />, label: 'Organisation', value: displayData.organisations || 'Not specified' },
    { icon: <Mail size={15} />, label: 'Contact Email', value: displayData.email_id },
  ]

  return (
    <main className="min-h-screen app-bg px-4 pb-24 pt-6 text-slate-100">
      <div className="mx-auto w-full max-w-4xl space-y-2">
        <Header
          tag="STALL PORTAL"
          title="Company Profile"
          onLogout={handleLogout}
        />

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        {isLoading && !stallData && (
          <div className="text-center py-8 text-cyan-100/50">Loading...</div>
        )}

        <div className="glass-group">
        {/* Banner card */}
        <GlassCard className="overflow-hidden">
          <div className="relative flex items-center gap-4 p-5">
            {/* Logo */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 text-3xl shadow-lg shadow-emerald-500/10">
              {DEFAULT_STALL_INFO.logo}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.name}
                  onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                  className="w-full bg-slate-800 rounded-lg px-3 py-1 text-lg font-bold text-white border border-cyan-400/30"
                  placeholder="Company Name"
                />
              ) : (
                <h2 className="text-xl font-bold text-white">
                  {displayData.name}
                </h2>
              )}
            </div>
            <button
              onClick={() => {
                if (isEditing) {
                  handleSave()
                } else {
                  setIsEditing(true)
                }
              }}
              disabled={isLoading}
              className="flex items-center gap-1 rounded-lg bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-400/20 disabled:opacity-50"
            >
              {isEditing ? <><Check size={14} /> Save</> : <><Pencil size={14} /> Edit</>}
            </button>
            {/* Decorative circle */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/5 blur-2xl" />
          </div>
        </GlassCard>

        {/* Description */}
        <GlassCard className="p-5">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-cyan-200/80">
              <FileText size={15} />
              About
            </div>
          </div>
          {isEditing ? (
            <textarea
              value={editedData.about}
              onChange={(e) => setEditedData({ ...editedData, about: e.target.value })}
              className="w-full bg-slate-800 rounded-lg px-3 py-2 text-sm text-cyan-50/75 border border-cyan-400/30 min-h-[100px]"
              placeholder="About your company..."
            />
          ) : (
            <p className="text-sm leading-relaxed text-cyan-50/75">
              {displayData.about || 'No description provided'}
            </p>
          )}
        </GlassCard>

        {/* Info grid */}
        <GlassCard className="p-5">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Company Details
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {INFO_ITEMS.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 rounded-xl border border-cyan-100/12 bg-slate-950/30 p-3"
              >
                <div className="mt-0.5 text-emerald-300/80">{item.icon}</div>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-100/50">
                    {item.label}
                  </p>
                  {isEditing && item.label === 'Organisation' ? (
                    <input
                      type="text"
                      value={editedData.organisations}
                      onChange={(e) => setEditedData({ ...editedData, organisations: e.target.value })}
                      className="mt-1 w-full bg-slate-800 rounded px-2 py-1 text-sm text-white border border-cyan-400/30"
                      placeholder="Organisation name"
                    />
                  ) : (
                    <p className="mt-0.5 text-sm text-white">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
        </div>
      </div>

      <BottomNav
        items={[
          {
            label: 'Profile',
            icon: <User size={18} />,
            active: location.pathname === '/stall/profile',
            onClick: () => navigate('/stall/profile'),
          },
          {
            label: 'Leaderboard',
            icon: <Trophy size={18} />,
            active: location.pathname === '/stall/leaderboard',
            onClick: () => navigate('/stall/leaderboard'),
          },
        ]}
      />
    </main>
  )
}
