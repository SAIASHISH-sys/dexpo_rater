import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function GlassCard({ children, className = '', hover = false }: Props) {
  return (
    <div
      className={`glass-panel ${hover ? 'glass-hover' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
