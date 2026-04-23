# 🎯 Gem-Team: Guía Rápida para Dungeon Forge

**Instalación:** ✅ Completada (20 de Abril, 2026)  
**Ubicación:** `tools/gem-team/`  

---

## 🚀 ¿Qué es Gem-Team?

**Gem Team** es un **framework de orquestación multi-agente** para desarrollo spec-driven.

### ¿Por qué es útil?

✅ **4x más rápido** - Ejecutión paralela con agents  
✅ **Mejor calidad** - Agents especializados + TDD + verification  
✅ **Seguridad integrada** - OWASP scanning, detección de secrets  
✅ **Visibilidad total** - Status en tiempo real, approval gates  
✅ **Auto-corrección** - Los agents se autocritican  
✅ **Spec-driven** - Define el "qué" antes del "cómo"  

---

## 🎮 Cómo Usar para Multiclases

### Paso 1: Acceso a Gem-Team

**Opción A: VS Code / Cursor / Claude Code**
```
Se integra automáticamente como un agent en tu editor
Mira la paleta de comandos (Ctrl+Shift+P) para "Gem Team"
```

**Opción B: CLI (Command Line)**
```bash
cd tools/gem-team
# Sigue las instrucciones en README.md
```

### Paso 2: Crear un Plan para Multiclases

En lugar de solo leer `PLAN-MULTICLASS-IMPLEMENTATION.md`, puedes usar gem-team para:

```
1. Define spec (qué quieres implementar)
   → Gem Team genera un plan detallado
   → Divide en tasks paralelas
   → Asigna a agents especializados

2. Ejecución
   → Agents trabajan en paralelo
   → Verificación automática
   → Approval gates antes de merge

3. Verificación
   → Todas las características testeadas
   → Documentación generada automáticamente
   → Link entre requirements → tasks → tests → código
```

### Paso 3: Especificación para Multiclases

Si quieres que Gem Team ayude, crea un archivo `MULTICLASS-SPEC.md`:

```markdown
# SPEC: Sistema de Multiclases

## Objetivo
Permitir personajes con múltiples clases D&D 5e (2024)

## Requisitos Funcionales
1. Character.classes = array de {class, level, subclass}
2. HP suma de cada clase según Hit Dice
3. profBonus = basado en nivel total
4. Features se agrupan por clase de origen
5. Spell slots por multiclass casting rules

## Requisitos No Funcionales
- TypeScript strict
- Backward compatible con personajes existentes
- No rompe app existente

## Criterios de Aceptación
- [ ] Types actualizados
- [ ] HP calcula correctamente
- [ ] Features se muestran correctamente
- [ ] Spell slots correctos
- [ ] Build sin errores
- [ ] Tests pasan
```

### Paso 4: Ejecutar Gem-Team

```bash
# Una vez hayas definido la spec, ejecuta en tu editor:
# "Gem Team: Plan Implementation" (o similar, según tu IDE)
```

Gem Team entonces:
1. 📋 Analiza la spec
2. 🎯 Crea un plan detallado
3. 👥 Asigna tasks a agents
4. ⚙️ Ejecuta en paralelo
5. ✅ Verifica el resultado

---

## 📖 Documentación Completa

Para más detalles sobre Gem-Team, consulta:
- `tools/gem-team/README.md` - Documentación oficial
- `tools/gem-team/CONTRIBUTING.md` - Cómo contribuir
- `tools/gem-team/CHANGELOG.md` - Historial de cambios

---

## 🔧 Instalación en tu IDE

### VS Code / Cursor / Claude Code
```
1. Abre tu editor
2. Paleta de comandos: Ctrl+Shift+P
3. Busca "Install Extensions"
4. Instala "Gem Team" o busca en extensions
```

### OpenCode
```
Soporta plugin de Gem-Team (.opencode-plugin/)
```

### Atom
```
Usa Atom Package Manager (.apm/)
```

---

## 💡 Ejemplo: Planificar Multiclases con Gem-Team

### Sin Gem-Team:
1. Leo PLAN-MULTICLASS-IMPLEMENTATION.md (15 min)
2. Copio tasks manualmente (10 min)
3. Empiezo a coder sin saber el alcance exacto

### Con Gem-Team:
1. Defino spec (MULTICLASS-SPEC.md)
2. Ejecuto "Gem Team: Plan"
3. Gem-Team genera:
   - Plan detallado con tareas paralelas
   - Estimaciones automáticas
   - Dependency graphs
   - Risk analysis
   - Verification gates
4. Ejecuto el plan

**Resultado:** Más rápido, mejor calidad, menos sorpresas. ✅

---

## 🚀 Próximos Pasos

1. **Lee** `tools/gem-team/README.md` (5 min)
2. **Instala** en tu IDE si no está automático
3. **Crea** un spec para tu próxima feature
4. **Ejecuta** "Gem Team: Plan"
5. **Verifica** el plan generado
6. **Itera** según sea necesario

---

## 🆘 Ayuda

- **Documentación oficial:** https://github.com/mubaidr/gem-team
- **Issues:** https://github.com/mubaidr/gem-team/issues
- **Docs aquí:** `tools/gem-team/README.md`

---

**¿Listo para usar Gem-Team?** 🎯

Puedes:
1. **Planificar multiclases** con spec-driven development
2. **Ejecutar en paralelo** con agents
3. **Verificar automáticamente** el resultado
4. **Documentar** todo automáticamente

¡Comencemos! 🚀
