import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Sparkles,
  Pencil,
  Check,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Header from '../../components/ui/Header'
import BottomNav from '../../components/ui/BottomNav'
import GlassCard from '../../components/ui/GlassCard'
import type { UserProfile as UserProfileType } from '../../types'

type FieldConfig = {
  key: keyof UserProfileType
  label: string
  placeholder: string
  icon: React.ReactNode
}

const FIELDS: FieldConfig[] = [
  { key: 'email', label: 'Email', placeholder: 'your@email.com', icon: <Mail size={15} /> },
  { key: 'name', label: 'Full Name', placeholder: 'Add your name', icon: <User size={15} /> },
  { key: 'mobile', label: 'Mobile No.', placeholder: 'Add mobile number', icon: <Phone size={15} /> },
  { key: 'city', label: 'City', placeholder: 'Add city', icon: <MapPin size={15} /> },
  { key: 'college', label: 'College / Org', placeholder: 'Add organisation', icon: <GraduationCap size={15} /> },
  { key: 'interests', label: 'Interests', placeholder: 'AI, Robotics…', icon: <Sparkles size={15} /> },
]

export default function UserProfile() {
  const { logout, userProfile, updateUserProfile } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [editingField, setEditingField] = useState<keyof UserProfileType | null>(null)
  const [editValue, setEditValue] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const startEdit = (field: FieldConfig) => {
    setEditingField(field.key)
    setEditValue(userProfile[field.key])
  }

  const confirmEdit = () => {
    if (editingField) {
      updateUserProfile(editingField, editValue)
      setEditingField(null)
      setEditValue('')
    }
  }

  return (
    <main className="min-h-screen app-bg px-4 pb-24 pt-6 text-slate-100">
      <div className="mx-auto w-full max-w-4xl space-y-2">
        <Header tag="USER PORTAL" title="Profile" onLogout={handleLogout} />

        <div className="glass-group">
        {/* Avatar area */}
        <GlassCard className="flex flex-col items-center p-6">
          <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/25 to-cyan-400/25 text-3xl">
            👤
          </div>
          <h2 className="text-xl font-bold text-white">
            {userProfile.name || 'Delta Expo Visitor'}
          </h2>
          <p className="text-sm text-cyan-100/60">
            {userProfile.email || 'Not signed in'}
          </p>
        </GlassCard>

        {/* Profile fields */}
        <GlassCard className="p-5">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {FIELDS.map((field) => {
              const isEditing = editingField === field.key
              const value = userProfile[field.key]

              return (
                <div
                  key={field.key}
                  className={`group rounded-xl border p-3 transition-all duration-200 ${
                    isEditing
                      ? 'border-emerald-400/40 bg-slate-900/60'
                      : 'border-cyan-100/15 bg-slate-950/30 hover:border-cyan-100/25'
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-100/60">
                      {field.icon}
                      {field.label}
                    </span>
                    {!isEditing && field.key !== 'email' && (
                      <button
                        onClick={() => startEdit(field)}
                        className="rounded p-0.5 text-cyan-200/40 opacity-0 transition group-hover:opacity-100 hover:text-emerald-300"
                      >
                        <Pencil size={12} />
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex gap-2">
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && confirmEdit()}
                        placeholder={field.placeholder}
                        autoFocus
                        className="flex-1 rounded-md border border-cyan-100/20 bg-slate-950/40 px-2 py-1 text-sm text-white outline-none placeholder:text-cyan-100/30 focus:border-emerald-400/50"
                      />
                      <button
                        onClick={confirmEdit}
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-400/90 text-slate-900"
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <p
                      className={`text-sm ${
                        value ? 'text-white' : 'text-cyan-100/30 italic'
                      }`}
                    >
                      {value || field.placeholder}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </GlassCard>
        </div>
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
