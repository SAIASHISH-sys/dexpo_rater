import { Building2, MapPin, Globe, Users } from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import { getStallByName } from '../../data/stallData'

type Props = {
  company: string
}

export default function CompanyDashboard({ company }: Props) {
  const stallData = getStallByName(company)
  
  const data = stallData || {
    name: company,
    about: 'An innovative company showcasing at Delta Expo.',
    category: 'Technology',
    location: 'Main Hall',
    teamSize: '—',
    website: 'deltaexpo.example',
  }

  return (
    <GlassCard className="p-4">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 text-xl">
          <Building2 size={24} className="text-emerald-300" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{data.name}</h3>
          <span className="rounded-md bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-cyan-300">
            {data.category}
          </span>
        </div>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-cyan-50/80">
        {data.about}
      </p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <div className="flex items-center gap-2 rounded-lg bg-slate-950/30 px-3 py-2">
          <MapPin size={14} className="text-emerald-300" />
          <span className="text-xs text-cyan-100">{data.location}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-slate-950/30 px-3 py-2">
          <Users size={14} className="text-emerald-300" />
          <span className="text-xs text-cyan-100">{data.teamSize} members</span>
        </div>
        <div className="col-span-2 flex items-center gap-2 rounded-lg bg-slate-950/30 px-3 py-2 sm:col-span-1">
          <Globe size={14} className="text-emerald-300" />
          <span className="truncate text-xs text-cyan-100">{data.website}</span>
        </div>
      </div>
    </GlassCard>
  )
}
