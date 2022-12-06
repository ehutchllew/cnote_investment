import { ICreateTransaction } from "src/models/client";
import { ITransactionsRepository } from "src/repository/transactions.repository";
import { clientToDbTransactionTransformer } from "src/transformers/transaction.transformer";

interface ICreateTransactionParams extends ICreateTransaction {
  repo: ITransactionsRepository;
}
export async function createTransaction({
  accountId,
  amount,
  date,
  userId,
  repo,
}: ICreateTransactionParams): Promise<void> {
  if (!accountId || !amount || !userId) {
    throw new Error(
      "[accountId, amount, and userId] are required to create a transaction. Use (--help or -h) for commands and options."
    );
  }

  const dbFormattedTransaction = clientToDbTransactionTransformer({
    accountId,
    amount,
    date,
    userId,
  });

  return repo.create(dbFormattedTransaction);
}
