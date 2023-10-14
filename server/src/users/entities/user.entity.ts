import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity('users')
export class User {
  @PrimaryColumn()
  id?: string;

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

  @Column('simple-array')
  watch_list: string[] = [];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions?: Transaction[];

  @CreateDateColumn()
  created_on?: Date;

  @UpdateDateColumn()
  updated_on?: Date;
}
