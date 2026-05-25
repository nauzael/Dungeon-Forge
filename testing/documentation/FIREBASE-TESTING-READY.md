# Firebase Migration Testing - Ready ✅

**Rama:** `feature/firebase-migration`  
**Fecha:** 2026-05-22  
**Estado:** APK compilada y lista para prueba

## APK Info
- **Archivo:** `dungeon-forge-firebase-v1.0-debug.apk`
- **Tamaño:** 11.43 MB
- **Build:** Debug (non-optimized para testing)
- **Instalado en:** Android device (com.tupaquete.dndcompanion)

## Cambios en esta rama

### 1. Backend: Supabase → Firebase
- ✅ Firebase SDK instalado (`npm install firebase@^12.13.0`)
- ✅ `utils/firebase.ts` creado (670+ líneas)
- ✅ Autenticación Google OAuth via Firebase
- ✅ Firestore para almacenamiento de personajes
- ✅ Realtime Database para party updates
- ✅ API 100% compatible con código existente

### 2. Imports Actualizados (8 archivos)
```
App.tsx
components/Login.tsx
components/JoinPartyModal.tsx
components/OAuthDebugConsole.tsx
components/dm/CampaignResources.tsx
components/sheet/NotesTab.tsx
hooks/useDMParty.ts
test-realtime-behavior.ts
```

### 3. Credenciales Firebase
```
Project ID: dungeon-forge-prod
Auth Domain: dungeon-forge-prod.firebaseapp.com
Storage Bucket: dungeon-forge-prod.firebasestorage.app
Database URL: https://dungeon-forge-prod-default-rtdb.firebaseio.com
API Key: AIzaSyBYbpNyUtDIrZCi_44_q1z41MEZpkcg6h8
```

## Test Checklist

- [ ] **Login:** Verificar Google OAuth funciona con Firebase
- [ ] **Crear Personaje:** Guardar personaje en Firestore
- [ ] **Cloud Sync:** Sincronizar personaje a nube
- [ ] **Party Join:** Unirse a campaña con código
- [ ] **Realtime Updates:** Ver actualizaciones en tiempo real
- [ ] **Local Mode:** Verificar modo local `localStorage` funciona
- [ ] **Resources:** Compartir recursos de campaña
- [ ] **Deleted Chars:** Recuperar personajes eliminados

## Troubleshooting

### Si la app muestra pantalla en blanco:
1. Esperar 3-5 segundos para que se cargue
2. Verificar conexión a internet
3. Revisar logs: `adb logcat | grep -i firebase`

### Si Google OAuth no funciona:
1. Verificar Firebase Configuration en console
2. Agregar dispositivo en Firebase → Authorized domains
3. Revisar credenciales en `.env`

### Si no se sincronizan datos:
1. Verificar conexión a Firestore en Firebase Console
2. Revisar RLS (Row Level Security) policies
3. Ver logs en Chrome DevTools: `F12 → Console`

## Notas Importantes

- **main branch** = Supabase (estable, no tocar)
- **feature/firebase-migration** = Firebase (testing)
- **Merge plan:** Validar en staging antes de merge a main
- **Rollback:** Siempre disponible en rama main

## Próximos Pasos
1. ✅ APK compilada y instalada
2. ⏳ Testing manual en dispositivo
3. ⏳ Documentar issues encontrados
4. ⏳ Crear PR para merge a rama de staging
5. ⏳ Merge final a main cuando todo funcione

---

**APK File:** `dungeon-forge-firebase-v1.0-debug.apk` (11.43 MB)  
**Ready to test on:** Android device  
**Contact:** Feature branch - no production impact
