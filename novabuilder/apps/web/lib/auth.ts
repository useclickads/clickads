export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const AUTH_BASE = `${API_URL}/api/auth`;

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${AUTH_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const payload = await res.json();
  if (!res.ok || payload.error) {
    throw new Error(payload.error || payload.message || 'Request failed');
  }

  return payload as T;
}

export async function signup(email: string, password: string, name?: string) {
  return postJson<AuthResponse>('/signup', { email, password, name });
}

export async function login(email: string, password: string) {
  return postJson<AuthResponse>('/login', { email, password });
}

export async function requestMagicLink(email: string) {
  return postJson<{ ok: boolean; message: string; token: string }>('/magic-link', { email });
}

export async function verifyMagicLink(token: string) {
  return postJson<AuthResponse>('/magic-link/verify', { token });
}

export async function refreshTokens(refreshToken: string) {
  return postJson<{ accessToken: string; refreshToken: string }>('/refresh', { refreshToken });
}

export async function logout(refreshToken: string) {
  return postJson<{ ok: boolean }>('/logout', { refreshToken });
}

export async function forgotPassword(email: string) {
  return postJson<{ ok: boolean; message: string; token?: string }>('/forgot-password', { email });
}

export async function resetPassword(token: string, password: string) {
  return postJson<{ ok: boolean; message: string }>('/reset-password', { token, password });
}

export async function fetchAuthenticated(
  path: string,
  accessToken: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
}
