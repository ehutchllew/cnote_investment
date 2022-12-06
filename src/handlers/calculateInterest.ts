import { IAccount } from "src/models/data";
import { AccountsRepository, TransactionsRepository } from "src/repository";
import { getLastMillisecondTimestampOfMonth } from "src/utils";
import { listTransactions } from "./listTransactions";

interface ICalculateAccuredInterestParams {
  accountId: IAccount["id"];
  accountsRepo: AccountsRepository;
  month: number;
  transactionsRepo: TransactionsRepository;
}
export async function calculateAccruedInterest({
  accountId,
  accountsRepo,
  month,
  transactionsRepo,
}: ICalculateAccuredInterestParams): Promise<number> {
  const dbAccount = await accountsRepo.get(accountId);
  if (!dbAccount) {
    throw new Error("unable to find account for given account id");
  }

  const startDate = new Date(
    Date.UTC(new Date().getFullYear(), month, 1, 0, 0, 0)
  );
  const endDate = getLastMillisecondTimestampOfMonth(new Date());

  const transactions = await listTransactions({
    accountId,
    month,
    repo: transactionsRepo,
  });
  if (transactions.length === 0) return 0;

  const currentAccountInterestRate = dbAccount.current_interest_rate / 100;

  const interestAccured = transactions.reduce((acc, transaction) => {
    const transactionDate = new Date(transaction.timestamp);
    const daysTransactionAccrued =
      endDate.getDate() - transactionDate.getDate() + 1;

    acc +=
      (daysTransactionAccrued / 365) *
      (transaction.amount * currentAccountInterestRate);

    return acc;
  }, 0);

  return interestAccured;
}
