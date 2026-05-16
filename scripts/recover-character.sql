-- ========================================
-- DIAGNÓSTICO: Buscar "Kaelen rompehielos"
-- ========================================

-- 1️⃣ Buscar el personaje por nombre en la tabla characters
SELECT 
  id,
  user_id,
  (data->>'name') AS character_name,
  (data->>'class') AS character_class,
  deleted_at,
  updated_at,
  created_at,
  data
FROM characters
WHERE 
  (data->>'name') ILIKE '%kaelen%' OR 
  (data->>'name') ILIKE '%rompehielos%'
ORDER BY updated_at DESC;

-- 2️⃣ Si encuentras el personaje, usa este query para ver su user_id completo
-- y verifica que coincida con brothersen@gmail.com
SELECT 
  u.email,
  c.id,
  (c.data->>'name') AS character_name,
  c.deleted_at,
  c.updated_at
FROM characters c
JOIN auth.users u ON c.user_id = u.id
WHERE 
  u.email = 'brothersen@gmail.com'
ORDER BY c.updated_at DESC;

-- 3️⃣ Si el personaje está SOFT-DELETED (deleted_at IS NOT NULL),
-- ejecuta esto para RESTAURARLO:
UPDATE characters
SET 
  deleted_at = NULL,
  updated_at = NOW()
WHERE 
  id = '[AQUI_VA_EL_ID_DEL_PERSONAJE]'
  AND user_id IN (
    SELECT id FROM auth.users WHERE email = 'brothersen@gmail.com'
  )
RETURNING id, (data->>'name') AS name, deleted_at, updated_at;

-- 4️⃣ Diagnóstico de cuántos personajes están soft-deleted por usuario
SELECT 
  u.email,
  COUNT(CASE WHEN c.deleted_at IS NULL THEN 1 END) AS active_characters,
  COUNT(CASE WHEN c.deleted_at IS NOT NULL THEN 1 END) AS deleted_characters,
  MAX(c.updated_at) AS last_update
FROM characters c
JOIN auth.users u ON c.user_id = u.id
GROUP BY u.email
ORDER BY u.email;

-- 5️⃣ Ver el último sync de bothersen@gmail.com en detalle
SELECT 
  u.email,
  (c.data->>'name') AS character_name,
  c.id AS character_id,
  c.deleted_at,
  c.updated_at,
  c.created_at,
  CASE WHEN c.deleted_at IS NULL THEN '✅ ACTIVO' ELSE '❌ ELIMINADO' END AS status
FROM characters c
JOIN auth.users u ON c.user_id = u.id
WHERE u.email = 'brothersen@gmail.com'
ORDER BY c.updated_at DESC;
