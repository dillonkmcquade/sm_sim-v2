import { Pool, QueryConfig, QueryResultRow } from "pg";

export abstract class DatabaseServiceModel<T extends QueryResultRow> {
  protected pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }
  /**
   *
   * This wrapper will allow tsserver to know the shape of the database rows being returned without
   * manually inputting the generic each time.
   *
   * @example
   * ```js
   * this.query('SELECT * FROM users WHERE id = $1', [user.id])
   * ```
   * @param queryString - The raw SQL string
   * @param args - The values to be interpolated, if any in the SQL string
   */
  protected async query<R extends QueryResultRow = T>(
    // eslint-disable-next-line
    queryString: string | QueryConfig<any[]>,
    // eslint-disable-next-line
    args: any[] | undefined,
  ) {
    return this.pool.query<R>(queryString, args);
  }
}
