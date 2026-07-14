import axios from 'axios';
import { store } from '@/app/store';
import { logout } from '@/features/auth/authSlice';

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    const envelope = response.data as ApiEnvelope<unknown>;
    if (envelope && typeof envelope === 'object' && 'success' in envelope) {
      if (!envelope.success) {
        return Promise.reject(new Error(envelope.message || 'Request failed'));
      }
      response.data = envelope.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    const message = error.response?.data?.message;
    return Promise.reject(message ? new Error(message) : error);
  },
);

export default api;
