import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { StockService } from '../stock/stock.service';
import {
  Purchase,
  Sale,
  TransactionBuilder,
} from './entities/transaction.entity';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly usersService: UsersService,
    private readonly stockService: StockService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiCreatedResponse({ type: Number })
  @ApiBadRequestResponse({
    description: 'Not enough shares or money to make the transaction',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: Request,
  ) {
    const id = req.auth.payload.sub;
    const user = await this.usersService.findOneOrFail(id);
    const price = await this.stockService.quote(createTransactionDto.symbol);

    const transaction = new TransactionBuilder(createTransactionDto)
      .addUser(user)
      .addPrice(price['c'])
      .getTransaction();

    let verified = false;

    if (transaction instanceof Sale) {
      const numShares = await this.transactionsService.numShares(
        id,
        transaction.symbol,
      );
      verified = transaction.verify(numShares);
    }

    if (transaction instanceof Purchase) {
      verified = transaction.verify();
    }

    if (!verified) {
      throw new BadRequestException(
        'Not enough shares or money to make the transaction',
      );
    }

    await this.transactionsService.create(transaction);

    return user.balance - transaction.getTotalPrice();
  }

  @Get()
  @ApiOperation({ summary: 'Get all user transactions' })
  async findAll(@Req() req: Request) {
    const id = req.auth.payload.sub;
    const transactions = await this.transactionsService.findById(id);
    return transactions;
  }
}
