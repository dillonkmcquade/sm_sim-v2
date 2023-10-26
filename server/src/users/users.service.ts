import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ToggleWatchListDto } from './dto/toggle-watchList.dto';
import { Ticker } from 'src/stock/entities/ticker.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create({
      ...createUserDto,
      id: createUserDto.sub,
    });
    await this.usersRepository.insert(user);
    return user;
  }

  findOneOrFail(id: string): Promise<User> {
    return this.usersRepository.findOneOrFail({
      where: { id: id },
      relations: { watch_list: true },
    });
  }

  async findOne(id: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: { watch_list: true },
    });
    if (this.usersRepository.hasId(user)) {
      return user;
    }
    return;
  }

  findOneWithRelations(id: string): Promise<User> {
    return this.usersRepository.findOneOrFail({
      relations: { transactions: true, watch_list: true },
      where: { id: id },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneByOrFail({ id });
    const updatedUser = this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(updatedUser);
  }

  remove(user: User): Promise<User> {
    return this.usersRepository.remove(user);
  }

  async toggleWatchList(
    id: string,
    { isWatched, ticker }: ToggleWatchListDto,
  ): Promise<Ticker[] | undefined> {
    const user = await this.findOneOrFail(id);
    if (isWatched && !user.watch_list.some((t) => t.symbol === ticker)) {
      //Add
      const tickerToAdd = await this.dataSource.manager.findOneBy(Ticker, {
        symbol: ticker,
      });
      user.watch_list.push(tickerToAdd);
    } else if (!isWatched && user.watch_list.some((t) => t.symbol === ticker)) {
      //Remove
      user.watch_list = user.watch_list.filter((t) => t.symbol !== ticker);
    } else {
      //Do nothing
      return;
    }
    await this.usersRepository.save(user);
    return user.watch_list;
  }

  async setBalance(id: string, newBalance: number): Promise<void> {
    // update balance retrieve new balance
    await this.usersRepository.decrement({ id: id }, 'balance', newBalance);
  }
}
