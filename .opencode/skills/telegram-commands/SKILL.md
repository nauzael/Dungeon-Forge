# Telegram Commands - Procesar comandos desde Telegram

## Descripción

Procesa los comandos que han llegado via Telegram y los ejecuta en el proyecto actual.

## Activadores

```
procesa comandos telegram
revisar telegram
comandos pendientes
check telegram queue
```

## Instrucciones

### Paso 1: Leer la cola de comandos

1. Leer el archivo `telegram-commands/QUEUE.md` para ver comandos pendientes
2. Leer los archivos individuales en `telegram-commands/*.json`

### Paso 2: Mostrar comandos pendientes

Mostrar al usuario la lista de comandos pendientes con:
- ID del comando
- Mensaje original
- Hora de recepción

### Paso 3: Procesar cada comando

Para cada comando:
1. Analizar el contenido del mensaje
2. Ejecutar la acción apropiada:
   - `analiza` / `review` → Hacer análisis de código
   - `crea` / `build` → Crear archivos/componentes
   - `corrige` / `fix` → Corregir bugs
   - `refactor` → Refactorizar
   - `build` → Ejecutar `npm run build`
   - `help` → Mostrar ayuda

3. Actualizar el resultado en Supabase

### Paso 4: Responder

Enviar confirmación a Telegram con el resultado del procesamiento.

## Ejemplo de Cola (QUEUE.md)

```markdown
## Comando abc12345

**De:** @1895932994  
**Hora:** 2026-04-02 12:00  
**Comando:**
`
analiza App.tsx
`

---
```

## Ejemplo de Comando Individual

```json
{
  "id": "abc12345",
  "message": "analiza App.tsx",
  "timestamp": "2026-04-02T12:00:00Z",
  "status": "pending"
}
```

## Formato de Resultado

Después de procesar, guardar en `telegram-commands/RESULTS.md`:

```markdown
## Resultado - abc12345

**Comando:** analiza App.tsx  
**Estado:** ✅ Completado  
**Duración:** 2500ms  

**Resumen:**
- Análisis completado
- Archivos analizados: 1
- Issues encontrados: 2
- Sugerencias: 3

**Cambios:**
- Ningún archivo modificado (solo análisis)
```
