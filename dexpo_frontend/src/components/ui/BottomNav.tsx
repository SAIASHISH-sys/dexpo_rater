import type { ReactNode } from 'react'

type NavItem = {
  label: string
  icon: ReactNode
  active: boolean
  onClick: () => void
}

type Props = {
  items: NavItem[]
}

export default function BottomNav({ items }: Props) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3">
      <div className="mx-auto w-full max-w-4xl">
        <div
          className={`grid gap-1 glass-panel p-1`}
          style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
        >
          {items.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`flex flex-col items-center gap-0.5 rounded-lg py-2 text-xs font-semibold transition-all duration-200 ${
                item.active
                  ? 'bg-emerald-400 text-slate-900 shadow-lg shadow-emerald-400/20'
                  : 'bg-slate-900/40 text-cyan-50 hover:bg-slate-800/60'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </footer>
  )
}
