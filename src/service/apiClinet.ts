// apiClient.ts
import axios from 'axios';
import { createClient } from '@/utils/supabase/client';
import { getSessionOrThrow } from '@/utils/auth';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
});

apiClient.interceptors.request.use(async (config) => {
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  config.headers['Authorization'] = `Bearer ${session.access_token}`;
  config.headers['Content-Type'] = 'application/json';
  return config;
});

export default apiClient;
