// File: src/service/reporterApplicationsService.ts
import { createClient } from '@/utils/supabase/client';
import { API_BASE } from '@/service/baseAPI';

export async function fetchReporterApplications() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return [];
  const res = await fetch(`${API_BASE}/reporter-applications`, {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch reporter applications');
  }
  return res.json();
}

export async function patchReporterApplications(
  ids: number[],
  action: 'APPROVED' | 'REJECTED'
) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return;
  const res = await fetch(`${API_BASE}/reporter-applications`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ ids, action }),
  });
  if (!res.ok) {
    throw new Error('Failed to process reporter applications');
  }
}
