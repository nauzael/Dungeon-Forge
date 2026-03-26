# Task 002: Language Context - Crear sistema de contexto de idioma

## Objetivo

Crear un hook que permita a toda la aplicación acceder al idioma actual y cambiarlo.

## BDD Scenario

```gherkin
Scenario: Usuario cambia idioma a inglés
  Given la aplicación está en español
  When el usuario cambia el idioma a inglés en Settings
  Then todo el contenido se muestra en inglés
  And la preferencia se guarda en localStorage

Scenario: Usuario cambia idioma a español
  Given la aplicación está en inglés
  When el usuario cambia el idioma a español en Settings
  Then todo el contenido se muestra en español
  And la preferencia se guarda en localStorage

Scenario: La aplicación recuerda el idioma al recargar
  Given el usuario cambió el idioma a inglés
  When el usuario recarga la página
  Then la aplicación sigue en inglés
```

## Pasos

1. Crear `hooks/useLanguage.tsx` con:
   - LanguageContext con valor 'es' | 'en'
   - useLanguage hook para acceder al contexto
   - LanguageProvider que lee/graba de localStorage
   - Función toggleLanguage() para cambiar idioma

2. Integrar en `App.tsx` envolviendo toda la app

## Archivos a crear

- `hooks/useLanguage.tsx`

## Archivos a modificar

- `App.tsx`

## Verificación

- Cambiar idioma y verificar que se persiste al recargar
- Verificar que el estado cambia correctamente

Depende de: task-001-setup-structure
