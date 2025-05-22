// src/service/chatService.ts
import { API_BASE } from '@/service/baseAPI';

// 주식 추천 API 응답 데이터 타입
export interface StockData {
  id: number;
  ticker: string;
  name: string;
  currentPrice: number;
  highPrice1y: number;
  dividendYield: number;
  currentToHighRatio: number;
  recommendReason: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  detail: string;
}

export interface ApiResponse {
  stocks: StockData[];
  Explanation: string;
}

// 질문을 보내고 추천 주식 및 설명을 받아옴
export async function askForRecommendation(
  question: string
): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE}/chat/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error('서버 응답 오류');
  }

  return await response.json();
}
