import { LeadResponse } from '../types';
import { axiosInstance } from './lib.ts';

const leads = {
  getAll: () => axiosInstance.get<LeadResponse>('/leads'),
  getFiltered: (query: string) =>
    axiosInstance.get<LeadResponse>(`/leads?query=${query}`),
};

export const api = {
  leads,
};
