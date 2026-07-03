export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

interface ApiResponse<T> {
  data: T | null;
  error?: string;
  status?: number;
}

// Helper for GET requests with auth token
async function get<T>(path: string, token?: string): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const json = await res.json();
    if (!res.ok) return { data: null, error: json.detail ?? res.statusText, status: res.status };
    return { data: json, status: res.status };
  } catch {
    return { data: null, error: 'Network error', status: 0 };
  }
}

// Helper for POST requests with auth token (or without)
async function post<T>(path: string, body: unknown, token?: string): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) return { data: null, error: json.detail ?? res.statusText, status: res.status };
    return { data: json, status: res.status };
  } catch {
    return { data: null, error: 'Network error', status: 0 };
  }
}

interface LoginResponse {
  status: string;
  registered: boolean;
  token?: string;
  vendor?: {
    id: number;
    name: string;
  };
}

export interface VendorProfile {
  id: number;
  vendor_name: string;
  business_name: string;
  category: string;
  address: string;
  phone: string;
  status: string;
  preferred_language: string;
}

interface RegisterVendorResponse {
  status: string;
  token: string;
  vendor: {
    id: number;
    name: string;
  };
}

// Auth APIs
export const login = async (phone: string) => {
  return post<LoginResponse>('/api/auth/login', { phone });
};

export const registerVendor = async (payload: Record<string, unknown>) => {
  return post<RegisterVendorResponse>('/api/auth/register', payload);
};

export const adminLogin = async (phone: string, pin: string) => {
  return post<{ status: string; role: string; token: string }>('/api/auth/admin/login', { phone, password: pin });
};

export const getCurrentVendor = async (token: string) => {
  return get<VendorProfile>('/api/auth/me', token);
};

export const getAdminVendors = async (token: string) => {
  return get<Record<string, unknown>[]>('/api/auth/admin/vendors', token);
};

export const getAdminStats = async (token: string) => {
  return get<Record<string, unknown>>('/api/auth/admin/stats', token);
};

export const getAdminVendorDetails = async (token: string, vendorId: number) => {
  return get<Record<string, unknown>>(`/api/auth/admin/vendors/${vendorId}/details`, token);
};

// Transaction APIs
export const getTransactions = async (
  token: string,
  params: Record<string, string> = {},
) => {
  const query = new URLSearchParams(params).toString();
  return get(`/api/transactions?${query}`, token);
};

export const createTransaction = async (token: string, payload: Record<string, unknown>) => {
  return post('/api/transactions', payload, token);
};

export const processVoiceTransaction = async (token: string, audioBlob: Blob) => {
  const formData = new FormData();
  const extension = audioBlob.type.includes('mp4') ? 'mp4' : 'webm';
  formData.append('audio', audioBlob, `recording.${extension}`);

  try {
    const res = await fetch(`${API_BASE_URL}/api/voice/transact`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const json = await res.json();
    if (!res.ok) return { data: null, error: json.detail ?? res.statusText, status: res.status };
    return { data: json, status: res.status };
  } catch {
    return { data: null, error: 'Network error', status: 0 };
  }
};

export const transcribeVoice = async (token: string, audioBlob: Blob) => {
  const formData = new FormData();
  const extension = audioBlob.type.includes('mp4') ? 'mp4' : 'webm';
  formData.append('audio', audioBlob, `recording.${extension}`);

  try {
    const res = await fetch(`${API_BASE_URL}/api/voice/transcribe`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const json = await res.json();
    if (!res.ok) return { data: null, error: json.detail ?? res.statusText, status: res.status };
    return { data: json, status: res.status };
  } catch {
    return { data: null, error: 'Network error', status: 0 };
  }
};

export const extractVoiceTransaction = async (token: string, transcript: string) => {
  return post('/api/voice/extract', { transcript }, token);
};

// Credit and loan
// NOTE: backend groups credit/loan endpoints under /api/assessment
export const getCreditScore = async (token: string) => {
  return get('/api/assessment/score', token);
};

export const getLoanEligibility = async (token: string) => {
  return get('/api/assessment/loan-eligibility', token);
};

export const getInsights = async (token: string) => {
  return get('/api/insights', token);
};

// Products APIs
export const getProducts = async (token: string) => {
  return get('/api/products/', token);
};

export const createProduct = async (token: string, payload: Record<string, unknown>) => {
  return post('/api/products/', payload, token);
};

export const applyProductTemplate = async (token: string, templateName: string) => {
  return post(`/api/products/template/${encodeURIComponent(templateName)}`, {}, token);
};
