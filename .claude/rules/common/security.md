---
description: "Security rules - secrets, inputs, XSS prevention"
alwaysApply: true
---

# Security Guidelines - Dungeon Forge

## Checks Obligatorios

Antes de cualquier commit:
- [ ] Sin secretos hardcodeados (API keys, tokens, passwords)
- [ ] Inputs validados
- [ ] XSS prevention (sanitizar HTML)
- [ ] Mensajes de error no exponen datos sensibles

## Manejo de Secretos

```typescript
// ❌ NUNCA hardcodear
const apiKey = "sk-proj-xxxxx"

// ✅ SIEMPRE usar variables de entorno
const apiKey = import.meta.env.VITE_SUPABASE_KEY
```

## Seguridad Web

### XSS Prevention
- Nunca usar `innerHTML` sin sanitizar
- Usar `textContent` para texto dinámico
- Para HTML sanitizado: DOMPurify

### CSP (Content Security Policy)
Configurar en meta tags:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self'">
```

## Capacitor/Mobile

- No hardcodear URLs de API
- Usar SecureStorage para tokens sensibles
- Validar datos de plugins nativos

## Protocolo de Respuesta a Seguridad

Si se encuentra problema:
1. PARAR inmediatamente
2. Reportar en el chat
3. Corregir antes de continuar
