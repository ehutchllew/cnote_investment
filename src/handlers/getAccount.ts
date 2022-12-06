import { IAccount } from "src/models/data";
import { IAccountsRepository } from "src/repository/accounts.repository";

interface IGetAccountParams {
  accountId: number;
  repo: IAccountsRepository;
}
export async function getAccount({
  accountId,
  repo,
}: IGetAccountParams): Promise<IAccount | undefined> {
  return await repo.get(accountId);
}
