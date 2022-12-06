CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY,
    amount INTEGER NOT NULL,
    timestamp TIMESTAMP default CURRENT_TIMESTAMP,
    time_zone INTEGER NOT NULL check (time_zone BETWEEN -12 AND 14),
    account_id INTEGER REFERENCES accounts(id) ON DELETE RESTRICT,
    user_id INTEGER
    -- user_id INTEGER REFERENCES users(id) ON DELETE RESTRICT
)