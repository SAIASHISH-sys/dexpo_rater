import { useState } from 'react'
import { Building2 } from 'lucide-react'
import GlassCard from '../ui/GlassCard'

type Props = {
  company: string
  onInvest: (amount: number) => void
  isLoading?: boolean
  moneyLeft?: number
}

export default function InvestSlider({ company, onInvest, isLoading = false, moneyLeft = 20000 }: Props) {
  const maxAmount = Math.min(5000, moneyLeft)
  const [amount, setAmount] = useState(Math.min(1200, maxAmount))
  const [showConfirm, setShowConfirm] = useState(false)

  const canInvest = moneyLeft > 0 && !isLoading && !!company && amount <= moneyLeft

  const handleInvest = () => {
    if (!canInvest) return
    setShowConfirm(true)
    onInvest(amount)
    setTimeout(() => setShowConfirm(false), 1800)
  }

  return (
    <GlassCard className="p-4">
      {/* Company badge */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
          <Building2 size={22} />
        </div>
        <div>
          <p className="text-xs text-cyan-200/70">Investing in</p>
          <p className="text-base font-bold text-white">{company}</p>
        </div>
      </div>

      {/* Slider */}
      <div className="mb-1">
        <input
          type="range"
          min={100}
          max={maxAmount}
          step={100}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="range-slider w-full"
        />
      </div>

      <div className="mb-4 flex items-center justify-between text-xs text-cyan-100/60">
        <span>₹100</span>
        <span className="rounded-lg bg-emerald-400/15 px-3 py-1 text-base font-bold text-emerald-300">
          ₹{amount.toLocaleString()}
        </span>
        <span>₹{maxAmount.toLocaleString()}</span>
      </div>

      <button
        onClick={handleInvest}
        disabled={!canInvest || showConfirm}
        className={`w-full rounded-xl py-3 text-sm font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
          showConfirm
            ? 'bg-emerald-500 text-white'
            : 'bg-gradient-to-r from-emerald-400 to-cyan-300 text-slate-900 hover:shadow-lg hover:shadow-emerald-400/20'
        }`}
      >
        {!company ? 'Select a company first' : moneyLeft <= 0 ? 'Budget Exhausted' : isLoading ? 'Processing...' : showConfirm ? '✓ Investment Added!' : 'Invest Now'}
      </button>
    </GlassCard>
  )
}
