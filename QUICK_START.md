# 🚀 Quick Start & Troubleshooting Guide

## Quick Start - 5 Minutes to Running

### 1. Install Dependencies
```bash
npm install
```
or 
```bash
pnpm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to `http://localhost:3000`

### 4. Start Exploring
- Click "Search Quran..." to try the command palette
- Browse Surahs from the grid
- Click any Surah to enter the Reader
- Explore Academy and Tafseer sections

---

## Project Structure Quick Reference

```
/src
  /app                 ← All pages (App Router)
  /components          ← Reusable UI
    /atoms             ← Basic components (Button, Badge, GlassPanel)
    /molecules         ← Composite (AyahCard, VideoCard, OmniSearch)
    /organisms         ← Full sections (Player, Settings, Sidebar)
  /stores              ← Zustand state management
  /hooks               ← Custom React hooks
  /lib                 ← Utilities and mockData
  /types               ← TypeScript interfaces
  /utils               ← Helper functions
  /styles              ← CSS files
```

---

## Key Files to Know

### State Management
- `src/stores/playerStore.ts` - Audio playback state
- `src/stores/settingsStore.ts` - User settings (persisted)

### Main Pages
- `src/app/page.tsx` - Home/Discovery Dashboard
- `src/app/player/[id]/page.tsx` - Quran Reader (dynamic)
- `src/app/academy/page.tsx` - Video Academy
- `src/app/tafseer/page.tsx` - Tafseer Library

### Layout
- `src/app/layout.tsx` - Root layout with sidebar & audio player
- `src/app/globals.css` - Global styles

---

## Development Tips

### Accessing Stores
```typescript
// In a client component
'use client';
import { usePlayerStore } from '@/stores/playerStore';

export default function MyComponent() {
  const { isPlaying, setIsPlaying } = usePlayerStore();
  
  return (
    <button onClick={() => setIsPlaying(!isPlaying)}>
      {isPlaying ? 'Pause' : 'Play'}
    </button>
  );
}
```

### Adding New Surahs
Edit `src/lib/mockData.ts` and add to the `SURAHS` array. Note: Only add Surahs between 1-114.

### Creating New Components
Follow atomic design:
- Atoms: Small, reusable components (Button)
- Molecules: Combinations of atoms (AyahCard)
- Organisms: Full features (GlobalAudioPlayer)

```typescript
// example: atoms/MyButton.tsx
'use client';
import { cn } from '@/utils/cn';

interface MyButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const MyButton: React.FC<MyButtonProps> = ({ variant = 'primary', children }) => {
  return (
    <button className={cn(
      'px-4 py-2 rounded-lg font-semibold transition-all',
      variant === 'primary' ? 'bg-islamic-emerald text-white' : 'bg-islamic-gold text-dark'
    )}>
      {children}
    </button>
  );
};
```

### Responsive Design
- Mobile first (default styles for mobile)
- Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`

```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 column on mobile, 2 on sm, 3 on lg */}
</div>
```

---

## Common Issues & Solutions

### Issue: "usePlayerStore is undefined"
**Solution:** Make sure component has `'use client'` at the top if using stores in client components.

### Issue: "Tailwind styles not applying"
**Solution:** 
1. Check if class is in `content` array in `tailwind.config.ts`
2. Restart dev server (sometimes needed after config changes)
3. Try using full class name (no string interpolation in classes)

### Issue: "Audio player not showing"
**Solution:** 
1. Set audio URL: `setAudioUrl('https://...')`
2. Make sure `setIsPlaying(true)` is called
3. Check browser console for errors

### Issue: "Types not recognized"
**Solution:** 
1. Check `tsconfig.json` paths are correct
2. Import from correct location: `import type { Ayah } from '@/types/quran'`
3. Run `npm run type-check` to validate

### Issue: "Sidebar not showing on desktop"
**Solution:** Check `src/components/organisms/SidebarNavigation.tsx` - verify `isOpen={true}` prop

### Issue: "Settings not persisting"
**Solution:** Check browser localStorage is enabled (DevTools → Application → Local Storage)

---

## Environment Variables

Create `.env.local` in project root:
```env
# Optional: Your Quran API endpoint
NEXT_PUBLIC_API_URL=https://api.example.com

