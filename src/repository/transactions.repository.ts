import { Database } from "sqlite3";
import { IServiceTransaction, ITransaction } from "src/models/data";
import { BaseRepository } from "./base.repository";

export interface ITransactionsRepository {
  list(
    listParams: Pick<IServiceTransaction, "account_id"> & {
      start_date: string;
      end_date: string;
      user_id?: number;
    }
  ): Promise<ITransaction[]>;
  create(transaction: IServiceTransaction): Promise<void>;
}

export class TransactionsRepository
  extends BaseRepository
  implements ITransactionsRepository
{
  constructor(db: Database) {
    super(db);
  }

  public async list({
    account_id,
    start_date,
    end_date,
    user_id,
  }: Pick<ITransaction, "account_id" | "user_id"> & {
    start_date: string;
    end_date: string;
  }): Promise<ITransaction[]> {
    return new Promise((resolve, reject) => {
      if (user_id) {
        this.db.all(
          "SELECT * FROM transactions WHERE user_id=(?) AND timestamp BETWEEN ? AND ?;",
          [user_id, start_date, end_date],
          (err: Error, rows: ITransaction[]) => {
            if (err) reject(err);

            resolve(rows);
          }
        );
      }
      if (account_id) {
        this.db.all(
          "SELECT * FROM transactions",
          // [account_id, start_date, end_date],
          (err: Error, rows: ITransaction[]) => {
            if (err) reject(err);

            resolve(rows);
          }
        );
      }
    });
  }

  public async create(transaction: IServiceTransaction): Promise<void> {
    const keys: string[] = [];
    const values: string[] = [];
    const params: IServiceTransaction[keyof IServiceTransaction][] = [];
    Object.entries(transaction).forEach(([key, value]) => {
      keys.push(key);
      values.push("?");
      params.push(value);
    });
    const sql = `INSERT INTO transactions (${keys.join(
      ","
    )}) VALUES (${values.join(",")});`;
    return new Promise((resolve, reject) =>
      this.db.run(sql, params, (err: Error | null) => {
        if (err) {
          reject(err);
        } else resolve();
      })
    );
  }
}
