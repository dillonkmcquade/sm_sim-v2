import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tickers')
export class Ticker {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  symbol?: string;

  @Column({ nullable: true })
  description?: string;
}
