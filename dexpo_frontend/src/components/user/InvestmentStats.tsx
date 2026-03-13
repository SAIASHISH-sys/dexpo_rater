import { TrendingUp, Wallet, Target } from 'lucide-react'
import GlassCard from '../ui/GlassCard'

type Props = {
  spent: number
  moneyLeft: number
  totalBudget: number
  investmentCount: number
}

export default function InvestmentStats({
  spent,
  moneyLeft,
  totalBudget,
  investmentCount,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        {/* Total Invested */}
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-emerald-400" />
            <span className="text-xs text-cyan-100/60">Invested</span>
          </div>
          <p className="text-xl font-bold text-emerald-300">₹{spent.toLocaleString()}</p>
          <p className="text-xs text-cyan-100/40 mt-1">{investmentCount} investments</p>
        </GlassCard>

        {/* Budget Left */}
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={16} className="text-cyan-400" />
            <span className="text-xs text-cyan-100/60">Remaining</span>
          </div>
          <p className="text-xl font-bold text-cyan-300">₹{moneyLeft.toLocaleString()}</p>
          <p className="text-xs text-cyan-100/40 mt-1">of ₹{totalBudget.toLocaleString()}</p>
        </GlassCard>

        {/* Usage Percent */}
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-purple-400" />
            <span className="text-xs text-cyan-100/60">Used</span>
          </div>
          <p className="text-xl font-bold text-purple-300">{((spent / totalBudget) * 100).toFixed(1)}%</p>
          <p className="text-xs text-cyan-100/40 mt-1">of budget</p>
        </GlassCard>
      </div>
    </div>
  )
}
