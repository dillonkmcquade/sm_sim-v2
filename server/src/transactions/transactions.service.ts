import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private dataSource: DataSource,
  ) {}

  async create(createTransactionDto: Partial<Transaction>) {
    const transaction = this.transactionRepository.create(createTransactionDto);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      transaction.user.balance =
        transaction.user.balance - transaction.getTotalPrice();

      const result = await queryRunner.manager.save(transaction);

      await queryRunner.manager.save(transaction.user);

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  findById(id: string) {
    return this.transactionRepository.findBy({ user: { id: id } });
  }

  async numShares(id: string, ticker: string): Promise<number> {
    const shares = await this.transactionRepository.sum('quantity', {
      user: { id: id },
      symbol: ticker,
    });
    if (!shares) {
      return 0;
    }
    return shares;
  }
}
