🎯 RECUPERACIÓN DE "Kaelen rompehielos" - RESUMEN EJECUTIVO
═════════════════════════════════════════════════════════════

PROBLEMA:
└─ El personaje "Kaelen rompehielos" de brothersen@gmail.com 
   desapareció después de la última actualización


CAUSA PROBABLE:
└─ El personaje fue marcado como soft-deleted en la BD
   (deleted_at IS NOT NULL en tabla characters)


SOLUCIÓN:
└─ Restaurar el personaje ejecutando una actualización en Supabase


═════════════════════════════════════════════════════════════
🛠️  HERRAMIENTAS DISPONIBLES
═════════════════════════════════════════════════════════════

Archivo                          | Qué hace
─────────────────────────────────┼──────────────────────────────
scripts/recover-character.mjs    | ✨ Script automatizado
                                 | - Busca el personaje
                                 | - Lo restaura si está eliminado
                                 | - Fuerza resync
                                 | 
scripts/recover-character.sql    | 📊 Queries SQL manuales
                                 | - 5 queries diferentes
                                 | - Para ejecutar en SQL Editor
                                 |
scripts/diagnose-character.mjs   | 🔍 Análisis completo
                                 | - Revisa cambios recientes
                                 | - Identifica problemas RLS
                                 | - Sugiere soluciones
                                 |
QUICK-RECOVERY-GUIDE.txt         | 📋 Guía paso a paso
                                 | - Opción 1: Automatizada
                                 | - Opción 2: Manual SQL
                                 | - Diagnóstico storage


═════════════════════════════════════════════════════════════
⚡ INICIO RÁPIDO (Más rápido - 3 minutos)
═════════════════════════════════════════════════════════════

Paso 1: Obtén credenciales Supabase
────────────────────────────────────
🔗 https://app.supabase.com
   → Settings → API
   → Copia: Project URL + Service Role Key


Paso 2: Abre terminal en este proyecto
───────────────────────────────────────
📂 i:\Apks\Dungeon Forge\

(Ctrl+` en VS Code, o PowerShell)


Paso 3: Ejecuta el script
──────────────────────────
$ node scripts/recover-character.mjs "https://YOUR.supabase.co" "sbp_xxxxx"

Reemplaza:
- "https://YOUR.supabase.co" → tu Project URL
- "sbp_xxxxx" → tu Service Role Key


Paso 4: Recarga la app
──────────────────────
Ctrl+R (o cierra y abre)

Login con: brothersen@gmail.com

¡Kaelen reaparecerá! 🎉


═════════════════════════════════════════════════════════════
📊 PROBLEMA SECUNDARIO: Storage Lleno
═════════════════════════════════════════════════════════════

Causa:
└─ Personajes soft-deleted sin purgar ocupan espacio

Solución:
└─ Ejecutar limpieza en SQL Editor:

    DELETE FROM characters
    WHERE deleted_at IS NOT NULL
      AND deleted_at < NOW() - INTERVAL '30 days';

(Elimina soft-deleted hace >30 días)


═════════════════════════════════════════════════════════════
❓ ¿QUÉ PASÓ? (Análisis técnico)
═════════════════════════════════════════════════════════════

Cambios recientes que afectan:
────────────────────────────────

1. v1.1.1 — DM Panel Sync Optimization
   - Mejoró rendimiento pero podría haber bugs de edge case
   - Implementó soft-delete (marcar como eliminado sin borrar)
   
2. Cambios en la sincronización (App.tsx):
   - fetchCharactersFromCloud filtra: .is('deleted_at', null)
   - Solo trae personajes NO eliminados
   
3. Problema probable:
   - Kaelen fue marcado como deleted_at durante sync
   - Después no aparece porque el filtro lo excluye
   - Pero sigue en la BD, solo "escondido"


═════════════════════════════════════════════════════════════
✅ PRÓXIMOS PASOS (Elige uno)
═════════════════════════════════════════════════════════════

[ ] Voy a usar el script automatizado
    → Necesito tus credenciales de Supabase
    → Tiempo: 3 minutos
    → Riesgo: Mínimo

[ ] Voy a hacer los queries manuales
    → Abro SQL Editor en Supabase
    → Ejecuto queries de recover-character.sql
    → Tiempo: 5 minutos
    → Riesgo: Bajo (si sigues las instrucciones)

[ ] Quiero que ejecutes tú mismo
    → Comparte credenciales en privado
    → Yo lo recupero y limpio el storage
    → Tiempo: 1 minuto
    → Requiere confianza


═════════════════════════════════════════════════════════════

📧 Una vez que hayas recuperado el personaje:

1. Confirma que aparece en la app
2. Si aún hay problemas → ejecuta scripts/diagnose-character.mjs
3. Para storage → ejecuta el query de limpieza
4. Reporta el resultado aquí 📊


═════════════════════════════════════════════════════════════
¿LISTO? ⚡

Lee: QUICK-RECOVERY-GUIDE.txt (instrucciones detalladas)

Elige herramienta y comienza! 🚀
