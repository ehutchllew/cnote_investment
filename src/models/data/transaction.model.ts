// DB Representation
export interface ITransaction {
  id: number;
  account_id: number;
  amount: number;
  timestamp: number;
  time_zone: number;
  user_id: number;
}

/**
 * Service layer representation -- if we ever need to handle some transformations, or mapping from the client,
 * that does not need/want access to certain DB data types, then those exclusions would go here. Situations
 * could include the DB providing default/serial values for these fields.
 */
export interface IServiceTransaction
  extends Omit<ITransaction, "id" | "timestamp"> {
  timestamp?: string;
}
