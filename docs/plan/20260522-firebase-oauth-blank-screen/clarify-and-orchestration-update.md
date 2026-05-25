# Plan Artifact: Firebase OAuth Android Blank Screen

## Metadata
- Plan ID: 20260522-firebase-oauth-blank-screen
- Task ID: doc-oauth-clarifications
- Task Type: update
- Audience: developers
- Date: 2026-05-22

## Source Used (Clarify Consolidation)
Este artefacto consolida la salida de clarificacion operativa ya generada en la sesion actual (estado de terminales, evidencia de instalacion APK v1.9, notas de testing OAuth y observaciones de flujo popup/resume en Android).

## Task Clarifications
1. El problema a documentar es Android nativo (Capacitor), no web desktop.
2. El sintoma principal es pantalla en blanco o retorno sin sesion valida despues del login Google.
3. El alcance de esta tarea es documentacion de orquestacion; no requiere cambios de codigo.
4. La validacion operativa depende de evidencia en dispositivo real/emulador (logcat + retorno de app).
5. El flujo objetivo para Android es popup/resume, evitando redirecciones a localhost en contexto nativo.
6. El resultado esperado es una guia util para triage y priorizacion, no una confirmacion de fix definitivo.

## Architectural Decisions
1. AD-001 (accepted): En Android Capacitor, tratar OAuth como flujo nativo con control de retorno por app resume/deeplink, no como flujo web puro.
   - Rationale: reduce fallos de handoff entre Chrome Custom Tab y WebView.
2. AD-002 (accepted): Priorizar popup flow para login nativo y restringir redirectTo explicito en mobile salvo necesidad verificada.
   - Rationale: minimiza casos de redirect invalido (localhost o callback no registrado) que terminan en pantalla en blanco.
3. AD-003 (accepted): Estandarizar observabilidad con prefijos de log [Login]/[OAuth]/[Auth] durante incidentes.
   - Rationale: acelera correlacion temporal en logcat y reduce falsos negativos en diagnostico.
4. AD-004 (accepted): Separar decision tecnica de autenticacion del estado de despliegue (APK/OTA/versionado).
   - Rationale: evita confundir errores de flujo OAuth con problemas de artefacto desactualizado.

## Ranked Root Causes
Ordenadas por probabilidad y consistencia con la evidencia disponible al 2026-05-22.

1. Incompatibilidad de estrategia OAuth en Android (redirect web en contexto Capacitor nativo).
   - Evidencia: historial de regresiones v1.4/v1.5; correccion previa hacia popup flow.
   - Impacto: alto (pantalla en blanco o sesion no persistida).
   - Probabilidad: alta.
2. Carrera al volver desde Chrome (auth state no procesado antes de render inicial).
   - Evidencia: necesidad historica de listener resume y polling fallback.
   - Impacto: alto.
   - Probabilidad: alta.
3. Callback/deeplink mal alineado entre appId y proveedor OAuth.
   - Evidencia: sensibilidad del flujo a configuracion de callback en mobile.
   - Impacto: alto.
   - Probabilidad: media.
4. Artefacto instalado no corresponde al fix esperado (APK viejo/OTA no aplicada).
   - Evidencia: proceso de reinstalacion repetido y verificacion manual de APK.
   - Impacto: medio-alto.
   - Probabilidad: media.
5. Observabilidad insuficiente durante reproduccion (filtros logcat incompletos/no deterministas).
   - Evidencia: comandos con salida parcial o sin match estable durante pruebas.
   - Impacto: medio.
   - Probabilidad: media.

## Blockers / Gaps
1. Falta de traza end-to-end unica y limpia del intento fallido completo (click -> Chrome -> retorno -> estado final).
   - Efecto: dificulta distinguir bug de flujo vs bug de configuracion.
2. No hay matriz de verificacion consolidada por build/version (APK instalada vs comportamiento observado).
   - Efecto: riesgo de diagnostico sobre binario incorrecto.
3. Persisten brechas de configuracion externa no verificadas en esta tarea (SHA/callback exacto en proveedor).
   - Efecto: root cause potencial fuera del codigo no descartado.
4. Exit codes de herramientas de monitoreo no siempre representan fallo funcional (ej. filtros sin match).
   - Efecto: ruido operativo y conclusiones prematuras.

## Orchestration Guidance (Next Actions)
1. Congelar una corrida de reproduccion con checklist fija y timestamps.
2. Capturar evidencia minima obligatoria: logcat filtrado + screenshot antes/despues + version exacta APK.
3. Confirmar callback/deeplink efectivo contra configuracion del proveedor OAuth para Android.
4. Si falla de nuevo, clasificar incidente en una de las 5 causas rankeadas antes de proponer cambios.

## Status
- Artifact status: updated
- Implementation status: documentation-only
- Confidence: medium-high
