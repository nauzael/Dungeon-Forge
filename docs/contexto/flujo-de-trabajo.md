# Flujo de Trabajo

## Pasos para Hacer un Cambio

### 1. Investigación

```
git log --oneline -10      # Últimos cambios
git diff --cached          # Si hay staged
git status                 # Árbol de trabajo
npm run test:run           # Tests actuales pasan
```

### 2. Desarrollo Local

```bash
npm run dev                # → http://localhost:5173
npm run lint               # ESLint + Prettier check
npm run test:run           # Vitest unit tests
```

### 3. Build y Verificación

```bash
npm run build              # → dist/ (verificar errores de TS)
npm run preview            # Vista previa del build
```

### 4. Commit

```bash
git add -p                 # Revisar cambios antes de stage
# Formato: tipo: mensaje descriptivo
# Tipos: fix, feat, perf, chore, docs, security, refactor
git commit -m "fix: descripción del problema"

# Si el commit tiene contexto amplio, añadir cuerpo:
# - Qué se rompía
# - Causa raíz
# - Archivos tocados
# - (opcional) Fix detallado
```

### 5. Deploy

```bash
# 1. Push a main → Vercel deploy automático (SPA)
git push origin main

# 2. OTA para Android (opcional)
npm run ota               # Build + zip + upload a Firebase
```

## Checklist de "Terminado"

- [ ] `npm run build` sin errores de TS (strict = 0 errores)
- [ ] `npm run lint` sin warnings (max-warnings 0)
- [ ] `npm run test:run` pasa (verificar el 1 test failing conocido si sigue ahí)
- [ ] `git status` limpio (solo lo intencionado)
- [ ] Commit message descriptivo con contexto en el cuerpo
- [ ] Los tests E2E de regresión (tab-switch-fix, party-leave, error-debug) se han verificado manualmente contra `npm run preview` o Vercel

## Deploy

### Web (Vercel)

Automático desde `main` branch. Vercel hace SPA rewrites (configurado en `vercel.json`):

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

**Importante:** Vercel ignora `docs/`, `tests/`, `android/`, `scripts/` y demás directorios grandes (~1.6 GB) para no exceder límites.

### Android (Capacitor)

```bash
cd android && ./gradlew assembleDebug     # APK debug
# Release requiere keystore + Google Play Console
```

### OTA (Capacitor Updater)

```bash
npm run ota                                # Build + subir a Firebase Storage
# Los dispositivos reciben la actualización en el próximo check manual
```

### Rollback

```bash
node scripts/restore_ota.mjs <version> "<mensaje>"
# Ej: node scripts/restore_ota.mjs 1.0.0-2026.4.16-182359 "Rollback a v1.0"

# Rollback completo (código + OTA):
git checkout v1.0.0                        # o stable-v1.0 / stable-v1.1
node scripts/restore_ota.mjs <version> "Rollback completo"
npm install
```

## Corrección de Bugs Críticos Conocidos

Si aparece **"GoogleSignIn plugin is not implemented on android"**:

1. Verificar `MainActivity.java` registra `GoogleSignInPlugin.class`
2. Verificar métodos Java tienen `@PluginMethod`
3. `npx cap sync android && cd android && ./gradlew assembleDebug`

Si hay **rollback de datos en Long Rest**:

1. Verificar que `broadcastCharacterUpdate()` NO se llama dentro de handlers
2. Verificar que `syncTimestamp` se setea ANTES de `setCharacters()`
3. Verificar que los listeners RTDB tienen guardia `incoming > current`
4. Verificar que persist effect usa `char.syncTimestamp` existente (no nuevo `Date.now()`)
