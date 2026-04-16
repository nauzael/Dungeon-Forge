-- Migration: party_resources table for Campaign Atlas
CREATE TABLE IF NOT EXISTS party_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id UUID NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  type TEXT DEFAULT 'Setting',
  description TEXT,
  is_persistent BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_party_resources_party_id ON party_resources(party_id);
CREATE INDEX IF NOT EXISTS idx_party_resources_persistent ON party_resources(party_id, is_persistent);

ALTER TABLE party_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all inserts" ON party_resources FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all selects" ON party_resources FOR SELECT USING (true);
CREATE POLICY "Allow all deletes" ON party_resources FOR DELETE USING (true);
CREATE POLICY "Allow all updates" ON party_resources FOR UPDATE USING (true);
