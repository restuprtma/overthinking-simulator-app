# Setup Summary: @venturo/react-ui Package

## ✅ Setup Berhasil!

Package `@venturo/react-ui` telah berhasil dibuat dan siap untuk dipublish ke NPM.

## 📁 Struktur Project

```
lakukan-fe/
├── packages/
│   └── react-ui/                    # NPM Package
│       ├── src/                     # Source components
│       │   ├── Alert/
│       │   ├── AlertDialogConfirmation/
│       │   ├── Badge/
│       │   ├── Box/
│       │   ├── Button/
│       │   ├── Card/
│       │   ├── Checkbox/
│       │   ├── Chip/
│       │   ├── CircularProgress/
│       │   ├── Dialog/
│       │   ├── Divider/
│       │   ├── Drawer/
│       │   ├── Form/
│       │   ├── FormHelperText/
│       │   ├── Grid/
│       │   ├── IconButton/
│       │   ├── Paper/
│       │   ├── Select/
│       │   ├── Snackbar/
│       │   ├── Stack/
│       │   ├── Table/
│       │   ├── TablePagination/
│       │   ├── Tabs/
│       │   ├── TextField/
│       │   ├── Typography/
│       │   ├── index.ts             # Main export
│       │   └── utils.ts             # Utility functions
│       ├── dist/                    # Build output (generated)
│       │   ├── index.js             # CommonJS
│       │   ├── index.mjs            # ES Modules
│       │   ├── index.d.ts           # Type definitions
│       │   └── *.map                # Source maps
│       ├── package.json             # Package config
│       ├── tsconfig.json            # TypeScript config
│       ├── tsup.config.ts           # Build config
│       ├── .npmignore               # NPM ignore rules
│       ├── README.md                # Package documentation
│       ├── PUBLISH_GUIDE.md         # Publishing guide
│       └── LICENSE                  # MIT License
├── src/                             # Project utama
│   └── shared/
│       └── components/
│           └── venturo-ui/          # Original components (masih ada)
├── package.json                     # Root config (dengan workspaces)
└── PACKAGE_SETUP_SUMMARY.md         # This file
```

## 🎯 Cara Kerja

### 1. Development di Project Ini

Komponen ada di 2 tempat:
- **`src/shared/components/venturo-ui/`** - Original (untuk project ini)
- **`packages/react-ui/src/`** - Package copy (untuk publish)

**Workflow Recommended:**

**Opsi A: Develop di package, sync ke project**
```bash
# 1. Edit di packages/react-ui/src/
# 2. Build package
npm run ui:build

# 3. Import di project dari package
import { Button } from '@venturo/react-ui';
```

**Opsi B: Develop di project, sync ke package**
```bash
# 1. Edit di src/shared/components/venturo-ui/
# 2. Copy ke package saat siap publish
cp -r src/shared/components/venturo-ui/* packages/react-ui/src/

# 3. Build dan publish
npm run ui:build
npm run ui:publish
```

### 2. Development Mode

```bash
# Watch mode - rebuild otomatis
npm run ui:dev
```

### 3. Build Package

```bash
# Build untuk production
npm run ui:build
```

Output:
- `dist/index.js` - CommonJS (untuk Node.js)
- `dist/index.mjs` - ES Modules (untuk modern bundlers)
- `dist/index.d.ts` - TypeScript definitions
- Source maps untuk debugging

## 📦 Publishing ke NPM

### Persiapan (Sekali saja)

1. **Login ke NPM:**
```bash
npm login
```

2. **Buat Organisasi (jika belum ada):**
   - Buka https://www.npmjs.com/org/create
   - Buat organisasi dengan nama `venturo`
   - Atau gunakan username Anda langsung

3. **Update package.json:**
```json
{
  "name": "@venturo/react-ui",  // atau @your-username/react-ui
  "version": "1.0.0"
}
```

### Publish Steps

```bash
# 1. Increment version
cd packages/react-ui
npm version patch  # atau minor, atau major

# 2. Build
npm run ui:build

# 3. Publish
npm run ui:publish

# Atau manual:
cd packages/react-ui
npm publish --access public
```

### Update & Re-publish

```bash
# 1. Edit komponen di packages/react-ui/src/
# 2. Increment version
cd packages/react-ui
npm version patch  # 1.0.0 → 1.0.1

# 3. Build & publish
cd ../..
npm run ui:build
npm run ui:publish
```

## 🔄 Menggunakan Package di Project Lain

### Install

```bash
npm install @venturo/react-ui
```

### Peer Dependencies

```bash
npm install react react-dom @mui/material @emotion/react @emotion/styled react-hook-form
```

### Usage

```tsx
import { Button, Form, Card, useSnackbar } from '@venturo/react-ui';

function App() {
  return (
    <Card>
      <Button color="primary">Click me</Button>
    </Card>
  );
}
```

