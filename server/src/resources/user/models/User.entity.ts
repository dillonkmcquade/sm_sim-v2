import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity,
  PrimaryColumn,
} from "typeorm";

import { Transaction } from "../../transaction/models/transaction.entity";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryColumn()
  id?: string;

  @Column("float")
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

  @Column("simple-array")
  watch_list: string[] = [];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions?: Transaction[];

  @CreateDateColumn()
  created_on?: Date;

  @UpdateDateColumn()
  updated_on?: Date;

  numShares?: number;
}

export class UserBuilder {
  private user = new User();

  public auth0_id(auth0_id: string): UserBuilder {
    this.user.id = auth0_id;
    return this;
  }
  public email(email: string): UserBuilder {
    this.user.email = email;
    return this;
  }
  public name(name: string): UserBuilder {
    this.user.name = name;
    return this;
  }
  public nickname(nickname: string): UserBuilder {
    this.user.nickname = nickname;
    return this;
  }
  public telephone(telephone: string): UserBuilder {
    this.user.telephone = telephone;
    return this;
  }
  public picture(picture: string): UserBuilder {
    this.user.picture = picture;
    return this;
  }
  public build(): User {
    return this.user;
  }
}
