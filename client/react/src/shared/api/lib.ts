import axios, {CreateAxiosDefaults} from "axios";
 
const {VITE_API_URL} = import.meta.env;
if (!VITE_API_URL) console.error('You should add API_URL to .env!');

export const axiosInstance = axios.create({
  baseURL: VITE_API_URL,
  headers: {'content-type': 'application/json'}
} as CreateAxiosDefaults);
 