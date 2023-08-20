import "dotenv/config";
import { Pool } from "pg";

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
  constructor(db: Pool) {
    this.db = db;
  }
  public async quote(ticker: string): Promise<Quote | undefined> {
    const request = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.FINNHUB_KEY}`,
    );
    const data = await request.json();

    if (data["c"]) {
      return data;
    }
    return undefined;
  }

  public async news(ticker: string): Promise<Article[] | undefined> {
    const request = await fetch(
      `https://api.polygon.io/v2/reference/news?ticker=${ticker}&apiKey=${process.env.POLYGON_KEY}`,
    );
    const data = await request.json();
    if (data["results"]) return data;
    return undefined;
  }

  public async candle(
    ticker: string,
    resolution: string,
    from: string,
  ): Promise<Candle[] | undefined> {
    const request = await fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${ticker}&resolution=${resolution}&from=${from}&to=${Math.floor(
        Date.now() / 1000,
      )}&token=${process.env.FINNHUB_KEY}`,
    );
    const data = await request.json();
    if (data["c"]) return data;
    return undefined;
  }

  public async search(name: string): Promise<Ticker[] | undefined> {
    const data = await this.db.query<Ticker>(
      "SELECT * FROM tickers WHERE description LIKE $1 LIMIT 10",
      [name.toUpperCase() + "%"],
    );
    if (data.rows.length === 0) return undefined;
    return data.rows;
  }
}
