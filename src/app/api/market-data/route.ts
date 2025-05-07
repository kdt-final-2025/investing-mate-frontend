import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

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
          // yahoo-finance2의 quote 사용
          const quote = await yahooFinance.quote(symbol);
          const q = quote as any;
          if (!q || typeof q.regularMarketPrice !== "number") {
            throw new Error("No valid data");
          }
          const currentPrice = q.regularMarketPrice;
          const previousClose = q.regularMarketPreviousClose ?? q.previousClose ?? 0;
          const change = currentPrice - previousClose;
          const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

          return {
            symbol,
            name: MARKET_NAMES[symbol],
            price: currentPrice,
            change: Number(change.toFixed(2)),
            changePercent: Number(changePercent.toFixed(2)),
          };
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

    const validMarketData = marketData.filter((data) => typeof data.price === "number" && !isNaN(data.price));
    if (validMarketData.length > 0) {
      return NextResponse.json(validMarketData);
    } else {
      return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 });
  }
}
