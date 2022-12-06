import EventEmitter from "events";
import fs from "fs/promises";
import path from "path";
import sqlite3, { Database } from "sqlite3";

export async function setupDb(): Promise<Database> {
  return new Promise(async (resolve, _) => {
    const db = new sqlite3.Database(
      path.join(__dirname, "plata.db"),
      sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) console.error("Encountered error at instantiated DB: \n", err);
      }
    );

    const createAccountsTableSql = fs.readFile(
      path.join(__dirname, "accounts.sql")
    );

    const createTransactionsTableSql = fs.readFile(
      path.join(__dirname, "transactions.sql")
    );

    const [createAccountSqlBuffer, createTransactionsSqlBuffer] =
      await Promise.all([createAccountsTableSql, createTransactionsTableSql]);

    const doneEvent = new EventEmitter();
    db.serialize(function () {
      db.run(createAccountSqlBuffer.toString(), (err) => {
        if (err) {
          console.error("ACCOUNTS ERROR TABLE:::", err);
          throw new Error("failed to create accounts table");
        }
      });

      db.run(
        "INSERT INTO accounts (balance, current_interest_rate, interest_accumulated, user_id) VALUES(?,?,?,?)",
        0,
        2,
        0,
        123,
        (err: Error) => {
          if (err) {
            console.error("TRANSACTIONS SEED :::", err);
            throw new Error("failed to seed accounts table");
          }

          doneEvent.emit("dbProcessDone");
        }
      );
    });

    db.run(createTransactionsSqlBuffer.toString(), (err) => {
      if (err) {
        console.error("TRANSACTIONS ERROR TABLE:::", err);
        throw new Error("failed to create transactions table");
      }
      doneEvent.emit("dbProcessDone");
    });

    let doneCounter = 0;
    doneEvent.on("dbProcessDone", () => {
      doneCounter++;
      if (doneCounter == 2) {
        resolve(db);
      }
    });
  });
}