### Update Package

```bash
# Update ke versi terbaru
npm update @venturo/react-ui

# Atau install versi spesifik
npm install @venturo/react-ui@1.2.3
```

## 🛠️ NPM Scripts Tersedia

Di **root project** (`package.json`):

```bash
npm run ui:build    # Build package
npm run ui:dev      # Watch mode untuk development
npm run ui:publish  # Publish ke NPM
```

Di **package** (`packages/react-ui/package.json`):

```bash
npm run build           # Build package
npm run dev             # Watch mode
npm run lint            # Lint kode
npm run type-check      # Check TypeScript errors
```

## 📝 Files Penting

### package.json (Package)
- **name**: `@venturo/react-ui` - nama package di NPM
- **version**: Semantic versioning (1.0.0)
- **exports**: Entry points untuk CJS dan ESM
- **peerDependencies**: Dependencies yang harus diinstall user
- **dependencies**: Dependencies yang di-bundle

### tsup.config.ts
- Build configuration
- Output format: CJS + ESM
- External dependencies (tidak di-bundle)
- Source maps enabled

### .npmignore
- Files yang TIDAK akan dipublish
- Source files, config files, etc
- Only `dist/`, `README.md`, `LICENSE` yang dipublish

### README.md
- Documentation untuk users
- Installation guide
- Usage examples
- Component list

### PUBLISH_GUIDE.md
- Detailed publishing instructions
- Workflow guide
- Troubleshooting
- Best practices

## ✨ Features Package

### Build Output
- ✅ CommonJS (Node.js compatibility)
- ✅ ES Modules (tree-shaking support)
- ✅ TypeScript definitions
- ✅ Source maps

### Components (26 components)
- Layout: Box, Container, Grid, Stack, Paper, Card, Divider
- Forms: Form, TextField, Select, Checkbox, Switch, FormHelperText
- Data: Table, VenturoTable, Typography, Badge, Chip
- Feedback: Alert, AlertDialog, Snackbar, CircularProgress
- Navigation: Tabs, Drawer
- Inputs: Button, IconButton
- Overlays: Dialog

### TypeScript
- Full type definitions
- Exported types for all props
- IntelliSense support

### Tree-shakeable
- Only import what you use
- Smaller bundle sizes

## 🔍 Verifikasi

### Cek Build

```bash
npm run ui:build
ls -la packages/react-ui/dist/
```

Harus ada:
- `index.js` (134 KB)
- `index.mjs` (127 KB)
- `index.d.ts` (34 KB)
- Source maps

### Cek Package Content

```bash
cd packages/react-ui
npm pack
tar -xzf venturo-react-ui-1.0.0.tgz
ls -la package/
```

### Test Import

```tsx
// Di project ini
import { Button } from '@venturo/react-ui';

function Test() {
  return <Button>Test</Button>;
}
```

## 🚨 Troubleshooting

### Build Error: "Cannot find module"
- Cek imports, pastikan tidak ada path `@/shared` yang tersisa
- Semua imports harus relative atau dari dependencies

### Publish Error: "You do not have permission"
- Login: `npm login`
- Cek ownership organisasi `@venturo`
- Gunakan `--access public` untuk scoped packages

### Import Error di Project Lain
- Install peer dependencies
- Check Tailwind config includes package paths
- Restart dev server

### Version Already Exists
- Increment version: `npm version patch`
- Atau edit manual di `package.json`

## 📚 Next Steps

### Recommended:

1. **Setup Git Sync** (Optional)
   - Symlink atau script untuk sync `src/shared/components/venturo-ui/` → `packages/react-ui/src/`

2. **Add GitHub Actions** (Optional)
   - Auto-publish on release
   - Run tests before publish

3. **Create Examples** (Optional)
   - Add examples folder
   - Storybook integration

4. **Add Tests** (Optional)
   - Jest + React Testing Library
   - Component tests

### Langkah Selanjutnya:

1. **Publish pertama kali:**
```bash
npm run ui:build
npm run ui:publish
```

2. **Cek di NPM:**
```
https://www.npmjs.com/package/@venturo/react-ui
```

3. **Test di project lain:**
```bash
npm install @venturo/react-ui
```

4. **Update reguler:**
- Edit komponen
- Increment version
- Build & publish

## 🎉 Selesai!

Package Anda siap untuk:
- ✅ Development lokal di project ini
- ✅ Publish ke NPM
- ✅ Digunakan di project lain
- ✅ Update dan maintenance

Untuk detail lebih lanjut, lihat:
- [packages/react-ui/README.md](packages/react-ui/README.md) - User documentation
- [packages/react-ui/PUBLISH_GUIDE.md](packages/react-ui/PUBLISH_GUIDE.md) - Publishing guide

Happy coding! 🚀
