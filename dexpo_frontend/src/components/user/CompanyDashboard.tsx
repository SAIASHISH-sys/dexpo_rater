import { Building2, MapPin, Globe, Users } from 'lucide-react'
import GlassCard from '../ui/GlassCard'

type Props = {
  company: string
}

// Mock company data for the scanned company
const COMPANY_DATA: Record<
  string,
  { desc: string; category: string; location: string; teamSize: string; website: string }
> = {
  'Neon Robotics': {
    desc: 'Building autonomous robots for hazardous industrial environments. Our AI-driven robotics reduce workplace injuries by 60%.',
    category: 'Robotics',
    location: 'Hall A, Booth 12',
    teamSize: '22',
    website: 'neonrobotics.example',
  },
  'BlueOrbit AI': {
    desc: 'Pioneering next-gen AI models for industrial automation. Our autonomous systems reduce energy waste by 40%.',
    category: 'AI + Automation',
    location: 'Hall B, Booth 27',
    teamSize: '14',
    website: 'blueorbit.example',
  },
  'GreenGrid Energy': {
    desc: 'Smart micro-grid solutions for urban sustainability. Renewable energy management with real-time load balancing.',
    category: 'CleanTech',
    location: 'Hall C, Booth 05',
    teamSize: '18',
    website: 'greengrid.example',
  },
  'CloudForge Labs': {
    desc: 'Edge-computing infrastructure for IoT devices. Processing data closer to the source with minimal latency.',
    category: 'Cloud / IoT',
    location: 'Hall A, Booth 31',
    teamSize: '11',
    website: 'cloudforge.example',
  },
  'AquaNova Systems': {
    desc: 'Advanced water purification using nano-filtration membranes. Making clean water accessible and affordable.',
    category: 'WaterTech',
    location: 'Hall D, Booth 08',
    teamSize: '9',
    website: 'aquanova.example',
  },
}

const FALLBACK = {
  desc: 'An innovative company showcasing at Delta Expo.',
  category: 'Technology',
  location: 'Main Hall',
  teamSize: '—',
  website: 'deltaexpo.example',
}

export default function CompanyDashboard({ company }: Props) {
  const data = COMPANY_DATA[company] ?? FALLBACK

  return (
    <GlassCard className="p-4">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 text-xl">
          <Building2 size={24} className="text-emerald-300" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{company}</h3>
          <span className="rounded-md bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-cyan-300">
            {data.category}
          </span>
        </div>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-cyan-50/80">
        {data.desc}
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
