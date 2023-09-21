import { LeadResponse } from '../types';
import { axiosInstance } from './lib.ts';

const leads = {
  getAll: () => axiosInstance.get<LeadResponse>('/leads'),
  getFiltered: () => axiosInstance.get<LeadResponse>('/leads'),
};

export const api = {
  leads,
};
