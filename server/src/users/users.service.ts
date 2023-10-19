import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ToggleWatchListDto } from './dto/toggle-watchList.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
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
    return this.usersRepository.findOneByOrFail({ id: id });
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOneBy({ id: id });
  }

  findOneWithRelations(id: string): Promise<User> {
    return this.usersRepository.findOneOrFail({
      relations: { transactions: true },
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
  ): Promise<string[]> {
    const user = await this.findOneOrFail(id);
    if (isWatched && !user.watch_list.includes(ticker)) {
      //Add
      user.watch_list.push(ticker);
    } else if (!isWatched && user.watch_list?.includes(ticker)) {
      //Remove
      user.watch_list.splice(user.watch_list.indexOf(ticker));
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
