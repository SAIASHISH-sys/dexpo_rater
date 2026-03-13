import { useState } from 'react'
import { ChevronDown, Briefcase } from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import type { Investment } from '../../types'

type Props = {
  investments: Investment[]
}

// Group investments by company and sum amounts
const consolidateInvestments = (investments: Investment[]) => {
  const grouped = new Map<string, { investment: Investment; totalAmount: number; count: number }>()
  
  investments.forEach((inv) => {
    const existing = grouped.get(inv.company)
    if (existing) {
      existing.totalAmount += inv.amount
      existing.count += 1
    } else {
      grouped.set(inv.company, {
        investment: inv,
        totalAmount: inv.amount,
        count: 1,
      })
    }
  })
  
  return Array.from(grouped.values())
}

export default function InvestmentAccordion({
  investments,
}: Props) {
  const [openId, setOpenId] = useState<string | null>(null)
  
  const consolidatedInvestments = consolidateInvestments(investments)

  const toggle = (company: string) => setOpenId((prev) => (prev === company ? null : company))

  return (
    <GlassCard className="p-4">
      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
        <Briefcase size={18} className="text-cyan-300" />
        Invested Companies
        <span className="ml-auto rounded-full bg-emerald-400/15 px-2 py-0.5 text-xs font-medium text-emerald-300">
          {consolidatedInvestments.length}
        </span>
      </h3>

      {investments.length === 0 ? (
        <p className="py-6 text-center text-sm text-cyan-100/50">
          No investments yet. Scan a company and invest!
        </p>
      ) : (
        <div className="space-y-2">
          {consolidatedInvestments.map(({ investment, totalAmount, count }) => {
            const isOpen = openId === investment.company
            return (
              <div
                key={investment.company}
                className={`overflow-hidden rounded-xl border transition-all duration-300 ${
                  isOpen
                    ? 'border-emerald-400/30 bg-slate-900/50'
                    : 'border-cyan-100/10 bg-slate-900/25'
                }`}
              >
                {/* Header */}
                <button
                  onClick={() => toggle(investment.company)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 text-xs font-bold text-cyan-200">
                    {investment.company
                      .split(' ')
                      .map((w) => w[0])
                      .join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {investment.company}
                    </p>
                    {count > 1 && (
                      <p className="text-xs text-cyan-100/50">{count} investments</p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-emerald-300">
                    ₹{totalAmount.toLocaleString()}
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
                    <div className="mb-2 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-slate-950/50 px-2 py-1.5">
                        <p className="text-cyan-100/60">Total Amount</p>
                        <p className="font-semibold text-emerald-300">₹{totalAmount.toLocaleString()}</p>
                      </div>
                      {count > 1 && (
                        <div className="rounded-lg bg-slate-950/50 px-2 py-1.5">
                          <p className="text-cyan-100/60">Transactions</p>
                          <p className="font-semibold text-cyan-300">{count}x</p>
                        </div>
                      )}
                    </div>
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
