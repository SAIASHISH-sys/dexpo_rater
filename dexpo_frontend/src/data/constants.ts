import type { LeaderboardEntry, StallInfo } from '../types'
import { getAllStallNames } from './stallData'

export const TOTAL_BUDGET = 20000

// Get stall names from stallData
export const COMPANIES = getAllStallNames()

export const STALL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'GreenGrid Energy', investment: 18400 },
  { rank: 2, name: 'BlueOrbit AI', investment: 17250 },
  { rank: 3, name: 'Neon Robotics', investment: 15300 },
  { rank: 4, name: 'CloudForge Labs', investment: 12180 },
  { rank: 5, name: 'AquaNova Systems', investment: 10890 },
  { rank: 6, name: 'QuantumLeap Tech', investment: 9420 },
  { rank: 7, name: 'SolarNest Innovations', investment: 7100 },
  { rank: 8, name: 'CyberWave Labs', investment: 5670 },
]

export const DEFAULT_STALL_INFO: StallInfo = {
  companyName: 'BlueOrbit AI',
  category: 'AI + Automation',
  website: 'https://blueorbit.example',
  contactEmail: 'contact@blueorbit.example',
  location: 'Hall B, Booth 27',
  teamSize: '14',
  description:
    'Pioneering next-generation AI models for industrial automation. Our autonomous systems help reduce energy waste by 40% while improving throughput across manufacturing pipelines.',
  logo: '🤖',
}
