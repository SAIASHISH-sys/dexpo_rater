import { useState, useRef, useEffect } from 'react'
import { ScanLine, Camera, X, Type, AlertCircle } from 'lucide-react'
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode'
import GlassCard from '../ui/GlassCard'
import { QR_SCANNER_CONFIG } from '../../config/qrConfig'
import type { Stall } from '../../services/api'

type Props = {
  onScan: (code: string) => void
  activeCompany: string
  stalls?: Stall[]
}

interface QrCodeScanResult {
  decodedText: string
}

export default function QRScanner({ onScan, activeCompany, stalls = [] }: Props) {
  const [mode, setMode] = useState<'camera' | 'text'>('camera')
  const [textInput, setTextInput] = useState('')
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cameraSupported, setCameraSupported] = useState(true)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const containerIdRef = useRef('qr-scanner-container')

  // Initialize QR Scanner
  useEffect(() => {
    if (mode !== 'camera' || !scanning) {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {})
        scannerRef.current = null
      }
      return
    }

    // Check camera support
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraSupported(false)
      setError('Camera access not supported on this device')
      return
    }

    try {
      const scanner = new Html5QrcodeScanner(
        containerIdRef.current,
        QR_SCANNER_CONFIG as any,
        false
      )

      const onScanSuccess = (decodedText: string) => {
        // Try to match stall name from QR code data
        const matchedStall = stalls.find(
          (s) =>
            s.name.toLowerCase() === decodedText.toLowerCase() ||
            s.stall_id === decodedText
        )
        
        if (matchedStall) {
          onScan(matchedStall.name)
          setScanning(false)
        } else {
          // Also try direct match if it's just a name
          onScan(decodedText)
          setScanning(false)
        }
      }

      const onScanError = () => {
        // Silently handle errors - scanner will keep trying
      }

      scanner.render(onScanSuccess, onScanError)
      scannerRef.current = scanner
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to initialize camera')
      setCameraSupported(false)
      setScanning(false)
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {})
        scannerRef.current = null
      }
    }
  }, [scanning, mode, onScan, stalls])

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
            onClick={() => {
              setMode('camera')
              setError(null)
            }}
            className={`rounded-md px-2.5 py-1 text-xs transition ${
              mode === 'camera'
                ? 'bg-emerald-400/90 text-slate-900'
                : 'text-cyan-100'
            }`}
            disabled={!cameraSupported}
          >
            <Camera size={14} />
          </button>
          <button
            onClick={() => {
              setMode('text')
              setScanning(false)
              setError(null)
            }}
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

      {/* Error message */}
      {error && (
        <div className="mb-3 flex items-start gap-2 rounded-lg bg-red-500/20 px-3 py-2 text-xs text-red-300">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {mode === 'camera' ? (
        <div className="space-y-3">
          {cameraSupported ? (
            <>
              {/* QR Scanner Container */}
              <div
                id={containerIdRef.current}
                className="mx-auto w-full max-w-xs rounded-2xl overflow-hidden"
              />

              {/* Controls */}
              {scanning ? (
                <button
                  onClick={() => setScanning(false)}
                  className="w-full rounded-lg bg-red-500/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  Stop Scanning
                </button>
              ) : (
                <button
                  onClick={() => setScanning(true)}
                  className="w-full rounded-lg bg-emerald-400/90 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300"
                >
                  Start Scan
                </button>
              )}

              <p className="text-center text-xs text-cyan-100/60">
                Point camera at stall QR code
              </p>
            </>
          ) : (
            <div className="rounded-lg bg-slate-900/40 px-4 py-6 text-center">
              <Camera size={32} className="mx-auto mb-2 text-cyan-300/50" />
              <p className="text-sm text-cyan-100/60">
                Camera not available. Use manual entry instead.
              </p>
            </div>
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
