---
description: "Web security - CSP, XSS, HTTPS headers, forms"
alwaysApply: true
---

# Web Security - Dungeon Forge

## HTTPS y Headers

Headers de seguridad para producción:
```html
<meta http-equiv="Strict-Transport-Security" content="max-age=31536000">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="DENY">
```

## XSS Prevention

- Nunca `innerHTML` sin sanitizar
- Usar `textContent` para texto dinámico
- Para HTML necesario: DOMPurify

```typescript
import DOMPurify from 'dompurify';

const safeHTML = DOMPurify.sanitize(userProvidedHTML);
```

## Third-Party Scripts

- Cargar async/defer
- Usar SRI para CDNs
- Auditar regularmente

## Forms

- CSRF protection
- Rate limiting
- Validación client y server
- Honeypot fields para spam

## Capacitor Security

- No hardcodear URLs
- Validar datos de plugins
- Usar secure storage para tokens
- SANITIZE inputs de nativo a web

## Secrets en React

```typescript
// ✅ Bien
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

// ❌ Nunca
const apiKey = "sk-xxxxx";
```

## CSP (Content Security Policy)

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               connect-src 'self' https://*.supabase.co; 
               img-src 'self' data: https:;">
```
