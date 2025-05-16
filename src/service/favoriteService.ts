import { API_BASE } from '@/service/baseAPI';
import { createClient } from '@/utils/supabase/client';
import { getSessionOrThrow } from '@/utils/auth';

export interface FavoriteStockRequest {
  symbol: string;
}

export interface FavoriteStockResponse {
  name: string;
  code: string;
  marketCap: number;
}

export interface FavoriteStockListResponse {
  responses: FavoriteStockResponse[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

// 즐겨찾기 목록 조회
export async function getFavoriteStocks(
  page = 1,
  size = 20,
  sortBy = 'id',
  order = 'asc'
): Promise<FavoriteStockListResponse> {
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  const token = session.access_token;

  const res = await fetch(
    `${API_BASE}/stocks/favorites?page=${page}&size=${size}&sortBy=${sortBy}&order=${order}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error('즐겨찾기 목록 조회 실패');
  return res.json();
}

// 즐겨찾기 등록
export async function createFavoriteStock(
  request: FavoriteStockRequest
): Promise<void> {
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  const token = session.access_token;

  const res = await fetch(`${API_BASE}/stocks/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ symbol: request.symbol }),
  });

  if (!res.ok) throw new Error('즐겨찾기 등록 실패');
}

// 즐겨찾기 삭제
export async function deleteFavoriteStock(
  request: FavoriteStockRequest
): Promise<void> {
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  const token = session.access_token;

  const res = await fetch(`${API_BASE}/stocks/favorites`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ symbol: request.symbol }),
  });

  if (!res.ok) throw new Error('즐겨찾기 삭제 실패');
}
