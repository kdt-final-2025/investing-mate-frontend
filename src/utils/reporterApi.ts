// src/utils/reporterApi.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { getSessionOrThrow } from '@/utils/auth';

// 내 기자 신청 상태를 조회합니다.
export async function fetchMyApplicationStatus(
  supabase: SupabaseClient,
  apiBase: string
): Promise<'PENDING' | 'APPROVED' | 'REJECTED' | null> {
  try {
    const session = await getSessionOrThrow(supabase);
    const res = await fetch(`${apiBase}/reporter-applications/me`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (!res.ok) return null;
    const { status } = await res.json();
    return status;
  } catch {
    return null;
  }
}

// 기자 신청을 합니다.
// 성공 시 'PENDING' 상태를 반환합니다.
export async function applyForReporter(
  supabase: SupabaseClient,
  apiBase: string
): Promise<'PENDING'> {
  // getSessionOrThrow 이 실패하면 에러가 throw 됩니다
  const session = await getSessionOrThrow(supabase);
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
