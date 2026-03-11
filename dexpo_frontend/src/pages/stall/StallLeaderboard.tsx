import { useNavigate, useLocation } from 'react-router-dom'
import { User, Trophy, Medal, TrendingUp } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { STALL_LEADERBOARD } from '../../data/constants'
import Header from '../../components/ui/Header'
import BottomNav from '../../components/ui/BottomNav'
import GlassCard from '../../components/ui/GlassCard'

const MEDAL_COLORS: Record<number, string> = {
  1: 'from-yellow-400 to-amber-500',
  2: 'from-gray-300 to-gray-400',
  3: 'from-orange-400 to-amber-600',
}

const MEDAL_BG: Record<number, string> = {
  1: 'bg-yellow-400/10 border-yellow-400/25',
  2: 'bg-gray-300/10 border-gray-400/20',
  3: 'bg-orange-400/10 border-orange-400/20',
}

export default function StallLeaderboard() {
  const { logout } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const topInvestment = STALL_LEADERBOARD[0]?.investment ?? 1

  return (
    <main className="min-h-screen app-bg px-4 pb-24 pt-6 text-slate-100">
      <div className="mx-auto w-full max-w-4xl space-y-2">
        <Header
          tag="STALL PORTAL"
          title="Leaderboard"
          onLogout={handleLogout}
        />

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <GlassCard className="p-4 text-center">
            <TrendingUp size={20} className="mx-auto mb-1 text-emerald-300" />
            <p className="text-xl font-bold text-white">
              ₹{STALL_LEADERBOARD.reduce((s, r) => s + r.investment, 0).toLocaleString()}
            </p>
            <p className="text-[10px] text-cyan-100/50">Total Investments</p>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <Trophy size={20} className="mx-auto mb-1 text-yellow-400" />
            <p className="text-xl font-bold text-white">
              {STALL_LEADERBOARD.length}
            </p>
            <p className="text-[10px] text-cyan-100/50">Companies Ranked</p>
          </GlassCard>
          <GlassCard className="col-span-2 p-4 text-center sm:col-span-1">
            <Medal size={20} className="mx-auto mb-1 text-cyan-300" />
            <p className="text-xl font-bold text-white">
              {STALL_LEADERBOARD[0]?.name.split(' ')[0] ?? '—'}
            </p>
            <p className="text-[10px] text-cyan-100/50">Top Company</p>
          </GlassCard>
        </div>

        <div className="glass-group">
        {/* Top-3 podium */}
        <GlassCard className="p-5">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Trophy size={18} className="text-yellow-400" />
            Top Performers
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {STALL_LEADERBOARD.slice(0, 3).map((entry) => (
              <div
                key={entry.rank}
                className={`flex flex-col items-center rounded-2xl border p-4 ${
                  MEDAL_BG[entry.rank] ?? 'border-cyan-100/10 bg-slate-900/30'
                }`}
              >
                <div
                  className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br font-bold text-white ${
                    MEDAL_COLORS[entry.rank] ?? 'from-slate-500 to-slate-600'
                  }`}
                >
                  #{entry.rank}
                </div>
                <p className="text-center text-xs font-semibold text-white leading-tight">
                  {entry.name}
                </p>
                <p className="mt-1 text-[11px] font-bold text-emerald-300">
                  ₹{entry.investment.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Full list */}
        <GlassCard className="overflow-hidden p-0">
          <div className="border-b border-cyan-100/10 px-5 py-3">
            <h3 className="text-sm font-semibold text-white">
              Full Rankings
            </h3>
          </div>
          {STALL_LEADERBOARD.map((entry) => {
            const barWidth = (entry.investment / topInvestment) * 100
            return (
              <div
                key={entry.rank}
                className="group grid grid-cols-12 items-center border-b border-cyan-100/8 px-5 py-3 transition hover:bg-slate-800/20 last:border-0"
              >
                <div className="col-span-1">
                  <span
                    className={`text-sm font-bold ${
                      entry.rank <= 3 ? 'text-emerald-300' : 'text-cyan-200/60'
                    }`}
                  >
                    {entry.rank}
                  </span>
                </div>
                <div className="col-span-5 sm:col-span-4">
                  <p className="text-sm font-medium text-white">{entry.name}</p>
                </div>
                <div className="col-span-3 hidden sm:block">
                  <div className="h-2 overflow-hidden rounded-full bg-slate-900/60">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400/80 to-cyan-300/80 transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-4">
                  <p className="text-right text-sm font-semibold text-cyan-100">
                    ₹{entry.investment.toLocaleString()}
                  </p>
                </div>
              </div>
            )
          })}
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