# Optional: Analytics ID
NEXT_PUBLIC_ANALYTICS_ID=
```

---

## Build & Production

### Build
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Type Check
```bash
npm run type-check
```

### Lint
```bash
npm run lint
```

---

## Next.js Commands Cheat Sheet

```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
npm run type-check       # Type-check TypeScript
```

---

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD npm start
```

### Environment Variables for Deployment
Set in your platform's environment settings:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_QURAN_API`
- Any other `NEXT_PUBLIC_*` variables

---

## Useful VS Code Extensions

- **ES7+ React/Redux/React-Native snippets** - dsznajder.es7-react-js-snippets
- **Tailwind CSS IntelliSense** - bradlc.vscode-tailwindcss
- **TypeScript Vue Plugin** - Vue.volar (if adding Vue later)
- **Prettier** - esbenp.prettier-vscode

---

## Browser DevTools Tips

### React DevTools
- Inspect component hierarchy
- Check props and state
- Modify state directly for testing

### Network Tab
- Monitor API calls (when integrated)
- Check audio streaming

### Application Tab (IndexedDB, LocalStorage)
- View persisted settings
- View continuation data
- Clear cache if needed

### Performance Tab
- Check Core Web Vitals
- Find rendering bottlenecks

---

## Testing Locally

### Test Responsiveness
```
Chrome DevTools → Toggle device toolbar (Ctrl+Shift+M)
```

### Test with Lighthouse
```
Chrome DevTools → Lighthouse tab → Generate report
```

### Test Accessibility
```
Chrome DevTools → Lighthouse tab → Enable accessibility audit
```

---

## Git Setup (Optional)

```bash
# Initialize git (first time)
git init

# Commit initial scaffolding
git add .
git commit -m "Initial Al-Quran MVP scaffolding"

# Add remote (if using GitHub)
git remote add origin https://github.com/yourusername/al-quran-interactive.git
git branch -M main
git push -u origin main
```

---

## Performance Tips

1. **Use Image Optimization**: `next/image` for all images
2. **Code Splitting**: Dynamic imports for heavy components
   ```typescript
   const HeavyComponent = dynamic(() => import('@/components/Heavy'), {
     loading: () => <p>Loading...</p>,
   });
   ```
3. **useCallback**: Memoize callbacks passed to child components
4. **Zustand Selectors**: Use selectors to avoid unnecessary re-renders
   ```typescript
   const isPlaying = usePlayerStore((state) => state.isPlaying);
   ```

---

## Useful Resources

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Zustand**: https://github.com/pmndrs/zustand
- **Framer Motion**: https://www.framer.com/motion/
- **cmdk**: https://cmdk.paco.sh

---

## Support & Debugging

### Enable Verbose Logging
```bash
# In terminal while dev server is running
npm run dev -- --debug
```

### Check Next.js version
```bash
npm list next
```

### Update Dependencies
```bash
npm outdated        # See what can be updated
npm update          # Update packages
```

### Clear Cache
```bash
rm -rf .next        # Remove build cache
rm -rf node_modules # Remove all dependencies (then npm install)
```

---

## Final Checklist Before Going Live

- [ ] Run `npm run build` successfully
- [ ] Run `npm run type-check` with no errors
- [ ] Run `npm run lint` with no errors
- [ ] Test on mobile browsers
- [ ] Test on slow 4G (DevTools → Throttling)
- [ ] All pages load without errors
- [ ] Audio player functions correctly
- [ ] Settings persist properly
- [ ] Navigation works smoothly

---

**You're all set! Happy coding! 🌙**

*For more help, check README.md and DEVELOPMENT_CHECKLIST.md*
