#!/usr/bin/env node

import { setupDb } from "./db/db";
import { calculateAccruedInterest } from "./handlers/calculateInterest";
import { createTransaction } from "./handlers/createTransaction";
import { getAccount } from "./handlers/getAccount";
import { listTransactions } from "./handlers/listTransactions";
import { AccountsRepository, TransactionsRepository } from "./repository";
import { ARG_TYPE, parseArgs, parseCommandArgs } from "./utils";

async function main() {
  try {
    const argsMap = parseArgs(process.argv);
    const appArgs = parseCommandArgs(argsMap);
    const { aid, type } = appArgs;

    const db = await setupDb();
    const accountsRepository = new AccountsRepository(db);
    const transactionsRepository = new TransactionsRepository(db);

    switch (type) {
      /**
       * CALCULATE ACCRUED INTEREST FOR ACCOUNT PATH
       */
      case ARG_TYPE.CALC: {
        const { m, month } = appArgs;
        console.log(
          await calculateAccruedInterest({
            accountId: aid,
            month: m || month,
            accountsRepo: accountsRepository,
            transactionsRepo: transactionsRepository,
          })
        );
        break;
      }
      /**
       * CREATE TRANSACTION FOR ACCOUNT PATH
       */
      case ARG_TYPE.CREATE: {
        const { a, amount, d, date } = appArgs;
        await createTransaction({
          accountId: aid,
          amount: a || amount,
          date: d || date,
          userId: 123,
          repo: transactionsRepository,
        });
        break;
      }

      /**
       * GET ACCOUNT PATH
       */
      case ARG_TYPE.GET: {
        await getAccount({ accountId: aid, repo: accountsRepository });
        break;
      }

      /**
       * LIST TRANSACTIONS FOR ACCOUNT PATH
       */
      case ARG_TYPE.LIST: {
        const { m, month } = appArgs;
        console.log(
          await listTransactions({
            accountId: aid,
            month: m || month,
            repo: transactionsRepository,
          })
        );
        break;
      }

      /**
       * THE SOMETHING BROKE PATH
       */
      default:
        throw new Error("Received unknown command");
    }

    console.info("Process exited with status code 0");
  } catch (e) {
    console.error("Process exited with status code 1: \n", e);
  }
}

main();
