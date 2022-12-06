import { ITransaction } from "src/models/data";
import { ITransactionsRepository } from "src/repository/transactions.repository";
import { getLastMillisecondTimestampOfMonth } from "src/utils";

interface IListTransactionsParams {
  accountId: number;
  month: number;
  repo: ITransactionsRepository;
}
export async function listTransactions({
  accountId,
  month,
  repo,
}: IListTransactionsParams): Promise<ITransaction[]> {
  const startDate = new Date(new Date().getFullYear(), month);
  const endDate = getLastMillisecondTimestampOfMonth(startDate);

  return await repo.list({
    account_id: accountId,
    start_date: `${startDate.getFullYear()}-${
      startDate.getMonth() + 1
    }-0${startDate.getDate()}`,
    end_date: `${endDate.getFullYear()}-${
      endDate.getMonth() + 1
    }-${endDate.getDate()}`,
  });
}
