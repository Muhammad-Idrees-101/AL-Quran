<<<<<<< HEAD
# Al-Quran Interactive MVP

A premium, high-performance Islamic Knowledge Hub built with Next.js 14+, TypeScript, and Tailwind CSS.

## 🌟 Features

### Multi-Dimensional Page Architecture

#### 1. **Discovery Dashboard** (Home)
- Glassmorphic UI with Command-K palette for omnisearch
- "Jump Back In" widget tracking last read Ayah
- Surah grid with metadata and hover previews
- Quick links to all sections

#### 2. **Reading Sanctuary** (Quran Player)
- SSG pre-rendered Surahs for instant load times
- IntersectionObserver with Zustand for active Ayah highlighting
- Audio synchronization with visual feedback
- Persistent GlobalAudioPlayer across navigation
- Settings drawer for script selection (Uthmani/Indo-Pak) and text scaling

#### 3. **Video Academy** (Scholarly Content)
- Video-on-demand interface with scholar profiles
- Filterable categories and scholar views
- "Go to Ayah" buttons linking directly to Quranic verses
- Glass-morphic cards with backdrop blur effects

#### 4. **Tafseer Library** (Deep Research)
- Split-pane or reader view for long-form text
- Multi-source Tafseer toggling without page refresh
- Framer Motion smooth transitions
- Academic study interface

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with sidebar & audio player
│   ├── page.tsx                # Discovery Dashboard (Home)
│   ├── globals.css             # Global styles & Tailwind setup
│   ├── providers.tsx           # React Query & Client-side providers
│   ├── player/
│   │   ├── page.tsx            # Player redirect page
│   │   └── [id]/page.tsx       # Individual Surah page (SSG)
│   ├── academy/
│   │   └── page.tsx            # Video Academy
│   └── tafseer/
│       └── page.tsx            # Tafseer Library
├── components/
│   ├── atoms/                  # Basic building blocks
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── GlassPanel.tsx
│   │   └── index.ts
│   ├── molecules/              # Composite components
│   │   ├── AyahCard.tsx       # Quran verse display with tafseer
│   │   ├── AcademyVideoCard.tsx
│   │   ├── OmniSearch.tsx      # Command palette
│   │   └── index.ts
│   └── organisms/              # Full-page sections
│       ├── GlobalAudioPlayer.tsx
│       ├── SettingsDrawer.tsx
│       ├── SidebarNavigation.tsx
│       ├── ContinuationCard.tsx
│       └── index.ts
├── stores/
│   ├── playerStore.ts          # Zustand player state
│   └── settingsStore.ts        # User preferences (persisted)
├── types/
│   └── quran.ts                # TypeScript interfaces
├── hooks/
│   └── useIntersectionObserver.ts
├── utils/
│   └── cn.ts                   # Class name merger
├── lib/
│   └── mockData.ts             # Sample data for development
└── styles/
    └── (optional) Custom stylesheets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
npm install
# or
pnpm install

# Run development server
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism utilities
- **State Management**: Zustand with persistence layer
- **Animations**: Framer Motion
- **Search/Command**: cmdk (Command Palette)
- **Data Fetching**: TanStack Query (React Query)
- **Development**: ESLint

## 🎨 Design System

### Color Palette
- **Primary**: Islamic Emerald (`#0D5F4F`)
- **Accent**: Islamic Gold (`#D4A574`)
- **Background**: Slate Gray (`#1E293B`, `#475569`)

### Glassmorphism Classes
- `.glass-panel` - Medium blur with borders
- `.glass-light` - Light blur effect
- `.glass-heavy` - Heavy blur with high opacity

### Typography
- Custom Quran text sizes: `quran-sm`, `quran-base`, `quran-lg`, `quran-xl`
- RTL support with `<bdo dir="rtl">`
- Font scaling via Zustand store

## 📊 State Management

### usePlayerStore
- `isPlaying`: Audio playback state
- `currentAyahId`: Active verse ID
- `playbackRate`: Speed control
- `volume`: Volume level
- `currentTime`/`duration`: Audio timing

### useSettingsStore
- `fontScale`: Text size multiplier
- `activeTheme`: Light/Dark/Sepia
- `scriptType`: Uthmani or Indo-Pak
- Persisted to localStorage

## 🎯 Key Features Implementation

### Audio Synchronization
- Global persistent player that survives navigation
- IntersectionObserver highlights active Ayah during playback
- Zustand subscriptions for reactive updates

### Search & Discovery
- cmdk command palette with grouping
- Real-time filtering across Surahs, Ayahs, Videos
- Keyboard shortcut: `Cmd/Ctrl + K`

### Responsive Design
- Mobile-first approach
- Sidebar collapsible on small screens
- Touch-optimized buttons with haptic feedback animations

## 📱 Mobile Optimization

- Responsive sidebar that collapses on mobile
- Touch-friendly button sizes (44x44px minimum)
- Optimized font sizes for different screens
- Glassmorphism adapts to device performance

## 🔄 Future Enhancements

- [ ] Backend API integration (Quran API, video streaming)
- [ ] User authentication and bookmarks
- [ ] Offline support with service workers
- [ ] Advanced search with filters
- [ ] Sharing and social features
- [ ] Multiple language support
- [ ] Accessibility improvements (a11y)

## 📝 Environment Variables

Create a `.env.local` file for any API configurations:

```env
# Backend API (optional)
NEXT_PUBLIC_API_URL=https://api.example.com
```

## 🤝 Contributing

Contributions are welcome! Please follow the atomic design principles and maintain consistent styling.

## 📄 License

© 2024 Al-Quran Interactive. All rights reserved.

---

**Notes:**
- Data is currently mocked. Integrate with a Quran API for real data.
- Audio files need to be provided separately.
- Performance optimizations: SSG for Surahs, incremental static regeneration (ISR) for videos.
=======
# AL-QURAN
The Modern Al-Quran Dashboard is a state-of-the-art web application designed to provide an immersive spiritual experience through cutting-edge web technologies. Built with a focus on UI/UX excellence, it combines high-end design aesthetics with functional depth."

Key Features:

Aesthetic UI: Premium Apple-style Glassmorphism with smooth GSAP and Framer Motion animations.

Smart Navigation: Independent sidebar scrolling for 114 Surahs with a fluid content area for Tafseer.

Multi-Scholar Video Library: Seamlessly switch between different scholars' video Tafseer for the same Surah.

Global Audio Player: Access a vast library of world-renowned Qaris with dynamic audio streaming.

Adaptive Themes: High-contrast White, Dark, and Sepia modes with an elegant, theme-responsive 'Allah' calligraphy background.

Security First: Architected with strict Environment Variable management to ensure 100% protection of API secrets.
>>>>>>> 60877cc10da72cb141aee76c608392268524058b
