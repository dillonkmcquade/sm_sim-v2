import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { UsersService } from '../users/users.service';
import { StockService } from '../stock/stock.service';
import { Ticker } from '../stock/entities/ticker.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Ticker, User])],
  controllers: [TransactionsController],
  providers: [TransactionsService, UsersService, StockService],
})
export class TransactionsModule {}
