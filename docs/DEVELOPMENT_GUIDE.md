# Development Guide: Using @venturo/react-ui in This Project

## ✅ Setup Sudah Selesai!

Project ini sekarang menggunakan `@venturo/react-ui` package dari `packages/react-ui/`. Semua imports sudah diupdate dari `@/shared/components/venturo-ui` ke `@venturo/react-ui`.

---

## 🎯 Cara Kerja

### Struktur Sekarang

```
lakukan-fe/
├── packages/react-ui/          # ← NPM Package (source of truth)
│   ├── src/                    # ← Edit komponen di sini
│   └── dist/                   # ← Build output (auto-generated)
├── src/
│   ├── modules/
│   │   └── ...                 # ← Pakai: import from '@venturo/react-ui'
│   └── shared/
│       └── components/
│           └── venturo-ui/     # ← Old location (bisa dihapus nanti)
└── package.json
```

**Package sudah ter-link otomatis** via npm workspaces, jadi tidak perlu `npm link` manual!

---

## 🚀 Development Workflow

### **Scenario 1: Update Komponen yang Sudah Ada**

```bash
# 1. Edit komponen di packages/react-ui/src/
vim packages/react-ui/src/Button/Button.tsx

# 2. Rebuild (atau pakai watch mode)
npm run ui:build

# 3. Langsung test di project ini (auto-updated)
npm run dev
```

### **Scenario 2: Buat Komponen Baru**

```bash
# 1. Buat folder komponen baru
mkdir packages/react-ui/src/NewComponent

# 2. Buat file komponen
cat > packages/react-ui/src/NewComponent/NewComponent.tsx << 'EOF'
import React from 'react';

export interface NewComponentProps {
  children: React.ReactNode;
}

export const NewComponent: React.FC<NewComponentProps> = ({ children }) => {
  return <div>{children}</div>;
};
EOF

# 3. Export di index.ts
cat > packages/react-ui/src/NewComponent/index.ts << 'EOF'
export { NewComponent } from './NewComponent';
export type { NewComponentProps } from './NewComponent';
EOF

# 4. Export di main index
echo "\n// Export NewComponent\nexport { NewComponent } from './NewComponent';\nexport type { NewComponentProps } from './NewComponent';" >> packages/react-ui/src/index.ts

# 5. Build
npm run ui:build

# 6. Pakai di project
import { NewComponent } from '@venturo/react-ui';
```

### **Scenario 3: Watch Mode untuk Development**

Untuk development aktif (auto-rebuild saat ada perubahan):

```bash
# Terminal 1: Watch mode - rebuild otomatis
npm run ui:dev

# Terminal 2: Dev server
npm run dev
```

Dengan cara ini, setiap kali Anda edit komponen di `packages/react-ui/src/`, package akan auto-rebuild dan project langsung reload.

---

## 📦 Import Components

### Di File TypeScript/React

```tsx
// ✅ Cara baru (sekarang)
import { Button, Form, Card, useSnackbar } from '@venturo/react-ui';
import type { ButtonProps, FormProps } from '@venturo/react-ui';

// ❌ Cara lama (sudah tidak dipakai)
// import { Button } from '@/shared/components/venturo-ui';
```

### Contoh Lengkap

```tsx
// src/pages/ExamplePage.tsx
import {
  Button,
  Form,
  FormTextField,
  Card,
  Typography,
  useSnackbar
} from '@venturo/react-ui';
import { useForm } from 'react-hook-form';

export default function ExamplePage() {
  const form = useForm();
  const { success } = useSnackbar();

  const onSubmit = (data: any) => {
    success('Form submitted!');
  };

  return (
    <Card>
      <Typography variant="h4">Example Form</Typography>
      <Form form={form} onSubmit={onSubmit}>
        <FormTextField
          name="email"
          label="Email"
          rules={{ required: 'Email required' }}
        />
        <Button type="submit" color="primary">
          Submit
        </Button>
      </Form>
    </Card>
  );
}
```

---

## 🔄 Sync dari Old Location (Optional)

Jika Anda masih ada update di `src/shared/components/venturo-ui/`, bisa sync ke package:

```bash
npm run sync-ui
```

Script ini akan:
1. Copy semua files dari `src/shared/components/venturo-ui/` ke `packages/react-ui/src/`
2. Fix imports otomatis
3. Ready untuk build

---

## 🛠️ Available Scripts

### Package Scripts

```bash
# Build package (production)
npm run ui:build

# Watch mode (development)
npm run ui:dev

# Publish to NPM
npm run ui:publish

# Sync from old location
npm run sync-ui
```

### Project Scripts

```bash
# Run dev server
npm run dev

# Build project
npm run build

# Lint code
npm run lint

# Preview build
npm run preview
```

---

