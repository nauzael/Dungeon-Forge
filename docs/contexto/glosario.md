# Glosario

## Términos del Dominio (D&D 5e 2024)

| Término | Significado |
|---------|-------------|
| **Ability** | Característica: STR, DEX, CON, INT, WIS, CHA |
| **AC** | Armor Class (Clase de Armadura) |
| **Background** | Trasfondo del personaje (origen, habilidades, equipo) |
| **Cantrip** | Truco (hechizo nivel 0, se lanza sin slot) |
| **CR** | Challenge Rating (índice de desafío para bestias/monstruos) |
| **Feat** | Dote (talento especial, categorías: Origin, General, Fighting Style, Epic Boon) |
| **Focus** | Puntos de enfoque (Monje — Ki en 2024) |
| **Hit Dice** | Dados de golpe (para curarse en descansos cortos) |
| **HP** | Hit Points (Puntos de Golpe): `{ current, max, temp }` |
| **Inspiration** | Inspiración Heroica (Heroic Inspiration) |
| **Pact Magic** | Magia de Pacto (Warlock) — slots que se recuperan en descanso corto |
| **Prepared Spells** | Hechizos preparados del día |
| **Proficiency Bonus** | Bono de competencia (escala con nivel) |
| **Rage** | Ira (Barbarian) |
| **Rest** | Descanso: Short Rest (1h) o Long Rest (8h) |
| **Savant** | Especialista (Wizard) — hechizos gratuitos de escuela |
| **School** | Escuela de magia (Abjuration, Evocation, etc.) |
| **Slot** | Espacio de conjuro (nivel 1-9) |
| **Sorcery Points** | Puntos de Hechicería (Sorcerer) |
| **Species** | Especie (Human, Elf, Dwarf, etc. — antes "race") |
| **Spellbook** | Libro de conjuros (Wizard) |
| **Subclass** | Subclase (ej: Berserker para Barbarian, Evoker para Wizard) |
| **Subspecies** | Subespecie (ej: High Elf, Wood Elf) |
| **Wild Shape** | Forma Salvaje (Druida) |
| **Spell Mastery** | Dominio de conjuros (Wizard Lv18) |

## Entidades del Sistema

| Entidad | Descripción | Almacenamiento |
|---------|-------------|----------------|
| **Character** | Personaje jugador (~80 campos) | Firestore `characters/{id}` + RTDB broadcast |
| **Party** | Mesa de juego grupal | Firestore `parties/{partyId}` |
| **CampaignResource** | Recurso compartido (mapa, NPC, item) | Firestore `party_resources/{id}` |
| **InventoryItem** | Item en inventario | Array dentro de `Character.inventory[]` |
| **FeatureUsage** | Contador de uso genérico de rasgos | `Character.featureUsages` (Map<string, FeatureUsage>) |
| **BeastStats** | Estadísticas de bestia para Wild Shape | Data/beasts.ts |
| **InitiativeCombatant** | Combatiente en orden de iniciativa | React state local |

## Siglas Internas

| Sigla | Significado |
|-------|-------------|
| **RTDB** | Firebase Realtime Database |
| **OTA** | Over-The-Air update (Capacitor Updater) |
| **SPA** | Single Page Application |
| **PWA** | Progressive Web App |
| **TDZ** | Temporal Dead Zone (bug de JS async) |
| **DM** | Dungeon Master |
| **THP** | Temporary Hit Points |
| **SW** | Service Worker |
| **DS** | Design System |

## Estados de Vista

| ViewState | Descripción |
|-----------|-------------|
| `list` | Lista de personajes |
| `create` | Wizard de creación (5 pasos) |
| `sheet` | Hoja de personaje con pestañas |
| `dm-dashboard` | Panel de Dungeon Master |
| `observer-sheet` | Hoja de solo lectura (party) |

## SheetTabs

| Tab | Contenido |
|-----|-----------|
| combat | HP, AC, iniciativa, ataques, recursos de clase |
| inventory | Equipo, dinero, armas, armaduras |
| spells | Conjuros preparados, slots, grimorio (Wizard) |
| features | Rasgos, dotes, habilidades raciales |
| notes | Notas del jugador con sistema de tags |
