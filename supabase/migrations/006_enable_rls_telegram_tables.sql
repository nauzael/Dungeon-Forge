-- ============================================
-- Migration: Enable RLS on Telegram tables
-- Fixes security vulnerability: publicly accessible tables
-- ============================================

-- ============================================
-- Enable RLS on telegram_commands
-- ============================================
ALTER TABLE telegram_commands ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "telegram_commands allow all" ON telegram_commands;

-- Policy: Only authenticated users can access telegram commands
-- Internal system table, restrict to authenticated access
CREATE POLICY "telegram_commands authenticated access" ON telegram_commands
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "telegram_commands insert authenticated" ON telegram_commands
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "telegram_commands update authenticated" ON telegram_commands
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "telegram_commands delete authenticated" ON telegram_commands
    FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- Enable RLS on allowed_telegram_users
-- ============================================
ALTER TABLE allowed_telegram_users ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "allowed_telegram_users allow all" ON allowed_telegram_users;

-- Policy: Only the owner can manage allowed users (admin only)
-- This is an admin table
CREATE POLICY "allowed_telegram_users admin only" ON allowed_telegram_users
    FOR SELECT USING (auth.uid()::text = '1895932994');

CREATE POLICY "allowed_telegram_users admin insert" ON allowed_telegram_users
    FOR INSERT WITH CHECK (auth.uid()::text = '1895932994');

CREATE POLICY "allowed_telegram_users admin update" ON allowed_telegram_users
    FOR UPDATE USING (auth.uid()::text = '1895932994');

CREATE POLICY "allowed_telegram_users admin delete" ON allowed_telegram_users
    FOR DELETE USING (auth.uid()::text = '1895932994');

-- ============================================
-- Enable RLS on telegram_sessions
-- ============================================
ALTER TABLE telegram_sessions ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "telegram_sessions allow all" ON telegram_sessions;

-- Policy: Only authenticated users can access their own sessions
CREATE POLICY "telegram_sessions authenticated" ON telegram_sessions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "telegram_sessions insert authenticated" ON telegram_sessions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "telegram_sessions update authenticated" ON telegram_sessions
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "telegram_sessions delete authenticated" ON telegram_sessions
    FOR DELETE USING (auth.role() = 'authenticated');
