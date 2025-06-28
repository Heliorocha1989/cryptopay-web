CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL REFERENCES users(id),
    tipo VARCHAR(20) NOT NULL, -- 'deposito', 'transferencia', 'pagamento'
    valor NUMERIC(12,2) NOT NULL,
    destino VARCHAR(100), -- id do usuário destino (para transferências)
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS saldo NUMERIC(12,2) DEFAULT 0;
