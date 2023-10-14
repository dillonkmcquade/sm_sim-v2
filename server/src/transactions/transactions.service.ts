import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const transaction = this.transactionRepository.create(createTransactionDto);
    const result = await this.transactionRepository.insert(transaction);
    return result;
  }

  findById(id: string) {
    return this.transactionRepository.findBy({ user: { id: id } });
  }
}
