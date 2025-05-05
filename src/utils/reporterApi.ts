// src/utils/reporterApi.ts
import { SupabaseClient } from '@supabase/supabase-js';

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// 내 기자 신청 상태를 조회합니다.

export async function fetchMyApplicationStatus(
  supabase: SupabaseClient,
  apiBase: string
): Promise<ApplicationStatus | null> {
  const {
    data: { session },
    error: sessErr,
  } = await supabase.auth.getSession();
  if (sessErr || !session) return null;

  const res = await fetch(`${apiBase}/reporter-applications/me`, {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if (!res.ok) return null;

  const { status } = await res.json();
  return status as ApplicationStatus;
}

// 기자 신청을 합니다.
// 성공 시 'PENDING' 상태를 반환합니다.

export async function applyForReporter(
  supabase: SupabaseClient,
  apiBase: string
): Promise<ApplicationStatus> {
  const {
    data: { session },
    error: sessErr,
  } = await supabase.auth.getSession();
  if (sessErr || !session) throw new Error('로그인이 필요합니다.');

  const res = await fetch(`${apiBase}/reporter-applications`, {
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
