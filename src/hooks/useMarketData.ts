import useSWR, { SWRConfiguration } from 'swr'

interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  name: string
}

const REFRESH_INTERVAL = 10000 // 10초마다 갱신

const fetchMarketData = async (): Promise<MarketData[]> => {
  try {
    const response = await fetch('/api/market-data', {
      cache: 'no-store' // 캐시 비활성화
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch market data')
    }
    const data = await response.json()
    console.log('Fetched market data in hook:', data)
    return data
  } catch (error) {
    console.error('Error fetching market data:', error)
    throw error
  }
}

const DEFAULT_MARKET_DATA: MarketData[] = [
  { symbol: '^KS11', name: 'KOSPI', price: 0, change: 0, changePercent: 0 },
  { symbol: '^KQ11', name: 'KOSDAQ', price: 0, change: 0, changePercent: 0 },
  { symbol: 'KRW=X', name: 'USD/KRW', price: 0, change: 0, changePercent: 0 },
  { symbol: 'BTC-KRW', name: 'BTC/KRW', price: 0, change: 0, changePercent: 0 }
]

const swrConfig: SWRConfiguration = {
  refreshInterval: REFRESH_INTERVAL,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  dedupingInterval: 5000, // 중복 요청 방지 간격
  errorRetryCount: 3
}

export function useMarketData() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<MarketData[]>(
    '/api/market-data',
    fetchMarketData,
    swrConfig
  )

  return {
    data: data || [],
    isLoading,
    isValidating,
    error,
    refresh: () => mutate()
  }
} 