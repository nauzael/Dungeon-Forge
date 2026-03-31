<div align="center">
  <img width="200" height="200" src="https://cdn-icons-png.flaticon.com/512/8232/8232560.png" alt="Dungeon Forge Logo" />
</div>

# ⚔️ Dungeon Forge

**D&D 5e (2024 Edition) Character Management Companion**

Dungeon Forge is a mobile-first web application for creating and managing D&D 5e characters. Built with React 19, TypeScript, and Capacitor for seamless Android/iOS deployment.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?logo=vite)

---

## ✨ Features

### Character Creation
- **5-Step Wizard**: Identity → Stats → Details → Skills → Review
- **Standard Array Suggestions**: Class-optimized stat distributions
- **Weapon Mastery (2024)**: Select and manage weapon masteries
- **ASI/Feat Decisions**: Choose between stat increases or feats at level-ups

### Game Management
- **Combat Tab**: HP tracking, spell slots, class resources (Rage, Bardic Inspiration, etc.)
- **Inventory Tab**: Equipment management with weapon mastery display
- **Spells Tab**: Full spell preparation and casting
- **Features Tab**: Class features with detailed descriptions
- **Notes Tab**: Campaign notes and session reminders

### Dungeon Master Tools
- **Party Dashboard**: Monitor all party members in real-time
- **Observer Mode**: Players can view their characters shared by DM
- **Shared Resources**: Broadcast maps and images to the party
- **Monster Builder**: Basic stat block creation

### Technical
- **Offline-First**: PWA with Service Worker caching
- **Cloud Sync**: Supabase real-time synchronization
- **OTA Updates**: Capacitor Updater for seamless app updates
- **Dark Theme**: Gold and dark color scheme optimized for mobile

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd dungeon-forge

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Variables

Create a `.env.local` file with your API keys:

```env
VITE_API_KEY=your_gemini_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Android Build

```bash
cd android
./gradlew assembleDebug
```

The APK will be at `android/app/build/outputs/apk/debug/`

---

## 📁 Project Structure

```
Dungeon Forge/
├── components/          # React components
│   ├── creator/         # Character creation wizard steps
│   ├── sheet/          # Character sheet tabs
│   └── dm/             # DM dashboard components
├── Data/               # Game data (classes, spells, items, etc.)
│   ├── classes/        # D&D class definitions
│   ├── species/        # Species/race definitions
│   ├── spells/         # Spell data by level
│   └── feats/          # Feat definitions
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── public/             # Static assets
└── thoughts/           # Agent workflows and designs
```

---

## 🎮 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + TypeScript |
| Styling | Tailwind CSS |
| Build | Vite |
| Mobile | Capacitor |
| Backend | Supabase |
| AI | Google Gemini |
| Icons | Material Symbols |

---

## 📖 D&D 5e (2024) Content

All content follows the **Player's Handbook 2024** rules:

- **12 Classes**: Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, Wizard
- **Weapon Mastery**: Nick, Vex, Graze, Topple, Push, Slow
- **Updated Spells**: New versions of classic spells
- **Standard Array**: Point Buy alternative for character creation

---

## 🔧 Development

### Available Scripts

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run ota        # Build + deploy OTA update
```

### Adding New Content

Game data files follow a consistent pattern:
- `Data/classes/*.ts` - Class definitions with progression
- `Data/species/*.ts` - Species with traits and subspecies
- `Data/spells/level*.ts` - Spells organized by spell level
- `Data/feats/index.ts` - All feats with English descriptions

---

## 📱 Mobile App

Dungeon Forge is designed as a **Progressive Web App (PWA)** that can be installed on mobile devices:

1. Open the app in Chrome/Safari
2. Tap "Add to Home Screen"
3. The app will work offline with full functionality

For native Android/iOS builds, see the **Android Build** section above.

---

## 📄 License

Private project - All rights reserved.

---

<div align="center">

**Forged with ⚔️ and 🔮**

_Dungeon Forge - Your Adventure Companion_

</div>
