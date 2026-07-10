# 📋 Obtener Firebase Admin SDK Credentials

**Status:** ⏳ Bloqueado - Requiere Manual Step  
**Causa:** Falta archivo `dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json`

---

## 🔑 Cómo Obtener la Credencial

### Paso 1: Ir a Google Cloud Console
```
https://console.cloud.google.com/iam-admin/serviceaccounts?project=dungeon-forge-prod
```

### Paso 2: Encontrar Service Account
Busca la service account llamada: `firebase-adminsdk-fbsvc`

### Paso 3: Crear / Descargar Clave JSON
1. Haz click en la service account
2. Ve a tab "Claves" (Keys)
3. Click en "Agregar clave" (Add key) → "Crear nueva clave" (Create new key)
4. Selecciona "JSON"
5. Se descargará automáticamente: `dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json`

### Paso 4: Colocar en el Proyecto
```
# Windows
Copy-Item "C:\Users\Nauzael\Downloads\dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json" `
  "i:\Apks\Dungeon Forge\"
  
# macOS/Linux
cp ~/Downloads/dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json \
  /path/to/Dungeon\ Forge/
```

### Paso 5: Verificar (NO para versionControl!)
```bash
# Verificar que existe
ls -la dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json

# ✅ Ya está en .gitignore:
cat .gitignore | grep "firebase-adminsdk"
# Output: *firebase-adminsdk-*.json  ✓ Protegido
```

---

## ✅ Después: Ejecutar Migración

Una vez tengas el archivo:

### DRY RUN (Preview)
```bash
# Ver qué data se va a migrar sin hacer cambios
$env:DRY_RUN='true'
node scripts/migrate-parties-to-firebase.mjs
```

### Migración Real
```bash
# Ejecutar migración completa
node scripts/migrate-parties-to-firebase.mjs
```

**Output esperado:**
```
✅ Connected to source database
✅ Connected to Firebase
✅ Parties audited: 5 records valid
✅ UID mapping: 100% successful
✅ Batch 1: 5/5 migrated
✅ Migration complete: 5 parties in Firestore
```

---

## 📊 Qué Se Migra

| Source | Target | Records |
|--------|--------|---------|
| Legacy `parties` table | Firebase `/parties` collection | 5 |
| Fields mapped | New schema (dm_uid, members, ISO timestamps) | ✓ |
| party_id references | Preserved in `/parties/{id}` docs | ✓ |

---

## 🔒 Seguridad

✅ El archivo `dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json` está protegido:
```gitignore
# Ya en .gitignore:
*firebase-adminsdk-*.json
```

**NUNCA versionear credenciales.**

---

## ❓ Troubleshooting

### Error: "Firebase Admin SDK file not found"
→ Descargar credencial de Google Cloud Console (ver Paso 1-3 arriba)

### Error: "Failed to count parties"
→ Verificar que `FIREBASE_ADMIN_SDK_PATH` está en `.env`

### Error: "PERMISSION_DENIED"
→ Verificar que la service account tiene rol `Editor` o `Firestore Admin` en Cloud IAM

---

## 📝 Próximos Pasos

1. ✅ **Código corregido** - 4 bugs fixed  
2. ✅ **Build verified** - 235 modules, 0 errors
3. ✅ **Push to GitHub** - main branch updated
4. ⏳ **Obtener credenciales** ← TÚ AQUÍ
5. ⏳ **Ejecutar migración** - Legacy → Firebase
6. ⏳ **Verificar datos** - Test party create/join

---

**Estado:** Listo para que obtengas la credencial.

Una vez tengas el archivo en el directorio raíz, ejecuta:
```bash
node scripts/migrate-parties-to-firebase.mjs
```
