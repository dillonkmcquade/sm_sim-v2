import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Request } from 'express';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    await this.transactionsService.create(createTransactionDto);
  }

  @Get()
  async findAll(@Req() req: Request) {
    const id = req.auth.payload.sub;
    try {
      const transactions = await this.transactionsService.findById(id);
      return transactions;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failure to retrieve user transactions',
      );
    }
  }
}
