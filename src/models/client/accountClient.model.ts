export interface IClientAccount {
  id: number;
  balance: number;
  currentInterestRate: number;
  interestAccumulated: number;
}

export interface ICreateAccount {
  userId: number;
}
