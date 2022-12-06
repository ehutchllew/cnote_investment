CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY,
    balance INTEGER NOT NULL,
    created_on TIMESTAMP default CURRENT_TIMESTAMP,
    current_interest_rate NUMERIC(5,3) NOT NULL,
    interest_accumulated INTEGER NOT NULL,
    updated_on TIMESTAMP default CURRENT_TIMESTAMP,
    user_id INTEGER
    -- user_id INTEGER REFERENCES users(id) ON DELETE RESTRICT
);