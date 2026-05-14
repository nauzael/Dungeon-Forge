-- ============================================
-- Migration: Allow DM to remove characters from their party
-- Fixes: DM kick operation blocked by RLS
-- ============================================
-- 
-- Problem: The existing UPDATE policy only allows users to update
-- their OWN characters (user_id = auth.uid()), but a DM needs to 
-- set party_id = null for characters that belong to other users.
-- 
-- Solution: Add a second UPDATE policy that allows party creators
-- to remove characters from their party (set party_id to null).
-- ============================================

-- Drop the new policy if it already exists (idempotent)
DROP POLICY IF EXISTS "Characters: DM puede remover de su party" ON characters;

-- Allow party creators (DMs) to set party_id = null for characters in their party
-- USING: the character must currently be in a party owned by the current user
-- WITH CHECK: the new party_id must be null (only removal allowed, not reassignment)
CREATE POLICY "Characters: DM puede remover de su party" ON characters
    FOR UPDATE
    USING (
        party_id IN (
            SELECT id FROM parties WHERE creator_id = auth.uid()::text
        )
    )
    WITH CHECK (
        party_id IS NULL
    );
