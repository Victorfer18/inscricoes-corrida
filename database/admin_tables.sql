-- Tabela de usuários administrativos
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nome VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'admin', 'moderator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at na tabela admin_users
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Adicionar coluna lote_id na tabela inscricoes se não existir
ALTER TABLE inscricoes 
ADD COLUMN IF NOT EXISTS lote_id UUID REFERENCES lotes(id);

-- Índice para performance na tabela inscricoes
CREATE INDEX IF NOT EXISTS idx_inscricoes_lote_id ON inscricoes(lote_id);
CREATE INDEX IF NOT EXISTS idx_inscricoes_status ON inscricoes(status);
CREATE INDEX IF NOT EXISTS idx_inscricoes_created_at ON inscricoes(created_at);

-- Comentários para documentação
COMMENT ON TABLE admin_users IS 'Tabela de usuários administrativos do sistema';
COMMENT ON COLUMN admin_users.role IS 'Nível de permissão: super_admin, admin, moderator';
COMMENT ON COLUMN admin_users.password_hash IS 'Hash bcrypt da senha do usuário';
