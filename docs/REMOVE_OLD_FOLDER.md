# Guide: Remove Old venturo-ui Folder

## ✅ Verification Completed

Sudah dicek bahwa:
- ✅ Tidak ada imports ke `@/shared/components/venturo-ui` di luar folder itu sendiri
- ✅ Semua imports sudah menggunakan `@venturo/react-ui` package
- ✅ Package `@venturo/react-ui` sudah ter-link dan di-build

## 🚀 Safe Removal Steps

### Step 1: Test Aplikasi Dulu

**PENTING:** Pastikan aplikasi berjalan normal sebelum delete!

```bash
# Clear cache
rm -rf node_modules/.vite

# Start dev server
npm run dev
```

Buka browser dan test:
- ✅ Aplikasi load tanpa error
- ✅ Login page tampil
- ✅ Components render dengan baik
- ✅ No console errors

### Step 2: Backup (Recommended)

```bash
# Backup folder ke luar project (just in case)
cp -r src/shared/components/venturo-ui ~/venturo-ui-backup-$(date +%Y%m%d)

# Atau rename dulu (safer)
mv src/shared/components/venturo-ui src/shared/components/venturo-ui.backup
```

### Step 3: Test Lagi

```bash
# Test dengan folder yang sudah di-rename/backup
npm run dev

# Test build juga
npm run build
```

Kalau semua OK:
- ✅ Dev server jalan normal
- ✅ Build berhasil
- ✅ No errors

### Step 4: Delete Permanent

```bash
# Kalau semua sudah OK, delete backup
rm -rf src/shared/components/venturo-ui.backup

# Atau kalau tadi langsung rename:
# (sudah aman karena sudah test)
```

## 🔍 Verification Checklist

Sebelum delete, pastikan:

- [ ] `npm run dev` jalan tanpa error
- [ ] `npm run build` berhasil
- [ ] Login page tampil dengan benar
- [ ] Forms berfungsi (Button, TextField, dll)
- [ ] Tables tampil dengan baik
- [ ] Dialogs & Snackbars berfungsi
- [ ] No console errors di browser
- [ ] Package sudah di-build: `ls packages/react-ui/dist/`

## 📊 Files to be Removed

```bash
src/shared/components/venturo-ui/
├── Alert/
├── AlertDialogConfirmation/
├── Badge/
├── Box/
├── Button/
├── Card/
├── Checkbox/
├── Chip/
├── CircularProgress/
├── Dialog/
├── Divider/
├── Drawer/
├── Form/
├── FormHelperText/
├── Grid/
├── Paper/
├── Select/
├── Snackbar/
├── Stack/
├── Table/
├── TablePagination/
├── Tabs/
├── TextField/
├── Typography/
└── index.ts
```

Total: ~26 components, ~150 files

## ⚠️ Important Notes

1. **Jangan delete sebelum test!** Pastikan aplikasi berjalan normal dulu.

2. **Keep backup** (at least temporary) sampai yakin 100% tidak ada issue.

3. **Git commit** sebelum delete:
   ```bash
   git add .
   git commit -m "chore: migrate to @venturo/react-ui package"
   ```

4. **Package location** sekarang ada di `packages/react-ui/src/` - ini source of truth baru.

## 🎯 One-Command Removal (Use with Caution!)

Kalau sudah 100% yakin semuanya OK:

```bash
# Backup first
mv src/shared/components/venturo-ui src/shared/components/venturo-ui.backup.$(date +%Y%m%d)

# Test
npm run dev

# If OK, remove backup
rm -rf src/shared/components/venturo-ui.backup.*
```

## 🔄 What If Something Breaks?

Jangan panik! Restore dari backup:

```bash
# Stop dev server (Ctrl+C)

# Restore from backup
mv src/shared/components/venturo-ui.backup src/shared/components/venturo-ui

# Rebuild package
npm run ui:build

# Start dev server
npm run dev
```

## ✨ After Removal

Setelah berhasil remove:

1. **Update .gitignore** (optional):
   ```bash
   echo "src/shared/components/venturo-ui.backup*" >> .gitignore
   ```

2. **Commit changes**:
   ```bash
   git add .
   git commit -m "chore: remove old venturo-ui folder, now using @venturo/react-ui package"
   ```

3. **Celebrate!** 🎉 Project Anda sekarang:
   - ✅ Lebih clean
   - ✅ Single source of truth
   - ✅ Ready untuk publish package ke NPM
   - ✅ Reusable di project lain

---

## 📋 Quick Summary

```bash
# 1. Test first
npm run dev  # ← Test dulu!
npm run build

# 2. Backup & remove
mv src/shared/components/venturo-ui src/shared/components/venturo-ui.backup

# 3. Test again
npm run dev
npm run build

# 4. If OK, delete backup
rm -rf src/shared/components/venturo-ui.backup

# 5. Commit
git add .
git commit -m "chore: remove old venturo-ui folder"
```

---

**Status:** ✅ Safe to remove (after testing)
**Risk Level:** 🟢 Low (if tested properly)
**Backup:** 🔵 Recommended