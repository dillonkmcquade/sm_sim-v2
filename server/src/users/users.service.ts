import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create({
      ...createUserDto,
      id: createUserDto.sub,
    });
    return this.usersRepository.save(user);
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOneByOrFail({ id: id });
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return this.usersRepository.update({ id }, updateUserDto);
  }

  remove(id: string): Promise<DeleteResult> {
    return this.usersRepository.delete({ id });
  }

  async toggleWatchList(
    id: string,
    isWatched: boolean,
    ticker: string,
  ): Promise<string[]> {
    const user = await this.findOne(id);
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
}
