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
    const response = await fetch('/api/market-data')
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch market data')
    }
    return response.json()
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
  fallbackData: DEFAULT_MARKET_DATA,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  errorRetryCount: 3
}

export function useMarketData() {
  const { data, error, isLoading, isValidating } = useSWR<MarketData[]>(
    '/api/market-data',
    fetchMarketData,
    swrConfig
  )

  return {
    data: data || DEFAULT_MARKET_DATA,
    isLoading,
    isValidating,
    isError: error,
    error
  }
} 