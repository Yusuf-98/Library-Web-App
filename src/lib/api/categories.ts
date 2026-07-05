import api from '@/lib/axios';
import type { Category } from '@/types';

export const getCategories = () =>
  api.get<{ categories: Category[] }>('/categories').then((r) => r.data.categories);
