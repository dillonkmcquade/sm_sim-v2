import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { Ticker } from './entities/ticker.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('stock')
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('candle/:ticker')
  async candle(
    @Param('ticker') ticker: string,
    @Query('resolution') resolution: string,
    @Query('from') from: string,
  ) {
    if (!ticker) {
      throw new BadRequestException('Missing url parameter');
    }
    const candle = await this.stockService.candle(ticker, resolution, from);
    if (!candle) {
      throw new BadRequestException(
        'No results found, possible incorrect ticker symbol',
      );
    }
    return candle;
  }

  @Get('news/:ticker')
  async news(@Param('ticker') ticker: string) {
    if (!ticker) {
      throw new BadRequestException('Missing url parameter');
    }
    const news = await this.stockService.news(ticker);
    if (!news) {
      throw new BadRequestException(
        'No results found, possible incorrect ticker symbol',
      );
    }
    return news;
  }

  @Get('quote/:ticker')
  async quote(@Param('ticker') ticker: string) {
    if (!ticker) {
      throw new BadRequestException('Missing url parameter');
    }
    const quote = await this.stockService.quote(ticker);
    if (!quote) {
      throw new BadRequestException(
        'No results found, possible incorrect ticker symbol',
      );
    }
    return quote;
  }

  @Get('search')
  async search(@Query('name') name: string): Promise<Ticker[]> {
    if (!name) {
      throw new BadRequestException('Missing search query');
    }
    const results = await this.stockService.search(name);
    if (results.length === 0) {
      throw new NotFoundException('No results matched');
    }
    return results;
  }
}
