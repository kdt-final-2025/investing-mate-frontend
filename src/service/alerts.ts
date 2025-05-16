// src/service/alerts.ts
import { API_BASE } from '@/service/baseAPI'
import { createClient } from '@/utils/supabase/client'
import { getSessionOrThrow } from '@/utils/auth'

export interface StockAlertRequest {
  targetPrice: number
  symbol: string
  above: boolean
}

export interface StockAlertResponse {
  stockAlertId: number
  stockSymbol: string
  userId: string
  targetPrice: number
  above: boolean
}

export interface StockAlertDetail {
  id: number
  targetPrice: number
  symbol: string
  above: boolean
}

export interface StockAlertListResponse {
  responses: StockAlertDetail[]
}

export interface DeleteStockAlertRequest {
  stockSymbol: string
  targetPrice: number
}

// 1) 알림 생성
export async function createAlert(
  request: StockAlertRequest
): Promise<StockAlertResponse> {
  const supabase = createClient()
  const session = await getSessionOrThrow(supabase)
  const token = session.access_token

  const res = await fetch(`${API_BASE}/alerts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
    cache: 'no-store',
  })

  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.message ?? '알림 생성에 실패했습니다.')
  }
  return res.json()
}

// 2) 알림 리스트 조회
export async function fetchAlerts(): Promise<StockAlertDetail[]> {
  const supabase = createClient()
  const session = await getSessionOrThrow(supabase)
  const token = session.access_token

  const res = await fetch(`${API_BASE}/alerts`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('알림 리스트를 불러오는데 실패했습니다.')
  }

  const data: StockAlertListResponse = await res.json()
  return data.responses
}

// 3) 알림 삭제
export async function deleteAlert(
  request: DeleteStockAlertRequest
): Promise<void> {
  const supabase = createClient()
  const session = await getSessionOrThrow(supabase)
  const token = session.access_token

  const res = await fetch(`${API_BASE}/alerts`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    throw new Error('알림 삭제에 실패했습니다.')
  }
}

// 4) 알림 상세 조회
export async function fetchAlertDetail(
  alertId: number
): Promise<StockAlertDetail> {
  const supabase = createClient()
  const session = await getSessionOrThrow(supabase)
  const token = session.access_token

  const res = await fetch(`${API_BASE}/alerts/${alertId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('알림 상세를 불러오는 데 실패했습니다.')
  }

  return res.json()
}
