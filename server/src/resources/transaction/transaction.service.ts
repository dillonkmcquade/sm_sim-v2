import { Repository } from "typeorm";
import { Transaction } from "./models/transaction.entity";
import { DatabaseServiceModel } from "../../lib/DatabaseServiceModel";

export class TransactionService extends DatabaseServiceModel<Transaction> {
  constructor(repository: Repository<Transaction>) {
    super(repository);
  }
  public async insert(t: Transaction): Promise<void> {
    await this.repository.insert(t);
  }
  public async findById(id: string): Promise<Transaction[]> {
    return this.repository.findBy({ user: { id: id } });
  }
  public async delete(id: string): Promise<void> {
    await this.repository.delete({ user: { id: id } });
  }

  /**
   *
   * Get the number of shares of a particular company
   * @param id - User id
   * @param ticker - Company ticker i.e. 'TSLA'
   */
  public async numShares(id: string, ticker: string): Promise<number> {
    const shares = await this.repository.sum("quantity", {
      user: { id: id },
      symbol: ticker,
    });
    console.log(shares);
    if (!shares) {
      return 0;
    }
    return shares;
  }
}
