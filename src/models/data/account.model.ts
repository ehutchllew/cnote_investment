// DB Representation
export interface IAccount {
  id: number;
  balance: number;
  created_on: number;
  current_interest_rate: number;
  interest_accumulated: number;
  updated_on: number;
  user_id: number;
}

/**
 * Service layer representation -- if we ever need to handle some transformations, or mapping from the client,
 * that does not need/want access to certain DB data types, then those exclusions would go here.
 */
export interface IServiceAccount
  extends Omit<IAccount, "id" | "created_on" | "updated_on"> {}
