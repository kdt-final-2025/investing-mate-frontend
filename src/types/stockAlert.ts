// types/stockAlert.ts (타입 정의 파일 따로 만들어두는 걸 추천)
export interface StockAlertRequest {
  targetPrice: number;
  symbol: string;
  above: boolean;
}

export interface StockAlertResponse {
  stockAlertId: number;
  stockSymbol: string;
  userId: string;
  targetPrice: number;
  above: boolean;
}
