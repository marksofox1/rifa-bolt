-- Esquema do banco de dados para o sistema de rifas online

-- Tabela de perfis de usuários
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o timestamp de updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabela de rifas
CREATE TABLE raffles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  total_tickets INTEGER NOT NULL,
  sold_tickets INTEGER NOT NULL DEFAULT 0,
  draw_date TIMESTAMP WITH TIME ZONE NOT NULL,
  image_url TEXT,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  winner_ticket_id UUID,
  winner_user_id UUID REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualizar o timestamp de updated_at
CREATE TRIGGER update_raffles_updated_at
BEFORE UPDATE ON raffles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabela de bilhetes
CREATE TABLE tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  raffle_id UUID REFERENCES raffles(id) ON DELETE CASCADE NOT NULL,
  number INTEGER NOT NULL,
  user_id UUID REFERENCES profiles(id),
  purchased_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (raffle_id, number)
);

-- Políticas de segurança RLS (Row Level Security)

-- Habilitar RLS para todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE raffles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Usuários podem ver seus próprios perfis"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios perfis"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Políticas para raffles
CREATE POLICY "Qualquer pessoa pode ver rifas"
ON raffles FOR SELECT
TO PUBLIC;

CREATE POLICY "Usuários autenticados podem criar rifas"
ON raffles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Criadores podem atualizar suas próprias rifas"
ON raffles FOR UPDATE
USING (auth.uid() = creator_id);

-- Políticas para tickets
CREATE POLICY "Qualquer pessoa pode ver bilhetes"
ON tickets FOR SELECT
TO PUBLIC;

CREATE POLICY "Usuários autenticados podem comprar bilhetes"
ON tickets FOR UPDATE
TO authenticated
USING (
  user_id IS NULL AND
  EXISTS (
    SELECT 1 FROM raffles
    WHERE raffles.id = raffle_id
    AND raffles.status = 'active'
  )
)
WITH CHECK (
  auth.uid() = user_id
);

-- Índices para melhorar a performance
CREATE INDEX idx_tickets_raffle_id ON tickets(raffle_id);
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_raffles_creator_id ON raffles(creator_id);
CREATE INDEX idx_raffles_status ON raffles(status);
