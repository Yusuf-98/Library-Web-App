import api from '@/lib/axios';
import type { LoginResponse, User } from '@/types';

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export const loginApi = (email: string, password: string) =>
  api.post<LoginResponse>('/auth/login', { email, password }).then((r) => r.data);

export const registerApi = (payload: RegisterPayload) =>
  api.post<User>('/auth/register', payload).then((r) => r.data);
