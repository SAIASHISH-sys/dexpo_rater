import { Wallet, TrendingDown } from 'lucide-react'
import GlassCard from '../ui/GlassCard'

type Props = {
  spent: number
  moneyLeft: number
  spentPercent: number
  totalBudget: number
}

export default function MoneyBar({
  spent,
  moneyLeft,
  spentPercent,
  totalBudget,
}: Props) {
  return (
    <GlassCard className="p-4">
      <div className="mb-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5 text-emerald-300">
          <Wallet size={15} />
          <span>Budget: ₹{totalBudget.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5 text-cyan-200/80">
          <TrendingDown size={15} />
          <span>Left: ₹{moneyLeft.toLocaleString()}</span>
        </div>
      </div>

      {/* Progress track */}
      <div className="relative h-5 overflow-hidden rounded-full bg-slate-900/60">
        <div
          className="money-bar-fill absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${spentPercent}%` }}
        />
        {/* Sheen overlay */}
        <div className="money-bar-sheen absolute inset-0 rounded-full" />
      </div>

      <div className="mt-2 flex justify-between text-xs text-cyan-100/70">
        <span>Spent ₹{spent.toLocaleString()}</span>
        <span>{spentPercent.toFixed(0)}% used</span>
      </div>
    </GlassCard>
  )
}
