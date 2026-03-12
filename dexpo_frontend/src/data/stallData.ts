// Stall data mapping
// In production, this data would come from the backend

export type StallData = {
  stall_id: string
  name: string
  organisations?: string
  about?: string
  category: string
  location: string
  teamSize: string
  website: string
}

// Mock stall data with IDs
export const STALL_DATA_MAP: Record<string, StallData> = {
  'stall-001': {
    stall_id: 'stall-001',
    name: 'Neon Robotics',
    organisations: 'Neon Robotics Inc.',
    about: 'Building autonomous robots for hazardous industrial environments. Our AI-driven robotics reduce workplace injuries by 60%.',
    category: 'Robotics',
    location: 'Hall A, Booth 12',
    teamSize: '22',
    website: 'neonrobotics.example',
  },
  'stall-002': {
    stall_id: 'stall-002',
    name: 'BlueOrbit AI',
    organisations: 'BlueOrbit AI Ltd.',
    about: 'Pioneering next-gen AI models for industrial automation. Our autonomous systems reduce energy waste by 40%.',
    category: 'AI + Automation',
    location: 'Hall B, Booth 27',
    teamSize: '14',
    website: 'blueorbit.example',
  },
  'stall-003': {
    stall_id: 'stall-003',
    name: 'GreenGrid Energy',
    organisations: 'GreenGrid Energy Solutions',
    about: 'Smart micro-grid solutions for urban sustainability. Renewable energy management with real-time load balancing.',
    category: 'CleanTech',
    location: 'Hall C, Booth 05',
    teamSize: '18',
    website: 'greengrid.example',
  },
  'stall-004': {
    stall_id: 'stall-004',
    name: 'CloudForge Labs',
    organisations: 'CloudForge Labs Inc.',
    about: 'Edge-computing infrastructure for IoT devices. Processing data closer to the source with minimal latency.',
    category: 'Cloud / IoT',
    location: 'Hall A, Booth 31',
    teamSize: '11',
    website: 'cloudforge.example',
  },
  'stall-005': {
    stall_id: 'stall-005',
    name: 'AquaNova Systems',
    organisations: 'AquaNova Systems Ltd.',
    about: 'Advanced water purification using nano-filtration membranes. Making clean water accessible and affordable.',
    category: 'WaterTech',
    location: 'Hall D, Booth 08',
    teamSize: '9',
    website: 'aquanova.example',
  },
}

// Helper to get stall by ID
export function getStallById(stallId: string): StallData | null {
  return STALL_DATA_MAP[stallId] || null
}

// Helper to get stall by name (for backward compatibility with QR scanner)
export function getStallByName(name: string): StallData | null {
  return Object.values(STALL_DATA_MAP).find(
    stall => stall.name === name || stall.organisations === name
  ) || null
}

// Get all stall IDs
export function getAllStallIds(): string[] {
  return Object.keys(STALL_DATA_MAP)
}

// Get all stall names
export function getAllStallNames(): string[] {
  return Object.values(STALL_DATA_MAP).map(stall => stall.name)
}
