import { useNavigate, useLocation } from 'react-router-dom'
import {
  User,
  Trophy,
  Building2,
  Globe,
  MapPin,
  Users,
  Mail,
  Layers,
  FileText,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { DEFAULT_STALL_INFO } from '../../data/constants'
import Header from '../../components/ui/Header'
import BottomNav from '../../components/ui/BottomNav'
import GlassCard from '../../components/ui/GlassCard'

const INFO_ITEMS = [
  { icon: <Building2 size={15} />, label: 'Company Name', value: DEFAULT_STALL_INFO.companyName },
  { icon: <Layers size={15} />, label: 'Category', value: DEFAULT_STALL_INFO.category },
  { icon: <Globe size={15} />, label: 'Website', value: DEFAULT_STALL_INFO.website },
  { icon: <Mail size={15} />, label: 'Contact Email', value: DEFAULT_STALL_INFO.contactEmail },
  { icon: <MapPin size={15} />, label: 'Location', value: DEFAULT_STALL_INFO.location },
  { icon: <Users size={15} />, label: 'Team Size', value: DEFAULT_STALL_INFO.teamSize },
]

export default function StallProfile() {
  const { logout } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <main className="min-h-screen app-bg px-4 pb-24 pt-6 text-slate-100">
      <div className="mx-auto w-full max-w-4xl space-y-2">
        <Header
          tag="STALL PORTAL"
          title="Company Profile"
          onLogout={handleLogout}
        />

        <div className="glass-group">
        {/* Banner card */}
        <GlassCard className="overflow-hidden">
          <div className="relative flex items-center gap-4 p-5">
            {/* Logo */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 text-3xl shadow-lg shadow-emerald-500/10">
              {DEFAULT_STALL_INFO.logo}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {DEFAULT_STALL_INFO.companyName}
              </h2>
              <span className="mt-1 inline-block rounded-md bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-cyan-300">
                {DEFAULT_STALL_INFO.category}
              </span>
            </div>
            {/* Decorative circle */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/5 blur-2xl" />
          </div>
        </GlassCard>

        {/* Description */}
        <GlassCard className="p-5">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-cyan-200/80">
            <FileText size={15} />
            About
          </div>
          <p className="text-sm leading-relaxed text-cyan-50/75">
            {DEFAULT_STALL_INFO.description}
          </p>
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
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-100/50">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-sm text-white">{item.value}</p>
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
