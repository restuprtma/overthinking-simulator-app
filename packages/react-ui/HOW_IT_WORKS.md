# Bagaimana @venturo/react-ui Bisa Langsung Dipakai?

## 🤔 Pertanyaan: Kok bisa import dari `@venturo/react-ui`?

```tsx
// Di src/App.tsx
import { Button } from '@venturo/react-ui';  // ← Kenapa ini bisa?
```

Padahal packagenya belum di-publish ke NPM!

---

## 🔑 Jawabannya: **NPM Workspaces**

### 1. **Root package.json** punya setting ini:

```json
{
  "name": "venturo-react-vite-ts",
  "workspaces": [
    "packages/*"     // ← Ini yang bikin magic!
  ]
}
```

### 2. **NPM Workspaces Cara Kerjanya:**

Ketika Anda run `npm install`, npm akan:

```
1. Scan folder "packages/*"
2. Menemukan "packages/react-ui/package.json"
3. Baca nama package: "@venturo/react-ui"
4. Otomatis "link" package itu ke node_modules
```

### 3. **Hasilnya:**

```
node_modules/
└── @venturo/
    └── react-ui -> ../../packages/react-ui  (symlink!)
```

**Symlink** = Shortcut/alias ke folder asli

---

## 🔍 Bukti: Mari Kita Cek!

### Check 1: Lihat symlink di node_modules

```bash
ls -la node_modules/@venturo/
```

Output:
```
lrwxr-xr-x  1 user  staff  react-ui -> ../../packages/react-ui
```

Tanda `->` artinya **symlink** (pointer ke folder lain)

### Check 2: Verify dengan npm list

```bash
npm list @venturo/react-ui
```

Output:
```
venturo-react-vite-ts@2.0.0
└── @venturo/react-ui@1.0.0 -> ./packages/react-ui
```

Lihat tanda `->` ? Itu artinya **linked** ke local folder!

### Check 3: Cek isi symlink

```bash
readlink node_modules/@venturo/react-ui
```

Output:
```
../../packages/react-ui
```

Ini membuktikan bahwa `node_modules/@venturo/react-ui` adalah **alias** ke `packages/react-ui`

---

## 📊 Flow Diagram

### Ketika Anda Import:

```
src/App.tsx
  │
  ├─ import { Button } from '@venturo/react-ui'
  │
  └─→ Vite/Node resolves: node_modules/@venturo/react-ui
        │
        └─→ Follow symlink: packages/react-ui
              │
              └─→ Read: packages/react-ui/dist/index.mjs
                    │
                    └─→ Get: Button component ✅
```

### Visual Structure:

```
lakukan-fe/
│
├── node_modules/
│   └── @venturo/
│       └── react-ui/  ───────────┐  (symlink)
│                                  │
├── packages/                      │
│   └── react-ui/  ←───────────────┘  (actual folder)
│       ├── src/           ← Edit di sini
│       ├── dist/          ← Import dari sini
│       └── package.json   ← Name: @venturo/react-ui
│
└── src/
    └── App.tsx
        └── import from '@venturo/react-ui'  ← Works!
```

---

## 🎯 Kenapa Pakai Workspaces?

### Tanpa Workspaces (Manual npm link):

```bash
# Dari packages/react-ui
npm link

# Dari root project
npm link @venturo/react-ui
```

❌ Ribet, harus manual tiap kali
❌ Bisa lupa re-link setelah install
❌ Team member lain harus setup manual

### Dengan Workspaces:

```bash
npm install  # Done! Otomatis ter-link
```

✅ Otomatis
✅ Team-friendly
✅ Consistent untuk semua developer
✅ Standard practice untuk monorepo

---

## 🔧 Bagaimana Build Process Bekerja?

### 1. **Development Mode**

```bash
# Terminal 1: Watch mode
npm run ui:dev
# → Rebuild packages/react-ui/dist/ setiap ada perubahan

# Terminal 2: Dev server
npm run dev
# → Import dari packages/react-ui/dist/ (via symlink)
```

**Flow:**
```
Edit packages/react-ui/src/Button.tsx
  ↓
tsup rebuild → packages/react-ui/dist/index.mjs
  ↓
Vite detects change
  ↓
Hot reload browser ✅
```

### 2. **Import Resolution**

Ketika Vite sees:
```tsx
import { Button } from '@venturo/react-ui';
```

Vite resolves:
```
1. Look in node_modules/@venturo/react-ui
2. Found symlink → follow to packages/react-ui
3. Read package.json:
   {
     "main": "./dist/index.js",
     "module": "./dist/index.mjs",  ← Vite uses this (ESM)
     "types": "./dist/index.d.ts"
   }
4. Import from packages/react-ui/dist/index.mjs
5. Done! ✅
```

---

## 🧪 Experiment: Lihat Sendiri!

### Test 1: Check Symlink

