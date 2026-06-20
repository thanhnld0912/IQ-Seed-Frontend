const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string | null;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Lỗi server');
  return data as T;
}

async function get<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Lỗi server');
  return data as T;
}

export const authApi = {
  login: (email: string, password: string) =>
    post<AuthResponse>('/api/auth/login', { email, password }),

  register: (email: string, password: string, displayName?: string) =>
    post<AuthResponse>('/api/auth/register', { email, password, displayName }),

  me: (token: string) =>
    get<{ user: AuthUser }>('/api/auth/me', token),

  listUsers: (token: string) =>
    get<{ users: (AuthUser & { createdAt: string | null })[] }>('/api/users', token),
};
