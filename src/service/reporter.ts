// src/service/reportApi.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { getSessionOrThrow } from '@/utils/auth';
import { API_BASE } from './baseAPI';

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// 내 기자 신청 상태 조회
export async function fetchMyApplicationStatus(
  supabase: SupabaseClient
): Promise<ApplicationStatus | null> {
  const session = await getSessionOrThrow(supabase);
  const res = await fetch(`${API_BASE}/reporter-applications/me`, {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if (!res.ok) return null;
  const { status } = await res.json();
  return status as ApplicationStatus;
}

// 기자 신청
export async function applyForReporter(
  supabase: SupabaseClient
): Promise<ApplicationStatus> {
  const session = await getSessionOrThrow(supabase);
  const res = await fetch(`${API_BASE}/reporter-applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || res.statusText);
  }
  return 'PENDING';
}
