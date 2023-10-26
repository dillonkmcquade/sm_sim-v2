import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Transaction } from '../../transactions/entities/transaction.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { Ticker } from '../../stock/entities/ticker.entity';

@Entity('users')
export class User {
  @PrimaryColumn()
  id: string;

  @Column('float')
  balance: number = 1_000_000;

  @Column({ nullable: true })
  telephone?: string;

  @Column()
  email?: string;

  @Column()
  name?: string;

  @Column({ nullable: true })
  nickname?: string;

  @Column({ nullable: true })
  address?: string;

  @Column()
  picture?: string;

  @ApiHideProperty()
  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    cascade: ['remove'],
  })
  transactions: Transaction[];

  @ManyToMany(() => Ticker)
  @JoinTable({
    name: 'users_tickers',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'ticker_id',
      referencedColumnName: 'id',
    },
  })
  watch_list: Ticker[];

  @CreateDateColumn()
  created_on: Date;

  @UpdateDateColumn()
  updated_on: Date;
}
