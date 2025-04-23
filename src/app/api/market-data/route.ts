import { NextResponse } from "next/server";

interface YahooFinanceResponse {
  chart: {
    result: MarketData[];
    error: string | null;
  };
}

interface MarketData {
  meta: MarketMeta;
  timestamp: number[];
  indicators: {
    quote: QuoteData[]; // Without seeing the structure of quote array, using any[]
  };
}

interface MarketMeta {
  currency: string;
  symbol: string;
  exchangeName: string;
  fullExchangeName: string;
  instrumentType: string;
  firstTradeDate: number;
  regularMarketTime: number;
  hasPrePostMarketData: boolean;
  gmtoffset: number;
  timezone: string;
  exchangeTimezoneName: string;
  regularMarketPrice: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketVolume: number;
  longName: string;
  shortName: string;
  chartPreviousClose: number;
  previousClose: number;
  scale: number;
  priceHint: number;
  currentTradingPeriod: object; // Marked as [Object] in the JSON
  tradingPeriods: any[]; // Marked as [Array] in the JSON
  dataGranularity: string;
  range: string;
  validRanges: string[]; // Assuming array of strings for valid ranges
}

interface QuoteData {
  open: number[];
  high: number[];
  low: number[];
  volume: number[];
  close: number[];
}

const SYMBOLS = ["^KS11", "^KQ11", "KRW=X", "BTC-KRW"];
const MARKET_NAMES: { [key: string]: string } = {
  "^KS11": "KOSPI",
  "^KQ11": "KOSDAQ",
  "KRW=X": "USD/KRW",
  "BTC-KRW": "BTC/KRW",
};

export async function GET() {
  try {
    const marketData = await Promise.all(
      SYMBOLS.map(async (symbol) => {
        try {
          console.log(`Fetching data for ${symbol}...`);

          const response = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d&includePrePost=false`,
            {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
              },
              next: { revalidate: 0 }, // 캐시 비활성화
            }
          );

          if (!response.ok) {
            console.error(
              `Failed to fetch data for ${symbol}: ${response.status} ${response.statusText}`
            );
            throw new Error(`Failed to fetch data for ${symbol}`);
          }

          const data: YahooFinanceResponse = await response.json();

          if (data.chart.error) {
            console.error(
              `Yahoo Finance API error for ${symbol}: ${data.chart.error}`
            );
            throw new Error(`Yahoo Finance API error: ${data.chart.error}`);
          }

          if (!data.chart.result || data.chart.result.length === 0) {
            console.error(`No data returned for ${symbol}`);
            throw new Error(`No data returned for ${symbol}`);
          }

          const result = data.chart.result[0];
          const meta = result.meta;

          // 현재가와 전일종가 사용
          const currentPrice = meta.regularMarketPrice;
          const previousClose = meta.previousClose;

          // 변화량과 등락률 계산
          const change = currentPrice - previousClose;
          const changePercent = (change / previousClose) * 100;

          const marketData = {
            symbol,
            name: MARKET_NAMES[symbol],
            price: currentPrice,
            change: Number(change.toFixed(2)),
            changePercent: Number(changePercent.toFixed(2)),
          };

          console.log(`[${symbol}] Final processed data:`, marketData);
          return marketData;
        } catch (error) {
          console.error(`Error fetching data for ${symbol}:`, error);
          return {
            symbol,
            name: MARKET_NAMES[symbol],
            price: 0,
            change: 0,
            changePercent: 0,
          };
        }
      })
    );

    // Filter out any failed requests
    const validMarketData = marketData.filter((data) => data.price !== 0);

    if (validMarketData.length === 0) {
      throw new Error("Failed to fetch any valid market data");
    }

    console.log("All market data:", validMarketData);
    return NextResponse.json(validMarketData);
  } catch (error) {
    console.error("Error in market data API:", error);
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 }
    );
  }
}
