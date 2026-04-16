-- ============================================
-- Migration: Add soft delete support to characters
-- Fixes sync issues with deleted items reappearing
-- ============================================

-- 1. Agregar columna deleted_at para soft delete
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'characters' AND column_name = 'deleted_at'
    ) THEN
        ALTER TABLE characters 
        ADD COLUMN deleted_at TIMESTAMPTZ;
    END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 2. Crear indice para queries que excluyen eliminados
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_characters_not_deleted'
    ) THEN
        CREATE INDEX idx_characters_not_deleted 
        ON characters(user_id) 
        WHERE deleted_at IS NULL;
    END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 3. Agregar Foreign Key para party_id con CASCADE
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'characters_party_id_fkey'
    ) THEN
        ALTER TABLE characters 
        ADD CONSTRAINT characters_party_id_fkey 
        FOREIGN KEY (party_id) REFERENCES parties(id) 
        ON DELETE SET NULL;
    END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 4. Nueva funcion para eliminar (soft delete)
CREATE OR REPLACE FUNCTION soft_delete_character(character_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE characters 
    SET deleted_at = NOW(), updated_at = NOW() 
    WHERE id = character_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Nueva funcion para hard delete (solo para admins o limpieza)
CREATE OR REPLACE FUNCTION hard_delete_character(character_id UUID, request_user_id TEXT)
RETURNS void AS $$
BEGIN
    DELETE FROM characters 
    WHERE id = character_id 
    AND user_id = request_user_id 
    AND deleted_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Trigger para sincronizar updated_at (si existe la funcion)
DO $$
BEGIN
    DROP TRIGGER IF EXISTS characters_updated_at ON characters;
    IF EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'update_updated_at_column'
    ) THEN
        CREATE TRIGGER characters_updated_at
            BEFORE UPDATE ON characters
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
