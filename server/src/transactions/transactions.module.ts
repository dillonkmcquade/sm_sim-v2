import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { UsersModule } from 'src/users/users.module';
import { StockModule } from 'src/stock/stock.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), UsersModule, StockModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
