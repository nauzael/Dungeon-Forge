-- ============================================
-- Dungeon Forge: Characters and Parties Schema
-- Migration 003
-- ============================================

-- ============================================
-- Helper Function: Update updated_at trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Table: parties
-- ============================================
CREATE TABLE IF NOT EXISTS parties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id TEXT NOT NULL,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_parties_creator_id ON parties(creator_id);
CREATE INDEX IF NOT EXISTS idx_parties_code ON parties(code);

DROP TRIGGER IF EXISTS parties_updated_at ON parties;
CREATE TRIGGER parties_updated_at
    BEFORE UPDATE ON parties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Table: characters
-- ============================================
CREATE TABLE IF NOT EXISTS characters (
    id UUID PRIMARY KEY,
    user_id TEXT NOT NULL,
    data JSONB NOT NULL,
    party_id UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);
CREATE INDEX IF NOT EXISTS idx_characters_party_id ON characters(party_id);
CREATE INDEX IF NOT EXISTS idx_characters_user_party ON characters(user_id, party_id);

DROP TRIGGER IF EXISTS characters_updated_at ON characters;
CREATE TRIGGER characters_updated_at
    BEFORE UPDATE ON characters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to recreate cleanly)
DROP POLICY IF EXISTS "Parties: usuarios ven sus propias mesas" ON parties;
DROP POLICY IF EXISTS "Parties: usuarios crean sus propias mesas" ON parties;
DROP POLICY IF EXISTS "Parties: usuarios actualizan sus propias mesas" ON parties;
DROP POLICY IF EXISTS "Parties: solo el creador elimina su mesa" ON parties;

DROP POLICY IF EXISTS "Characters: usuarios ven sus propios personajes" ON characters;
DROP POLICY IF EXISTS "Characters: usuarios crean sus propios personajes" ON characters;
DROP POLICY IF EXISTS "Characters: usuarios actualizan sus propios personajes" ON characters;
DROP POLICY IF EXISTS "Characters: usuarios eliminan sus propios personajes" ON characters;

DROP POLICY IF EXISTS "Allow all inserts" ON parties;
DROP POLICY IF EXISTS "Allow all selects" ON parties;
DROP POLICY IF EXISTS "Allow all deletes" ON parties;
DROP POLICY IF EXISTS "Allow all updates" ON parties;

DROP POLICY IF EXISTS "Allow all inserts" ON characters;
DROP POLICY IF EXISTS "Allow all selects" ON characters;
DROP POLICY IF EXISTS "Allow all deletes" ON characters;
DROP POLICY IF EXISTS "Allow all updates" ON characters;

-- Parties Policies (simplified to avoid type conflicts)
CREATE POLICY "Parties: usuarios ven sus propias mesas" ON parties
    FOR SELECT USING (creator_id::text = auth.uid()::text);

CREATE POLICY "Parties: usuarios crean sus propias mesas" ON parties
    FOR INSERT WITH CHECK (creator_id::text = auth.uid()::text);

CREATE POLICY "Parties: usuarios actualizan sus propias mesas" ON parties
    FOR UPDATE USING (creator_id::text = auth.uid()::text);

CREATE POLICY "Parties: solo el creador elimina su mesa" ON parties
    FOR DELETE USING (creator_id::text = auth.uid()::text);

-- Characters Policies (simplified)
CREATE POLICY "Characters: usuarios ven sus propios personajes" ON characters
    FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Characters: usuarios crean sus propios personajes" ON characters
    FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Characters: usuarios actualizan sus propios personajes" ON characters
    FOR UPDATE USING (user_id::text = auth.uid()::text);

CREATE POLICY "Characters: usuarios eliminan sus propios personajes" ON characters
    FOR DELETE USING (user_id::text = auth.uid()::text);

-- ============================================
-- Enable Realtime for sync
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE characters;
ALTER PUBLICATION supabase_realtime ADD TABLE parties;
