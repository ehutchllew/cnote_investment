export interface IClientTransaction {
  id: number;
  amount: number;
  createdOn: Date;
}

export interface ICreateTransaction {
  amount: number;
  accountId: number;
  date?: Date;
  userId: number;
}
