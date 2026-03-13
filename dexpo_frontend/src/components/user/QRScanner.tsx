import { useState, useRef, useEffect } from 'react'
import { ScanLine, Camera, X, Type } from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import type { Stall } from '../../services/api'

type Props = {
  onScan: (code: string) => void
  activeCompany: string
  stalls?: Stall[]
}

export default function QRScanner({ onScan, activeCompany, stalls = [] }: Props) {
  const [mode, setMode] = useState<'camera' | 'text'>('camera')
  const [textInput, setTextInput] = useState('')
  const [scanning, setScanning] = useState(false)
  const scanLineRef = useRef<HTMLDivElement>(null)

  // Simulated scan animation
  useEffect(() => {
    if (!scanning) return
    const timer = setTimeout(() => {
      setScanning(false)
      // Use real stalls from database, fallback to defaults if not available
      const companies = stalls.length > 0 
        ? stalls.map(s => s.name)
        : [
            'Neon Robotics',
            'BlueOrbit AI',
            'GreenGrid Energy',
            'CloudForge Labs',
            'AquaNova Systems',
          ]
      const pick = companies[Math.floor(Math.random() * companies.length)]
      onScan(pick)
    }, 2200)
    return () => clearTimeout(timer)
  }, [scanning, onScan, stalls])

  const handleTextScan = () => {
    if (!textInput.trim()) return
    onScan(textInput.trim())
    setTextInput('')
  }

  return (
    <GlassCard className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
          <ScanLine size={20} className="text-emerald-300" />
          QR Scanner
        </h3>
        <div className="flex gap-1 rounded-lg bg-slate-900/50 p-0.5">
          <button
            onClick={() => setMode('camera')}
            className={`rounded-md px-2.5 py-1 text-xs transition ${
              mode === 'camera'
                ? 'bg-emerald-400/90 text-slate-900'
                : 'text-cyan-100'
            }`}
          >
            <Camera size={14} />
          </button>
          <button
            onClick={() => setMode('text')}
            className={`rounded-md px-2.5 py-1 text-xs transition ${
              mode === 'text'
                ? 'bg-emerald-400/90 text-slate-900'
                : 'text-cyan-100'
            }`}
          >
            <Type size={14} />
          </button>
        </div>
      </div>

      {mode === 'camera' ? (
        <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl border-2 border-cyan-300/20 bg-slate-950/80">
          {/* Corner markers */}
          <div className="absolute left-3 top-3 h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-emerald-400" />
          <div className="absolute right-3 top-3 h-6 w-6 rounded-tr-lg border-r-2 border-t-2 border-emerald-400" />
          <div className="absolute bottom-3 left-3 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-emerald-400" />
          <div className="absolute bottom-3 right-3 h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-emerald-400" />

          {/* Scan line animation */}
          {scanning && (
            <div
              ref={scanLineRef}
              className="scan-line absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
            />
          )}

          {/* Center prompt */}
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            {scanning ? (
              <>
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400/30 border-t-emerald-400" />
                <p className="text-xs text-emerald-300">Scanning…</p>
              </>
            ) : (
              <>
                <Camera size={32} className="text-cyan-300/50" />
                <p className="px-8 text-xs text-cyan-100/60">
                  Point camera at a company QR code
                </p>
                <button
                  onClick={() => setScanning(true)}
                  className="mt-2 rounded-lg bg-emerald-400/90 px-5 py-2 text-xs font-semibold text-slate-900 transition hover:bg-emerald-300"
                >
                  Start Scan
                </button>
              </>
            )}
          </div>

          {scanning && (
            <button
              onClick={() => setScanning(false)}
              className="absolute right-2 top-2 rounded-full bg-slate-900/70 p-1 text-cyan-100"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTextScan()}
            placeholder="Enter company code or name…"
            className="flex-1 rounded-lg border border-cyan-100/20 bg-slate-950/40 px-3 py-2.5 text-sm outline-none placeholder:text-cyan-100/40 focus:border-emerald-400/50"
          />
          <button
            onClick={handleTextScan}
            className="rounded-lg bg-cyan-300/90 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-cyan-200"
          >
            Search
          </button>
        </div>
      )}

      {/* Active company badge */}
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-400/10 px-3 py-2">
        <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        <span className="text-sm text-cyan-50">
          Active: <span className="font-semibold text-white">{activeCompany}</span>
        </span>
      </div>
    </GlassCard>
  )
}
