-- Migration: 001_telegram_queue.sql
-- Tables for Telegram ↔ OpenCode bridge

-- ============================================
-- Tabla: telegram_commands
-- Cola de comandos recibidos por Telegram
-- ============================================
CREATE TABLE IF NOT EXISTS telegram_commands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  result TEXT,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para polling eficiente
CREATE INDEX IF NOT EXISTS idx_telegram_commands_status_pending 
  ON telegram_commands(status, created_at) 
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_telegram_commands_user_status 
  ON telegram_commands(user_id, status);

-- ============================================
-- Tabla: allowed_telegram_users
-- Lista de usuarios autorizados
-- ============================================
CREATE TABLE IF NOT EXISTS allowed_telegram_users (
  telegram_id TEXT PRIMARY KEY,
  username TEXT,
  display_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insertar usuario autorizado
INSERT INTO allowed_telegram_users (telegram_id, username, is_active)
VALUES ('1895932994', 'owner', true)
ON CONFLICT (telegram_id) DO NOTHING;

-- ============================================
-- Tabla: telegram_sessions
-- Mantiene contexto entre comandos
-- ============================================
CREATE TABLE IF NOT EXISTS telegram_sessions (
  telegram_id TEXT PRIMARY KEY REFERENCES allowed_telegram_users(telegram_id) ON DELETE CASCADE,
  last_command_id UUID REFERENCES telegram_commands(id) ON DELETE SET NULL,
  context JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Función: update_updated_at
-- Actualiza timestamp automáticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para telegram_commands
DROP TRIGGER IF EXISTS telegram_commands_updated_at ON telegram_commands;
CREATE TRIGGER telegram_commands_updated_at
  BEFORE UPDATE ON telegram_commands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