```bash
# Lihat symlink
ls -la node_modules/@venturo/

# Follow symlink dan lihat isinya
ls -la node_modules/@venturo/react-ui/

# Compare dengan aslinya
ls -la packages/react-ui/

# Hasilnya SAMA! Karena symlink.
```

### Test 2: Edit & See Live Update

```bash
# Terminal 1: Watch mode
npm run ui:dev

# Terminal 2: Dev server
npm run dev

# Terminal 3: Edit file
echo "// test comment" >> packages/react-ui/src/Button/Button.tsx

# Lihat:
# 1. Terminal 1 rebuild otomatis
# 2. Browser reload otomatis
# 3. Changes langsung terlihat!
```

### Test 3: Break the Symlink (Don't Actually Do This!)

```bash
# Hapus symlink (JANGAN betulan!)
rm node_modules/@venturo/react-ui

# Try dev server
npm run dev
# ❌ ERROR: Cannot find module '@venturo/react-ui'

# Fix: Reinstall (recreate symlink)
npm install
# ✅ Works again!
```

---

## 📦 Package.json Role

### packages/react-ui/package.json

```json
{
  "name": "@venturo/react-ui",    // ← Ini yang di-import
  "main": "./dist/index.js",      // ← CommonJS entry
  "module": "./dist/index.mjs",   // ← ESM entry (Vite uses this)
  "types": "./dist/index.d.ts",   // ← TypeScript definitions
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "require": "./dist/index.js",   // Node.js require()
      "import": "./dist/index.mjs"    // ESM import (Vite)
    }
  }
}
```

**Ini memberitahu Node/Vite:**
- Nama package: `@venturo/react-ui`
- Dimana entry point: `dist/index.mjs` (untuk ESM)
- Dimana types: `dist/index.d.ts`

---

## 🎭 Compare: Local vs Published

### Local Package (Sekarang):

```bash
npm install
# → Creates symlink: node_modules/@venturo/react-ui -> packages/react-ui

import { Button } from '@venturo/react-ui'
# → Reads from: packages/react-ui/dist/index.mjs
```

### Published Package (Setelah npm publish):

```bash
npm install @venturo/react-ui
# → Downloads from: https://registry.npmjs.org/@venturo/react-ui
# → Installs to: node_modules/@venturo/react-ui (REAL folder, bukan symlink)

import { Button } from '@venturo/react-ui'
# → Reads from: node_modules/@venturo/react-ui/dist/index.mjs
```

**Import statement SAMA!** Yang beda hanya source foldernya:
- Local: symlink → packages/react-ui
- Published: real folder dari NPM

---

## 🔗 NPM Workspaces Features

### 1. **Auto-linking**
```bash
npm install  # Otomatis link semua packages/*
```

### 2. **Run scripts di workspace specific**
```bash
npm run build --workspace=@venturo/react-ui
# = cd packages/react-ui && npm run build
```

### 3. **Install dependencies untuk specific workspace**
```bash
npm install lodash --workspace=@venturo/react-ui
# Install lodash di packages/react-ui/package.json
```

### 4. **List workspaces**
```bash
npm list --workspaces
```

---

## 🎓 Kesimpulan

### Pertanyaan: Kenapa `import { Button } from '@venturo/react-ui'` bisa?

**Jawaban:**

1. **NPM Workspaces** di root package.json
   ```json
   "workspaces": ["packages/*"]
   ```

2. **npm install** otomatis buat **symlink**:
   ```
   node_modules/@venturo/react-ui -> packages/react-ui
   ```

3. **Vite/Node resolve** import:
   ```
   @venturo/react-ui
     → node_modules/@venturo/react-ui
       → (follow symlink)
         → packages/react-ui/dist/index.mjs
   ```

4. **Import works!** ✅

---

## 🎯 Key Takeaways

| Konsep | Penjelasan |
|--------|------------|
| **Workspaces** | Feature npm untuk manage multiple packages dalam satu repo |
| **Symlink** | Shortcut/alias ke folder lain (bukan copy!) |
| **@venturo/react-ui** | Nama package di packages/react-ui/package.json |
| **node_modules** | Berisi symlink ke packages/react-ui |
| **Import path** | Sama untuk local dan published package |
| **dist/** | Folder hasil build yang di-import |

---

## 🚀 Magic Summary

```
Edit:     packages/react-ui/src/Button.tsx
Build:    packages/react-ui/dist/index.mjs
Symlink:  node_modules/@venturo/react-ui → packages/react-ui
Import:   import { Button } from '@venturo/react-ui'
Resolve:  packages/react-ui/dist/index.mjs
Result:   Works! ✅
```

**Ini adalah power of NPM Workspaces!** 🎉

---

Sekarang paham? Intinya:
- ✅ Workspaces = auto-link local packages
- ✅ Symlink = shortcut ke packages/react-ui
- ✅ Import works karena Node/Vite follow symlink
- ✅ Sama persis seperti package dari NPM, tapi local!
