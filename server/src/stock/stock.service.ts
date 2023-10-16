import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Ticker } from './entities/ticker.entity';
import { Article } from './dto/article.dto';
import { Candle } from './dto/candle.dto';
import { Quote } from './dto/quote.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Ticker) private stockRepository: Repository<Ticker>,
  ) {}

  async news(ticker: string): Promise<Article[]> {
    const request = await fetch(
      `https://api.polygon.io/v2/reference/news?ticker=${ticker}&apiKey=${process.env.POLYGON_KEY}`,
    );
    const data = await request.json();
    if (!data['results']) throw new Error('No data');
    return data['results'];
  }

  async quote(ticker: string): Promise<Quote> {
    const request = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.FINNHUB_KEY}`,
    );
    const data = await request.json();

    if (!data['c']) throw new Error('No data');
    return data;
  }

  async candle(
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
    if (!data['c']) throw new Error('No data');
    return data;
  }

  async search(name: string): Promise<Ticker[]> {
    return this.stockRepository.find({
      where: { description: ILike(`%${name}%`) },
      take: 10,
    });
  }
}
