// src/types/stockAlert.ts
import { createClient } from '@/utils/supabase/client';
import { getSessionOrThrow } from '@/utils/auth';
import { StockAlertRequest, StockAlertResponse } from '@/types/stockAlert';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

// 게시물 생성 → 알림 생성
export async function createStockAlert(
  request: StockAlertRequest
): Promise<StockAlertResponse> {
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  const token = session.access_token;

  const res = await fetch(`${API_BASE}/alerts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('알림 생성에 실패했습니다.');
  }

  return res.json();
}
