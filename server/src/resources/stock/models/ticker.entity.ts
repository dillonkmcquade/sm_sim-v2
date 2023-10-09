import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tickers")
export class Ticker extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  symbol?: string;

  @Column()
  description?: string;
}
