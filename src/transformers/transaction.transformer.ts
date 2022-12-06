import { IClientTransaction, ICreateTransaction } from "src/models/client";
import { ITransaction, IServiceTransaction } from "src/models/data";

export function clientToDbTransactionTransformer(
  clientTransaction: ICreateTransaction
): IServiceTransaction {
  const transactionTime = clientTransaction.date
    ? new Date(clientTransaction.date)
    : new Date();
  let utcModifier: number = 0;
  if (transactionTime.getUTCDay() > transactionTime.getDay()) {
    utcModifier += 24;
  }
  if (transactionTime.getUTCDay() < transactionTime.getDay()) {
    utcModifier -= 24;
  }
  const timeZone =
    transactionTime.getHours() - (transactionTime.getUTCHours() + utcModifier);

  const serviceTransaction: IServiceTransaction = {
    amount: clientTransaction.amount,
    account_id: clientTransaction.accountId,
    time_zone: timeZone,
    user_id: clientTransaction.userId,
  };

  if (clientTransaction.date) {
    const prependZero = (value: number): string =>
      value < 10 ? `0${value}` : value.toString();
    const { date } = clientTransaction;
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const sqlTimestamp = `${date.getFullYear()}-${prependZero(
      month
    )}-${prependZero(day)} ${prependZero(date.getUTCHours())}:${prependZero(
      date.getUTCMinutes()
    )}:${prependZero(date.getUTCSeconds())}`;
    serviceTransaction.timestamp = sqlTimestamp;
  }

  return serviceTransaction;
}

export function dbToClientTransactionTransformer(
  dbAccount: ITransaction
): IClientTransaction {
  const utcOffsetCharacter = dbAccount.time_zone > 0 ? "+" : "-";
  const utcTimestamp = new Date(dbAccount.timestamp).toUTCString();
  const clientLocalTimeAtCreation = new Date(
    `${utcTimestamp}${utcOffsetCharacter}${Math.abs(dbAccount.time_zone)}`
  );
  return {
    id: dbAccount.id,
    amount: dbAccount.amount,
    createdOn: clientLocalTimeAtCreation,
  };
}
