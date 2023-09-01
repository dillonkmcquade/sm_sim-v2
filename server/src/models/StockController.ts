import "dotenv/config";
import type { Pool } from "pg";

interface Ticker {
  symbol: string;
  description: string;
}
interface Candle {
  c: number[];
  h: number[];
  l: number[];
  o: number[];
  s: string;
  t: number[];
  v: number[];
}

interface Quote {
  c: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
  d: number;
  dp: string;
}

interface Article {
  id: string;
  publisher: {
    name: string;
    homepage_url: string;
    logo_url: string;
    favicon_url: string;
  };
  title: string;
  author: string;
  article_url: string;
  tickers: string[];
  image_url: string;
  description: string;
  keywords: string[];
}

export class StockController {
  private db: Pool;
  constructor(pool: Pool) {
    this.db = pool;
  }
  public async quote(ticker: string): Promise<Quote> {
    const request = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.FINNHUB_KEY}`,
    );
    const data = await request.json();

    if (!data["c"]) throw new Error("No data");
    return data;
  }

  public async news(ticker: string): Promise<Article[]> {
    const request = await fetch(
      `https://api.polygon.io/v2/reference/news?ticker=${ticker}&apiKey=${process.env.POLYGON_KEY}`,
    );
    const data = await request.json();
    if (!data["results"]) throw new Error("No data");
    return data;
  }

  public async candle(
    ticker: string,
    resolution: string,
    from: string,
  ): Promise<Candle[]> {
    const request = await fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${ticker}&resolution=${resolution}&from=${from}&to=${Math.floor(
        Date.now() / 1000,
      )}&token=${process.env.FINNHUB_KEY}`,
    );
    const data = await request.json();
    if (!data["c"]) throw new Error("No data");
    return data;
  }

  public async search(name: string): Promise<Ticker[]> {
    const data = await this.db.query<Ticker>(
      "SELECT * FROM tickers WHERE description LIKE $1 LIMIT 10",
      [name.toUpperCase() + "%"],
    );
    if (data.rows.length === 0) throw new Error("No results");
    return data.rows;
  }
}
