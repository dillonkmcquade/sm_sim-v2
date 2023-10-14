import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticker } from './entities/ticker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticker])],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
