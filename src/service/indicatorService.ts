// src/service/indicatorService.ts

import { createClient } from '@/utils/supabase/client';
import { getSessionOrThrow } from '@/utils/auth';

export interface IndicatorResponse {
  id: number;
  name: string;
  korName: string;
  country: string;
  date: string;
  actual: number | null;
  previous: number | null;
  estimate: number | null;
  impact: string;
  isFavorite: boolean;
}

export interface IndicatorListResponse {
  indicatorResponses: IndicatorResponse[];
  totalCount: number;
}

/**
 * 경제지표 목록 조회
 * GET /indicators?page={page}&size={size}&order={order}
 */
export async function fetchIndicators(
  page: number = 1,
  size: number = 10,
  order: 'asc' | 'desc' = 'asc'
): Promise<IndicatorListResponse> {
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  const token = session.access_token;

  const url = `http://localhost:8080/indicators?page=${page}&size=${size}&order=${order}`;
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch indicators: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as IndicatorListResponse;
}

/**
 * 즐겨찾기 등록
 * POST /indicators/favorites
 * body: { indicatorId: number }
 */
export async function createFavoriteIndicator(
  indicatorId: number
): Promise<void> {
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  const token = session.access_token;

  const res = await fetch(
    'http://localhost:8080/indicators/favorites',
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ indicatorId }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`즐겨찾기 등록 실패: ${res.status} ${text}`);
  }
}

/**
 * 즐겨찾기 해제
 * DELETE /indicators/favorites/{indicatorId}
 */
export async function deleteFavoriteIndicator(
  indicatorId: number
): Promise<void> {
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  const token = session.access_token;

  const res = await fetch(
    `http://localhost:8080/indicators/favorites/${indicatorId}`,
    {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`즐겨찾기 해제 실패: ${res.status} ${text}`);
  }
}
