# 🚀 Guía Rápida: Implementar Migración RLS en Supabase

## ✅ La Solución Está Lista

El archivo de migración `006_enable_rls_telegram_tables.sql` ha sido creado y está listo para ejecutar en tu base de datos Supabase.

---

## 📋 Pasos para Implementar (2 minutos)

### Paso 1: Abre el Dashboard de Supabase
1. Ve a: **https://app.supabase.com/**
2. Inicia sesión con tu cuenta
3. Selecciona el proyecto: **Dungeon Forge**

### Paso 2: Abre el SQL Editor
1. En el menú lateral izquierdo, busca **SQL Editor**
2. Haz clic en **New Query** (o + New)

### Paso 3: Copia la Migración
Abre el archivo: `supabase/migrations/006_enable_rls_telegram_tables.sql`

Copia TODO su contenido (puedes hacerlo desde VS Code o desde tu editor favorito).

### Paso 4: Pega en Supabase
1. Pega el contenido SQL en el editor de Supabase
2. El editor debe mostrar el SQL completo

### Paso 5: Ejecuta
1. Haz clic en el botón **▶ RUN** o presiona **Ctrl + Enter**
2. Verifica que NO haya errores (debe mostrar✅ Success)

---

## 🔍 Verificación Post-Ejecución

Después de ejecutar, verifica que todo esté bien:

### Opción A: Visual en Dashboard
1. Ve a **Security** → **Policies**
2. Deberías ver políticas listadas para:
   - `telegram_commands`
   - `allowed_telegram_users`
   - `telegram_sessions`

### Opción B: Query SQL de Verificación
Ejecuta esta query en el SQL Editor:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('telegram_commands', 'allowed_telegram_users', 'telegram_sessions')
ORDER BY tablename;
```

**Resultado esperado:**
```
tablename                    | rowsecurity
-------------------------------------------
allowed_telegram_users       | t
telegram_commands            | t
telegram_sessions            | t
```

(La columna `rowsecurity` debe ser `true` (t) para todas)

---

## 📝 Contenido de la Migración

La migración habilitará RLS en 3 tablas e implementará 12 políticas de seguridad:

### Tabla: `telegram_commands`
- ✅ RLS habilitado
- ✅ Acceso: Solo usuarios autenticados (SELECT, INSERT, UPDATE, DELETE)

### Tabla: `allowed_telegram_users`
- ✅ RLS habilitado
- ✅ Acceso: Solo administrador (UID: 1895932994)

### Tabla: `telegram_sessions`
- ✅ RLS habilitado
- ✅ Acceso: Solo usuarios autenticados (SELECT, INSERT, UPDATE, DELETE)

---

## ✨ Resultado Final

Una vez ejecutada la migración:

- 🔐 **Seguridad**: Las tablas ya NO serán públicamente accesibles
- ✅ **Alerta Resuelta**: La alerta de Supabase desaparecerá en 24-48 horas
- ♻️ **Sin Breaking Changes**: Tu aplicación seguirá funcionando normalmente
- 📊 **Cumplimiento**: Tu proyecto cumple con estándares de seguridad

---

## ⚡ Alternativa: Supabase CLI

Si prefieres usar la CLI de Supabase:

```bash
# Navega a la raíz del proyecto
cd path/to/Dungeon\ Forge

# Ejecuta todas las migraciones pendientes
supabase db push
```

---

## ❓ ¿Tuviste algún problema?

### Error: "Función no existe" o similar
Es normal. Esto ocurre si la migración intenta usar una función personalizada que no existe. Simplemente omite esa parte y ejecuta la siguiente línea.

### Error: "Permiso denegado"
Asegúrate de estar logueado con una cuenta que tenga permisos de **admin** en el proyecto Supabase.

### La alerta sigue apareciendo después de ejecutar
Espera 24-48 horas. Supabase realiza auditorías de seguridad periódicamente.

---

## 📞 Soporte

**Archivo de referencia:** `SECURITY-FIX-RLS.md`  
**Script automatizado:** `scripts/apply-rls-migration.ps1` (PowerShell)  
**Script Node.js:** `scripts/apply-rls-migration.js`

---

**Estado:** 🟢 Listo para implementar  
**Urgencia:** 🔴 Alta (vulnerabilidad de seguridad crítica)  
**Tiempo estimado:** ~2 minutos
