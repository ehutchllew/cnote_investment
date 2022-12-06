import { IClientAccount, ICreateAccount } from "src/models/client";
import { IAccount, IServiceAccount } from "src/models/data";

export function clientToDbAccountTransformer(
  clientAccount: ICreateAccount
): IServiceAccount {
  return {
    balance: 0,
    current_interest_rate: 2,
    interest_accumulated: 0,
    user_id: clientAccount.userId,
  };
}

export function dbToClientAccountTransformer(
  dbAccount: IAccount
): IClientAccount {
  return {
    id: dbAccount.id,
    balance: dbAccount.balance,
    currentInterestRate: dbAccount.current_interest_rate,
    interestAccumulated: dbAccount.interest_accumulated,
  };
}
