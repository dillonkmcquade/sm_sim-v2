import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { Ticker } from './entities/ticker.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('stock')
@Controller('stock')
@UseInterceptors(CacheInterceptor)
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('candle/:ticker')
  @CacheTTL(360000)
  @ApiOperation({ summary: 'Get candle data for a specific ticker' })
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
  @CacheTTL(1000000)
  @ApiOperation({ summary: 'Get related news articles' })
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
  @CacheTTL(1000000)
  @ApiOperation({ summary: 'Get the latest price' })
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
  @CacheTTL(2800000)
  @ApiOperation({ summary: 'Search for companies' })
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
