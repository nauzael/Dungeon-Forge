-- ============================================
-- Migration: Fix RLS policies for party_resources
-- Only party members should access their resources
-- ============================================

-- Drop old open policies first (ignore errors if they don't exist)
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Allow all inserts" ON party_resources;
    DROP POLICY IF EXISTS "Allow all selects" ON party_resources;
    DROP POLICY IF EXISTS "Allow all deletes" ON party_resources;
    DROP POLICY IF EXISTS "Allow all updates" ON party_resources;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Agregar columna owner_id si no existe
ALTER TABLE party_resources 
ADD COLUMN IF NOT EXISTS owner_id TEXT;

-- Actualizar registros existentes con valor por defecto
UPDATE party_resources SET owner_id = creator_id WHERE owner_id IS NULL;
ALTER TABLE party_resources ALTER COLUMN owner_id SET NOT NULL;

-- Crear politicas basadas en membresia de party
CREATE POLICY "Party members can view resources" ON party_resources
    FOR SELECT USING (
        party_id IN (
            SELECT p.id FROM parties p
            WHERE p.creator_id = auth.uid()::text
            OR EXISTS (
                SELECT 1 FROM characters c 
                WHERE c.party_id = p.id 
                AND c.user_id = auth.uid()::text
            )
        )
    );

CREATE POLICY "Party creators can insert resources" ON party_resources
    FOR INSERT WITH CHECK (
        party_id IN (
            SELECT id FROM parties WHERE creator_id = auth.uid()::text
        )
    );

CREATE POLICY "Party creators can update resources" ON party_resources
    FOR UPDATE USING (
        party_id IN (
            SELECT id FROM parties WHERE creator_id = auth.uid()::text
        )
    );

CREATE POLICY "Party creators can delete resources" ON party_resources
    FOR DELETE USING (
        party_id IN (
            SELECT id FROM parties WHERE creator_id = auth.uid()::text
        )
    );
