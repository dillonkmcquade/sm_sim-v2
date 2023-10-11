import { Repository, ObjectLiteral } from "typeorm";

export abstract class DatabaseServiceModel<T extends ObjectLiteral> {
  protected repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }
}
