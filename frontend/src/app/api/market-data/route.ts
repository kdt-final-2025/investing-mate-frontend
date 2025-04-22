import { NextResponse } from 'next/server'

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  name?: string;
}

interface YahooFinanceResponse {
  chart: {
    result: Array<{
      meta: {
        symbol: string;
        regularMarketPrice: number;
        regularMarketChange: number;
        regularMarketChangePercent: number;
      };
    }>;
    error: string | null;
  };
}

const SYMBOLS = ['^KS11', '^KQ11', 'KRW=X', 'BTC-KRW'];
const MARKET_NAMES: { [key: string]: string } = {
  '^KS11': 'KOSPI',
  '^KQ11': 'KOSDAQ',
  'KRW=X': 'USD/KRW',
  'BTC-KRW': 'BTC/KRW'
};

export async function GET() {
  try {
    const marketData = await Promise.all(
      SYMBOLS.map(async (symbol) => {
        const response = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${symbol}`);
        }

        const data: YahooFinanceResponse = await response.json();
        
        if (data.chart.error) {
          throw new Error(`Yahoo Finance API error: ${data.chart.error}`);
        }

        const result = data.chart.result[0];
        return {
          symbol,
          name: MARKET_NAMES[symbol],
          price: result.meta.regularMarketPrice,
          change: result.meta.regularMarketChange,
          changePercent: result.meta.regularMarketChangePercent,
        };
      })
    );

    if (!marketData.length) {
      throw new Error('Failed to fetch any market data');
    }

    return NextResponse.json(marketData);
  } catch (error) {
    console.error('Error in market data API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
} 