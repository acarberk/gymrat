import axios from 'axios';

import { apiClient } from '../api-client';

import { type PublicUser, type UpdateProfileInput, type UserProfileOutput } from '@/lib/types';

interface RefreshResponse {
  accessToken: string;
}

interface RegisterInput {
  email: string;
  password: string;
  displayName: string;
  locale?: 'tr' | 'en';
  turnstileToken?: string;
}

interface LoginInput {
  email: string;
  password: string;
  turnstileToken?: string;
}

interface AuthSessionResponse {
  accessToken: string;
  user: PublicUser;
}

// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function refreshSession(): Promise<string | null> {
  try {
    const response = await axios.post<RefreshResponse>(`${API_BASE_URL}/auth/refresh`, undefined, {
      withCredentials: true,
      timeout: 10_000,
    });
    return response.data.accessToken;
  } catch {
    return null;
  }
}

export async function register(input: RegisterInput): Promise<AuthSessionResponse> {
  const response = await apiClient.post<AuthSessionResponse>('/auth/register', input);
  return response.data;
}

export async function login(input: LoginInput): Promise<AuthSessionResponse> {
  const response = await apiClient.post<AuthSessionResponse>('/auth/login', input);
  return response.data;
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } catch {
    // ignore; local state is cleared regardless
  }
}

export async function fetchMe(): Promise<PublicUser | null> {
  try {
    const response = await apiClient.get<PublicUser>('/auth/me');
    return response.data;
  } catch {
    return null;
  }
}

export async function forgotPassword(input: {
  email: string;
  turnstileToken?: string;
}): Promise<void> {
  await apiClient.post('/auth/forgot-password', input);
}

export async function resetPassword(input: { token: string; password: string }): Promise<void> {
  await apiClient.post('/auth/reset-password', input);
}

export async function verifyEmail(token: string): Promise<void> {
  await apiClient.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);
}

export async function resendVerification(input: {
  email: string;
  turnstileToken?: string;
}): Promise<void> {
  await apiClient.post('/auth/resend-verification', input);
}

export async function getProfile(): Promise<UserProfileOutput> {
  const response = await apiClient.get<UserProfileOutput>('/users/me');
  return response.data;
}

export async function updateProfile(input: UpdateProfileInput): Promise<UserProfileOutput> {
  const response = await apiClient.patch<UserProfileOutput>('/users/me', input);
  return response.data;
}
