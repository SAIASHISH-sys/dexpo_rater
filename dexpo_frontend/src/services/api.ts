// API Service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

// Helper function to remove auth token
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('userRole');
};

// Helper function to make API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============ Auth APIs ============
export type LoginResponse = {
  token: string;
  u_id: string;
  message?: string;
  user?: any;
};

export const authAPI = {
  userLogin: (email_id: string, password: string) =>
    apiRequest<LoginResponse>('/auth/users/login', {
      method: 'POST',
      body: JSON.stringify({ email_id, password }),
    }),

  stallLogin: (email_id: string, password: string) =>
    apiRequest<LoginResponse>('/auth/stalls/login', {
      method: 'POST',
      body: JSON.stringify({ email_id, password }),
    }),
};

// ============ Investment APIs ============
export type Investment = {
  investment_id: string;
  user_id: string;
  stall_id: string;
  amount_invested: number;
  created_at: string;
};

export type InvestmentWithStall = Investment & {
  stalls: {
    stall_id: string;
    name: string;
    email_id: string;
    organisations?: string;
    about?: string;
  };
};

export type UserPortfolio = {
  u_id: string;
  email_id: string;
  investments: InvestmentWithStall[];
};

export const investmentAPI = {
  createInvestment: (stall_id: string, amount_invested: number) =>
    apiRequest<Investment>('/investments/users/invest', {
      method: 'POST',
      body: JSON.stringify({ stall_id, amount_invested }),
    }),

  getUserPortfolio: () =>
    apiRequest<UserPortfolio>('/investments/users/myportfolio', {
      method: 'GET',
    }),

  deleteInvestment: (investment_id: string) =>
    apiRequest<{ message: string }>(`/investments/users/${investment_id}`, {
      method: 'DELETE',
    }),
};

// ============ Stall APIs ============
export type Stall = {
  stall_id: string;
  name: string;
  email_id: string;
  organisations?: string;
  about?: string;
  google_oauth?: string;
  password?: string;
};

export const stallAPI = {
  getAllStalls: () =>
    apiRequest<Stall[]>('/stalls/stalls', {
      method: 'GET',
    }),

  getStallById: (stall_id: string) =>
    apiRequest<Stall>(`/stalls/stalls/${stall_id}`, {
      method: 'GET',
    }),

  updateStallData: (data: { name?: string; organisations?: string; about?: string }) =>
    apiRequest<Stall>('/stalls/stalls/update-data', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
