# Task 003: Settings Component - Crear panel de configuración

## Objetivo

Crear un componente de Settings accesible desde cualquier pantalla que permita cambiar el idioma.

## BDD Scenario

```gherkin
Scenario: Usuario abre Settings y cambia idioma
  Given el usuario está en cualquier pantalla de la app
  When hace clic en el botón de Settings
  Then aparece un modal con opciones de configuración
  And incluye un toggle para cambiar entre Español e Inglés
  When el usuario cambia el toggle a Inglés
  Then el idioma de la app cambia a inglés inmediatamente
  And el modal se cierra o actualiza para mostrar el estado
```

## Pasos

1. Crear componente `components/Settings.tsx`:
   - Modal/Sheet con toggle de idioma
   - Usa el hook useLanguage
   - Estilo consistente con la app (dark mode)

2. Agregar botón de Settings en `SheetTabs.tsx`

3. El toggle debe mostrar: "Español" / "English"

## Archivos a crear

- `components/Settings.tsx`

## Archivos a modificar

- `components/SheetTabs.tsx`

## Verificación

- Abrir Settings y verificar que el toggle funciona
- Verificar cambio de idioma inmediato

Depende de: task-002-language-context
