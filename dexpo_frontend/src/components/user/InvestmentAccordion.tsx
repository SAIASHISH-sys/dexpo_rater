import { useState } from 'react'
import { ChevronDown, Trash2, Plus, Minus, Briefcase } from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import type { Investment } from '../../types'

type Props = {
  investments: Investment[]
  onUpdate: (id: number, amount: number) => void
  onRemove: (id: number) => void
}

export default function InvestmentAccordion({
  investments,
  onUpdate,
  onRemove,
}: Props) {
  const [openId, setOpenId] = useState<number | null>(null)

  const toggle = (id: number) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <GlassCard className="p-4">
      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
        <Briefcase size={18} className="text-cyan-300" />
        Invested Companies
        <span className="ml-auto rounded-full bg-emerald-400/15 px-2 py-0.5 text-xs font-medium text-emerald-300">
          {investments.length}
        </span>
      </h3>

      {investments.length === 0 ? (
        <p className="py-6 text-center text-sm text-cyan-100/50">
          No investments yet. Scan a company and invest!
        </p>
      ) : (
        <div className="space-y-2">
          {investments.map((item) => {
            const isOpen = openId === item.id
            return (
              <div
                key={item.id}
                className={`overflow-hidden rounded-xl border transition-all duration-300 ${
                  isOpen
                    ? 'border-emerald-400/30 bg-slate-900/50'
                    : 'border-cyan-100/10 bg-slate-900/25'
                }`}
              >
                {/* Header */}
                <button
                  onClick={() => toggle(item.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 text-xs font-bold text-cyan-200">
                    {item.company
                      .split(' ')
                      .map((w) => w[0])
                      .join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {item.company}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-300">
                    ₹{item.amount.toLocaleString()}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-cyan-300 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Expanded body */}
                {isOpen && (
                  <div className="animate-slideDown border-t border-cyan-100/10 px-4 pb-3 pt-3">
                    <div className="mb-3 flex items-center gap-2">
                      <button
                        onClick={() => onUpdate(item.id, item.amount - 100)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-cyan-100 transition hover:bg-slate-700"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="min-w-[80px] rounded-lg bg-slate-950/50 px-3 py-1.5 text-center text-sm font-semibold text-white">
                        ₹{item.amount.toLocaleString()}
                      </span>
                      <button
                        onClick={() => onUpdate(item.id, item.amount + 100)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-cyan-100 transition hover:bg-slate-700"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/30"
                    >
                      <Trash2 size={12} />
                      Remove Investment
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </GlassCard>
  )
}
