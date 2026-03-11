export type LoginRole = 'user' | 'stall'

export type Investment = {
  id: number
  company: string
  amount: number
}

export type LeaderboardEntry = {
  rank: number
  name: string
  investment: number
}

export type UserProfile = {
  email: string
  name: string
  mobile: string
  city: string
  college: string
  interests: string
}

export type StallInfo = {
  companyName: string
  category: string
  website: string
  contactEmail: string
  location: string
  teamSize: string
  description: string
  logo: string
}
