-- ============================================
-- Migration: Create remove_character_from_party RPC function
-- Purpose: Allow safe removal of characters from parties
-- ============================================

CREATE OR REPLACE FUNCTION remove_character_from_party(char_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_party_id UUID;
  v_user_id TEXT;
BEGIN
  -- Get the character's party_id and verify user permissions
  SELECT party_id, user_id INTO v_party_id, v_user_id
  FROM characters
  WHERE id = char_id;

  -- If character not found, return false
  IF v_party_id IS NULL THEN
    RAISE LOG 'Character % not in a party or not found', char_id;
    RETURN false;
  END IF;

  -- Verify the current user is the party creator (DM)
  IF NOT EXISTS (
    SELECT 1 FROM parties 
    WHERE id = v_party_id 
    AND creator_id = auth.uid()::text
  ) THEN
    RAISE LOG 'User % is not the creator of party %', auth.uid()::text, v_party_id;
    RETURN false;
  END IF;

  -- Remove character from party
  UPDATE characters
  SET party_id = NULL,
      data = jsonb_set(data, '{party_id}', 'null'::jsonb),
      updated_at = now()
  WHERE id = char_id;

  RAISE LOG 'Character % removed from party %', char_id, v_party_id;
  RETURN true;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error removing character from party: %', SQLERRM;
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION remove_character_from_party(UUID) TO authenticated;

-- Add comment
COMMENT ON FUNCTION remove_character_from_party(UUID) IS 'Removes a character from a party. Only the DM (party creator) can execute this function.';
