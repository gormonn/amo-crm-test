import axios from 'axios'
import { LeadResponse } from '../types';

const leads = {
  getAll: () => axios.get<LeadResponse>('/leads')
}

export const api = {
  leads
}
