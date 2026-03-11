import { LogOut } from 'lucide-react'

type Props = {
  tag: string
  title: string
  onLogout: () => void
}

export default function Header({ tag, title, onLogout }: Props) {
  return (
    <header className="glass-panel flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
          <span className="text-lg font-black">Δ</span>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.25em] text-cyan-200/90">
            {tag}
          </p>
          <h2 className="text-lg font-bold leading-tight text-white md:text-xl">
            {title}
          </h2>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="flex items-center gap-1.5 rounded-lg bg-slate-900/60 px-3 py-2 text-xs font-medium text-cyan-100 transition hover:bg-slate-800/80"
      >
        <LogOut size={14} />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </header>
  )
}
