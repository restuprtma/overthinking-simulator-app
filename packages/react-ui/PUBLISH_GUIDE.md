# Panduan Publish @venturo/react-ui ke NPM

## Persiapan Awal (Hanya Sekali)

### 1. Login ke NPM

Pastikan Anda sudah login ke akun NPM Anda:

```bash
npm login
```

Masukkan:
- Username NPM Anda
- Password
- Email
- One-time password (jika mengaktifkan 2FA)

Verifikasi login:
```bash
npm whoami
```

### 2. Konfigurasi Package

Pastikan informasi di `package.json` sudah benar:
- `name`: `@venturo/react-ui`
- `version`: Gunakan semantic versioning (contoh: 1.0.0)
- `repository`: URL GitHub repository Anda
- `author`: Nama atau organisasi Anda

## Workflow Development

### 1. Development Mode

Saat mengembangkan komponen di project ini:

```bash
# Watch mode - rebuild otomatis saat ada perubahan
npm run ui:dev
```

### 2. Testing Lokal

Import langsung dari workspace:

```tsx
// Di file src/App.tsx atau file lain
import { Button, Card } from '@venturo/react-ui';
```

Karena menggunakan npm workspaces, package akan otomatis ter-link.

### 3. Build Package

Sebelum publish, pastikan build berhasil:

```bash
npm run ui:build
```

Output akan ada di `packages/react-ui/dist/`

## Publish ke NPM

### Langkah 1: Persiapan

1. Pastikan semua perubahan sudah di-commit
2. Update version di `packages/react-ui/package.json`

```json
{
  "version": "1.0.0" // Increment sesuai semantic versioning
}
```

**Semantic Versioning:**
- **Major** (1.0.0 → 2.0.0): Breaking changes
- **Minor** (1.0.0 → 1.1.0): New features, backward compatible
- **Patch** (1.0.0 → 1.0.1): Bug fixes

### Langkah 2: Build

```bash
npm run ui:build
```

### Langkah 3: Test Package (Optional)

Cek isi package yang akan dipublish:

```bash
cd packages/react-ui
npm pack
```

Ini akan membuat file `.tgz`. Extract dan cek isinya:

```bash
tar -xzf venturo-react-ui-1.0.0.tgz
ls -la package/
```

### Langkah 4: Publish

Ada 2 cara:

**Cara 1: Dari root project (Recommended)**

```bash
npm run ui:publish
```

**Cara 2: Dari direktori package**

```bash
cd packages/react-ui
npm publish --access public
```

> **Note:** `--access public` diperlukan untuk scoped packages (@venturo/react-ui)

### Langkah 5: Verifikasi

Cek di NPM:
```
https://www.npmjs.com/package/@venturo/react-ui
```

## Update Package

Ketika Anda ingin update komponen dan publish versi baru:

### 1. Update Komponen

Buat perubahan di `packages/react-ui/src/`

### 2. Increment Version

Edit `packages/react-ui/package.json`:

```json
{
  "version": "1.0.1" // atau 1.1.0, atau 2.0.0
}
```

Atau gunakan npm version:

```bash
cd packages/react-ui

# Patch (1.0.0 → 1.0.1)
npm version patch

# Minor (1.0.0 → 1.1.0)
npm version minor

# Major (1.0.0 → 2.0.0)
npm version major
```

### 3. Build & Publish

```bash
# Dari root project
npm run ui:build
npm run ui:publish
```

### 4. Update di Project Lain

Di project yang menggunakan package:

```bash
npm update @venturo/react-ui

# Atau install versi spesifik
npm install @venturo/react-ui@1.0.1
```

## Troubleshooting

### Error: "You do not have permission to publish"

Pastikan:
1. Sudah login: `npm whoami`
2. Organisasi `@venturo` sudah dibuat di NPM
3. Anda adalah member/owner dari organisasi tersebut

Jika belum ada organisasi, buat di:
https://www.npmjs.com/org/create

### Error: "Package name too similar to existing package"

Ubah nama package di `package.json` atau gunakan scope lain.

### Error: "Version already exists"

Increment version number sebelum publish.

### Build Error

Cek:
1. Dependencies sudah terinstall: `npm install`
2. TypeScript error: `npm run type-check --workspace=@venturo/react-ui`
3. Cek error log untuk detail

## Best Practices

### 1. Versioning

- Selalu commit perubahan sebelum publish
- Tag version di Git:
  ```bash
  git tag v1.0.0
  git push --tags
  ```

### 2. Changelog

Buat `CHANGELOG.md` untuk track perubahan:

```markdown
# Changelog

## [1.0.1] - 2025-01-15
### Fixed
- Button hover state

## [1.0.0] - 2025-01-01
### Added
- Initial release
```

### 3. Testing

Sebelum publish:
- Test di project ini
- Test build: `npm run ui:build`
- Test import: Coba import di file test

### 4. Documentation

Update `README.md` jika ada:
- Komponen baru
- Breaking changes
- API changes

## Sync dengan Project Lain

### Menggunakan Package di Project Lain

1. Install package:
```bash
npm install @venturo/react-ui
```

2. Import komponen:
```tsx
import { Button, Form, Card } from '@venturo/react-ui';
```

3. Update package saat ada versi baru:
```bash
npm update @venturo/react-ui
```

### Development Workflow

**Di project ini (lakukan-fe):**
1. Edit komponen di `packages/react-ui/src/`
2. `npm run ui:dev` untuk watch mode
3. Test langsung dengan import dari `@venturo/react-ui`
4. Commit & publish saat sudah siap

**Di project lain:**
1. `npm update @venturo/react-ui` untuk dapat update terbaru
2. Atau install versi spesifik: `npm install @venturo/react-ui@1.2.3`

## Automation (Optional)

Bisa ditambahkan GitHub Actions untuk auto-publish:

```yaml
# .github/workflows/publish.yml
name: Publish Package

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run ui:build
      - run: npm run ui:publish
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
```

## Checklist Sebelum Publish

- [ ] Semua komponen sudah di-test
- [ ] Build berhasil tanpa error
- [ ] Version number sudah di-increment
- [ ] README.md up to date
- [ ] CHANGELOG.md updated (jika ada)
- [ ] Commit semua perubahan
- [ ] Logged in ke NPM (`npm whoami`)

## Selesai!

Package Anda sekarang bisa digunakan di project manapun dengan:

```bash
npm install @venturo/react-ui
```

Happy coding! 🚀
