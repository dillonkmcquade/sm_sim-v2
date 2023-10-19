import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public symbol!: string;

  @Column()
  public quantity!: number;

  @Column('float')
  public price!: number;

  @Column()
  public type: string;

  @ApiHideProperty()
  @ManyToOne(() => User, (user) => user.transactions, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  user?: User;

  @CreateDateColumn()
  public created_at?: Date;

  public getTotalPrice(): number {
    return this.quantity! * this.price!;
  }

  verify(numShares?: number): boolean {
    if (this.type === 'buy') {
      return this.user.balance > this.getTotalPrice();
    }
    if (this.type === 'sell') {
      return numShares > this.quantity;
    }
  }
}

export class Purchase extends Transaction {
  constructor(t: CreateTransactionDto) {
    super();
    this.quantity = t.quantity;
    this.type = t.type;
    this.symbol = t.symbol;
  }
  /**
   * Verifies if the user has enough money to make the purchase
   * @param balance - The user's current balance
   */
  public verify(): boolean {
    if (!this.user) {
      return false;
    }
    if (this.user.balance > Number(this.price)) {
      return true;
    }
    return false;
  }
}

export class Sale extends Transaction {
  /**
   * Verifies if the user has enough shares to make the sale
   *@param numShares - The number of shares of this stock owned by the user
   */
  constructor(t: CreateTransactionDto) {
    super();
    this.quantity = -t.quantity;
    this.type = t.type;
    this.symbol = t.symbol;
  }
  public verify(numShares: number = 0): boolean {
    if (numShares >= -this.quantity!) {
      return true;
    }

    return false;
  }
}

export class TransactionBuilder {
  private transaction: Transaction;

  constructor(t: CreateTransactionDto) {
    if (t.type === 'buy') {
      this.transaction = new Purchase(t);
    } else if (t.type === 'sell') {
      this.transaction = new Sale(t);
    } else {
      throw new Error(
        "Invalid transaction type: TransactionBuilder only recognizes 'buy' or 'sell'",
      );
    }
  }
  public addPrice(price: number): TransactionBuilder {
    this.transaction.price = price;
    return this;
  }
  public addUser(user: User): TransactionBuilder {
    this.transaction.user = user;
    return this;
  }
  /**
   * @throws Error if transaction incomplete or an invalid transaction type is given
   * @returns A complete transaction
   */
  public getTransaction(): Transaction {
    if (
      this.transaction.user === undefined ||
      this.transaction.price === undefined
    ) {
      throw new Error('Transaction is missing fields');
    }
    return this.transaction;
  }
}
