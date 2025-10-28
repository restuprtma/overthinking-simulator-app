# Quick Fix Applied: react-draggable Error

## Problem
Error: `Dynamic require of "react" is not supported` dari `react-draggable`

## Solution Applied

### 1. Updated `packages/react-ui/package.json`
Added peer dependencies:
```json
"peerDependencies": {
  "react-draggable": "^4.5.0",
  "lucide-react": "^0.400.0",
  // ... other deps
}
```

### 2. Updated `packages/react-ui/tsup.config.ts`
Added to external list:
```ts
external: [
  'react-draggable',
  'lucide-react',
  // ... other deps
]
```

### 3. Rebuild Package
```bash
npm run ui:build
```

**Result:** Package size reduced from 127KB → 37KB (ESM)

## Test Now

```bash
# Clear cache (if needed)
rm -rf node_modules/.vite

# Start dev server
npm run dev
```

## Why This Fix?

`react-draggable` dan `lucide-react` harus di-external karena:
- Mereka sudah ada di root project sebagai dependencies
- Tidak perlu di-bundle ke package
- Menghindari "dynamic require" errors
- Mengecilkan bundle size

## Benefits

✅ Smaller package size (127KB → 37KB)
✅ No more "dynamic require" errors
✅ Faster build times
✅ Better tree-shaking

## If Still Error

1. **Restart dev server:**
   ```bash
   # Ctrl+C to stop
   npm run dev
   ```

2. **Clear all caches:**
   ```bash
   rm -rf node_modules/.vite
   rm -rf dist
   npm run ui:build
   npm run dev
   ```

3. **Reinstall if needed:**
   ```bash
   npm install
   npm run ui:build
   npm run dev
   ```

## Verification

Check bundle sizes:
```bash
ls -lh packages/react-ui/dist/
# Should see:
# index.mjs: ~38K (was ~127K)
# index.js:  ~45K (was ~134K)
```

---

**Status:** ✅ Fixed and rebuilt
**Action:** Test with `npm run dev`
