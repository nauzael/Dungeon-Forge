# AGENTS.md - Dungeon Forge Development Guide

This document provides guidelines for agentic coding agents working on the Dungeon Forge project.

## Project Overview

Dungeon Forge is a D&D 5e (2024 Edition) character management companion app built with React 19, TypeScript, and Tailwind CSS. It runs on web and compiles to Android/iOS via Capacitor.

## Commands

### Development
```bash
npm run dev        # Start Vite dev server (http://localhost:5173)
npm run build      # Production build to dist/
npm run preview    # Preview production build
```

### Android Build
```bash
cd android
./gradlew assembleDebug   # Build debug APK
```

### Testing
- **No test framework configured** - Do not write tests unless one is added
- If needed, recommend Vitest or React Testing Library

### Linting
- **No linter configured** - Follow existing code conventions
- TypeScript strict mode is enabled in tsconfig.json

## Code Style Guidelines

### TypeScript
- Use `strict: true` - all types must be explicit
- Use interfaces for data structures (exported from `types.ts`)
- Use `React.FC<Props>` for functional components
- Use `type` for unions, aliases, and primitives

### React Patterns
- Use functional components with hooks
- Use lazy loading for route components: `const Component = lazy(() => import('./path'))`
- Wrap lazy components in `<Suspense>`
- Use `useState<T>` and `useEffect` with proper cleanup (return cleanup functions)

### Imports
Order imports as follows:
1. React core imports: `import React, { useState, useEffect } from 'react';`
2. External libraries: `import { something } from 'library';`
3. Internal types: `import { Character, Spell } from './types';`
4. Internal constants: `import { MOCK_CHARACTERS } from './constants';`
5. Internal components: `import CharacterList from './components/CharacterList';`

### Naming Conventions
- **Components**: PascalCase (e.g., `CharacterList.tsx`, `SheetTabs.tsx`)
- **Interfaces**: PascalCase with descriptive names (e.g., `InventoryItem`, `Character`)
- **Functions**: camelCase (e.g., `handleCreateNew`, `handleSelectCharacter`)
- **Variables**: camelCase (e.g., `activeCharacter`, `characters`)
- **Files**: kebab-case for non-component files (e.g., `sheetUtils.ts`, `characterOptions.ts`)
- **CSS Classes**: Tailwind utility classes (kebab-case)

### Component Structure
```tsx
import React, { useState, useEffect } from 'react';
import { SomeType } from '../types';

interface ComponentProps {
  prop1: string;
  prop2: number;
  onAction: () => void;
}

const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2, onAction }) => {
  const [state, setState] = useState<string>('');

  useEffect(() => {
    // Side effects here
    return () => cleanup(); // Always return cleanup
  }, [dependency]);

  const handleAction = () => {
    onAction();
  };

  return (
    <div className="tailwind-classes">
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### Error Handling
- Always wrap localStorage/JSON parsing in try/catch
- Use `console.error` for logging errors
- Handle quota errors for localStorage specifically
- Use ErrorBoundary component for component tree errors

### Data Types (from types.ts)
All game data interfaces are in `types.ts`:
- `Character` - Main character data structure
- `InventoryItem` - Items with equipped status
- `Spell` - Spell definitions
- `ItemData` / `WeaponData` / `ArmorData` - Equipment data
- `ViewState` - `'list' | 'create' | 'sheet' | 'dm-dashboard' | 'observer-sheet'`
- `SheetTab` - `'combat' | 'inventory' | 'spells' | 'features' | 'notes'`
- `Ability` - `'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA'`

### Tailwind CSS
- Use dark mode with `dark:` prefix
- Use CSS variables: `bg-background-light`, `bg-background-dark`, `text-primary`
- Mobile-first responsive design
- Use Material Symbols icons: `<span className="material-symbols-outlined">icon-name</span>`

### Data Organization
- **Classes**: `Data/classes/` - One file per class (barbarian.ts, wizard.ts, etc.)
- **Species**: `Data/species/` - One file per species
- **Spells**: `Data/spells/` - Separate files by level (cantrips.ts, level1.ts, etc.)
- **Items**: `Data/items.ts` - Equipment and items
- **Feats**: `Data/feats.ts` - Feat definitions
- **Skills**: `Data/skills.ts` - Skill definitions

### State Management
- Use React useState/useReducer for local state
- Use localStorage for persistence (characters list)
- Implement debounce (1000ms) when saving to localStorage

### File Paths
- Components: `components/` (root) + `components/creator/` + `components/sheet/`
- Data: `Data/`
- Utils: `utils/`
- Constants: Root level (`constants.ts`, `types.ts`)

### UI Components
- Use Material Symbols Outlined font for icons
- Follow existing dark/light theme patterns
- Implement responsive design for mobile (max-w-md container)
- Use sticky headers with safe-area padding for mobile

## Important Notes

1. **No tests exist** - Do not write tests unless you first add a test framework
2. **Spanish/English mixed** - The codebase uses Spanish for UI text and comments
3. **Mobile-first** - Primary target is mobile web (PWA)
4. **Capacitor** - Android/iOS builds via Capacitor (configured in `capacitor.config.ts`)
5. **Google GenAI** - AI assistant integration via `@google/genai`
6. **Legacy comments** - Some comments reference 2024 D&D rules changes
7. **External APIs/Libraries** - Always use context7 to verify external library APIs and documentation before generating code

## Context7 Documentation Lookup

Use the `ctx7` CLI to fetch current documentation whenever the user asks about a library, framework, SDK, API, CLI tool, or cloud service -- even well-known ones like React, Next.js, Prisma, Express, Tailwind, Django, or Spring Boot. This includes API syntax, configuration, version migration, library-specific debugging, setup instructions, and CLI tool usage. Use even when you think you know the answer -- your training data may not reflect recent changes. Prefer this over web search for library docs.

Do not use for: refactoring, writing scripts from scratch, debugging business logic, code review, or general programming concepts.

### Steps

1. Resolve library: `npx ctx7@latest library <name> "<user's question>"`
2. Pick the best match (ID format: `/org/project`) by: exact name match, description relevance, code snippet count, source reputation (High/Medium preferred), and benchmark score (higher is better). If results don't look right, try alternate names or queries (e.g., "next.js" not "nextjs", or rephrase the question)
3. Fetch docs: `npx ctx7@latest docs <libraryId> "<user's question>"`
4. Answer using the fetched documentation

You MUST call `library` first to get a valid ID unless the user provides one directly in `/org/project` format. Use the user's full question as the query -- specific and detailed queries return better results than vague single words. Do not run more than 3 commands per question. Do not include sensitive information (API keys, passwords, credentials) in queries.

For version-specific docs, use `/org/project/version` from the `library` output (e.g., `/vercel/next.js/v14.3.0`).

If a command fails with a quota error, inform the user and suggest `npx ctx7@latest login` or setting `CONTEXT7_API_KEY` env var for higher limits. Do not silently fall back to training data.

## OpenCode Plugins Configured

The project uses several OpenCode plugins (configured in `opencode.json`):
- `@tarquinen/opencode-dcp` - DCP integration
- `opencode-google-antigravity-auth` - Auth
- `opencode-pty` - PTY support
- `@franlol/opencode-md-table-formatter` - Markdown tables
- `@zenobius/opencode-skillful` - Skills system
- `opencode-supermemory` - Memory
- `micode` - Workflow
- `octto` - Interactive UI
