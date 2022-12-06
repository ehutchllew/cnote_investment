import { Database } from "sqlite3";
import { IAccount } from "src/models/data";
import { BaseRepository } from "./base.repository";

export interface IAccountsRepository {
  get(account_id: IAccount["id"]): Promise<IAccount | undefined>;
  create(account: IAccount): Promise<void>;
  update(account: IAccount): Promise<void>;
}

export class AccountsRepository
  extends BaseRepository
  implements IAccountsRepository
{
  constructor(db: Database) {
    super(db);
  }

  public async get(_: IAccount["id"]): Promise<IAccount | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get("SELECT * FROM accounts", (err, row) => {
        if (err) reject(err);

        resolve(row);
      });
    });
  }

  public async create({
    balance,
    current_interest_rate,
    interest_accumulated,
    user_id,
  }: IAccount): Promise<void> {
    return new Promise((resolve, reject) =>
      this.db.run(
        "INSERT INTO accounts (balance, current_interest_rate, interest_accumulated, user_id) VALUES (?,?,?,?)",
        balance,
        current_interest_rate,
        interest_accumulated,
        user_id,
        (err: Error | null) => {
          if (err) {
            reject(err);
          } else resolve();
        }
      )
    );
  }

  public async update({
    balance,
    current_interest_rate,
    interest_accumulated,
    user_id,
  }: IAccount): Promise<void> {
    return new Promise((resolve, reject) =>
      this.db.run(
        "INSERT INTO accounts (balance, current_interest_rate, interest_accumulated, user_id) VALUES (?,?,?,?)",
        balance,
        current_interest_rate,
        interest_accumulated,
        user_id,
        (err: Error | null) => {
          if (err) {
            reject(err);
          } else resolve();
        }
      )
    );
  }
}
