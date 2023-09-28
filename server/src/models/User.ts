import { TUser } from "../services/UserService";

export class User {
  private auth0_id: string;
  public balance?: number;
  public email?: string;
  public name?: string;
  public nickname?: string;
  public picture?: string;
  public watch_list?: string[];

  constructor(user: TUser) {
    this.auth0_id = user.auth0_id;
    this.email = user.email;
    this.name = user.name;
    this.nickname = user.nickname;
    this.picture = user.picture;
    this.balance = user.balance;
    this.watch_list = user.watch_list;
  }

  public getId(): string | undefined {
    return this.auth0_id;
  }
}
