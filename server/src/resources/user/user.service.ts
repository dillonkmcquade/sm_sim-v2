import { User } from "./models/User.entity";
import { DatabaseServiceModel } from "../../lib/DatabaseServiceModel";
import { Repository } from "typeorm";

export interface userDto {
  id: string;
  email: string;
  name: string;
  nickname: string;
  picture: string;
  telephone: string;
}

export class UserService extends DatabaseServiceModel<User> {
  constructor(repository: Repository<User>) {
    super(repository);
  }

  public async create(u: userDto): Promise<User> {
    const user = this.repository.create(u);
    await this.repository.save(user);
    return user;
  }

  public async findOne(id: string): Promise<User> {
    return this.repository.findOneByOrFail({ id: id });
  }

  public async update(req: Partial<User>, id: string): Promise<void> {
    await this.repository.update(id, req);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  public async getBalance(id: string): Promise<User | null> {
    return this.repository.findOne({
      select: { balance: true, id: true },
      where: { id: id },
    });
  }

  public async setBalance(id: string, newBalance: number): Promise<void> {
    // update balance retrieve new balance
    await this.repository.decrement({ id: id }, "balance", newBalance);
  }

  public async toggleWatchList(
    id: string,
    isWatched: boolean,
    ticker: string,
  ): Promise<string[] | undefined> {
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
    await this.repository.save(user);
    return user.watch_list;
  }
}