## 🔍 Troubleshooting

### Error: "Cannot find module '@venturo/react-ui'"

**Solusi:**
```bash
# 1. Pastikan package ter-link
npm list @venturo/react-ui
# Should show: @venturo/react-ui@1.0.0 -> ./packages/react-ui

# 2. Build package
npm run ui:build

# 3. Restart dev server
npm run dev
```

### Error: "Module not found" setelah edit komponen

**Solusi:**
```bash
# Rebuild package
npm run ui:build

# Atau pakai watch mode
npm run ui:dev
```

### TypeScript Error: Type import tidak ditemukan

**Solusi:**
```bash
# 1. Pastikan types di-export di packages/react-ui/src/index.ts
# 2. Rebuild
npm run ui:build

# 3. Restart TypeScript server di VSCode
# CMD+Shift+P -> "TypeScript: Restart TS Server"
```

### Import path masih pakai old location

**Solusi:**
```bash
# Run update-imports script
npm run update-imports

# Atau manual find & replace:
# Find: @/shared/components/venturo-ui
# Replace: @venturo/react-ui
```

---

## 📝 Best Practices

### 1. **Selalu Build Sebelum Test**

```bash
# Setelah edit komponen di packages/react-ui/src/
npm run ui:build
npm run dev
```

### 2. **Pakai Watch Mode untuk Development Aktif**

```bash
# Terminal 1
npm run ui:dev

# Terminal 2
npm run dev
```

### 3. **Commit Package Changes**

```bash
# Commit both source and build
git add packages/react-ui/src/
git add packages/react-ui/dist/
git commit -m "feat: update Button component"
```

### 4. **Test Before Publish**

```bash
# 1. Test lokal di project ini
npm run ui:build
npm run dev

# 2. Test build
npm run build

# 3. Kalau OK, baru publish
npm run ui:publish
```

---

## 🎯 Common Tasks

### Update Button Component

```bash
# 1. Edit
vim packages/react-ui/src/Button/Button.tsx

# 2. Build
npm run ui:build

# 3. Test
npm run dev
```

### Add New Prop to Existing Component

```tsx
// packages/react-ui/src/Button/Button.tsx
export interface ButtonProps {
  // ... existing props
  newProp?: string;  // ← Add new prop
}

// Update implementation
const Button = ({ newProp, ...props }: ButtonProps) => {
  // Use newProp
};
```

```bash
# Build
npm run ui:build

# Use in project
import { Button } from '@venturo/react-ui';

<Button newProp="value">Click me</Button>
```

### Fix Import Issues

```bash
# Update all imports to use @venturo/react-ui
npm run update-imports
```

---

## 🚢 Publishing Updates

Setelah update komponen dan test lokal OK:

```bash
# 1. Increment version
cd packages/react-ui
npm version patch  # atau minor/major

# 2. Build
cd ../..
npm run ui:build

# 3. Publish
npm run ui:publish

# 4. Verifikasi
open https://www.npmjs.com/package/@venturo/react-ui
```

---

## 🗑️ Remove Old Folder (Optional)

Setelah semua berjalan lancar, Anda bisa hapus folder lama:

```bash
# Backup dulu (just in case)
mv src/shared/components/venturo-ui src/shared/components/venturo-ui.backup

# Test everything still works
npm run dev
npm run build

# Kalau OK, hapus permanent
rm -rf src/shared/components/venturo-ui.backup
```

---

## 📊 Quick Reference

| Task | Command |
|------|---------|
| Edit component | Edit in `packages/react-ui/src/` |
| Build package | `npm run ui:build` |
| Watch mode | `npm run ui:dev` |
| Import component | `import { X } from '@venturo/react-ui'` |
| Sync from old | `npm run sync-ui` |
| Update imports | `npm run update-imports` |
| Publish | `npm run ui:publish` |
| Dev server | `npm run dev` |
| Build project | `npm run build` |

---

## ✨ Benefits

Dengan setup ini:

✅ **Single Source of Truth** - Komponen di `packages/react-ui/` adalah satu-satunya source
✅ **Type Safety** - Full TypeScript support dengan IntelliSense
✅ **Hot Reload** - Perubahan langsung terlihat saat development
✅ **Reusable** - Package bisa dipakai di project lain
✅ **Versioned** - Bisa track changes dengan version numbers
✅ **NPM Ready** - Siap dipublish kapan saja

---

## 🎉 Done!

Sekarang Anda bisa:
1. ✅ Edit komponen di `packages/react-ui/src/`
2. ✅ Build dengan `npm run ui:build` atau watch mode `npm run ui:dev`
3. ✅ Langsung pakai di project dengan `import from '@venturo/react-ui'`
4. ✅ Publish ke NPM saat siap dengan `npm run ui:publish`

Happy coding! 🚀