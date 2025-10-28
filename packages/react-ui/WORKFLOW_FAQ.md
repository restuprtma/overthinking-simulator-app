# Workflow FAQ: Development dengan @venturo/react-ui

## ❓ Pertanyaan: Setelah Edit Package, Harus npm install?

### **Jawaban: TIDAK! ❌**

Anda **HANYA perlu rebuild**, bukan npm install!

---

## 🔄 Workflow yang Benar

### **Scenario 1: Edit Komponen**

```bash
# 1. Edit file
vim packages/react-ui/src/Button/Button.tsx

# 2. Rebuild package (BUKAN npm install!)
npm run ui:build

# 3. Changes langsung available!
# Refresh browser atau restart dev server
```

**TIDAK PERLU `npm install`!**

---

## 🎯 Kapan Perlu npm install?

### **Hanya di 3 Situasi Ini:**

#### 1. **Pertama Kali Setup Project**
```bash
git clone ...
npm install  # ← Install dependencies & create symlink
```

#### 2. **Tambah/Update Dependencies di package.json**
```bash
# Misal tambah dependency baru di packages/react-ui/package.json
{
  "dependencies": {
    "lodash": "^4.17.21"  // ← Dependency baru
  }
}

# Baru perlu npm install
npm install
```

#### 3. **Hapus node_modules (Clean Install)**
```bash
rm -rf node_modules
npm install  # ← Recreate symlink
```

---

## ✅ Workflow Development yang Benar

### **Option A: Manual Build (Recommended untuk Small Changes)**

```bash
# 1. Edit komponen
vim packages/react-ui/src/Button/Button.tsx

# 2. Build
npm run ui:build

# 3. Test
# - Jika dev server sudah jalan: Refresh browser
# - Jika belum: npm run dev
```

### **Option B: Watch Mode (Recommended untuk Active Development)**

```bash
# Terminal 1: Watch mode - auto rebuild setiap ada perubahan
npm run ui:dev

# Terminal 2: Dev server
npm run dev

# Sekarang edit apapun di packages/react-ui/src/
# Otomatis rebuild + browser auto reload! 🔄
```

**Dengan watch mode, Anda TIDAK PERLU manual build!**

---

## 🎨 Visual Comparison

### ❌ **SALAH:**

```bash
# Edit file
vim packages/react-ui/src/Button/Button.tsx

# ❌ SALAH: npm install (tidak perlu!)
npm install

# ❌ SALAH: Buang waktu!
```

### ✅ **BENAR:**

```bash
# Edit file
vim packages/react-ui/src/Button/Button.tsx

# ✅ BENAR: Just rebuild
npm run ui:build

# Or bahkan lebih baik: Watch mode
npm run ui:dev  # Once, di awal development
```

---

## 🔍 Kenapa Tidak Perlu npm install?

### **Karena Symlink Sudah Ada!**

```
node_modules/@venturo/react-ui
  ↓ (symlink - permanent!)
packages/react-ui/
```

Symlink ini **permanent** sampai Anda:
- Hapus `node_modules/`
- Atau ubah `package.json` workspaces config

**Edit file di `packages/react-ui/src/` TIDAK mempengaruhi symlink!**

Yang perlu di-update adalah **build output** di `packages/react-ui/dist/`:

```
Edit: packages/react-ui/src/Button.tsx
  ↓
Build: npm run ui:build
  ↓
Update: packages/react-ui/dist/index.mjs  ← Ini yang di-import!
  ↓
Browser reload: Changes terlihat ✅
```

---

## 📊 Flow Diagram

### **Symlink (Permanent)**
```
npm install (sekali aja)
  ↓
Create symlink: node_modules/@venturo/react-ui → packages/react-ui
  ↓
Symlink tetap ada forever! (sampai delete node_modules)
```

### **Build (Setiap Edit)**
```
Edit: packages/react-ui/src/
  ↓
Build: npm run ui:build (atau ui:dev watch mode)
  ↓
Update: packages/react-ui/dist/
  ↓
Import uses updated dist/ ✅
```

**2 Hal Berbeda:**
- **Symlink** = Setup sekali (npm install)
- **Build** = Setiap edit (npm run ui:build)

---

## 🎯 Quick Reference

| Task | Command | Frequency |
|------|---------|-----------|
| Setup project pertama kali | `npm install` | Once |
| Edit komponen | (just edit) | Many times |
| Rebuild setelah edit | `npm run ui:build` | After each edit |
| Watch mode (auto rebuild) | `npm run ui:dev` | Once, keep running |
| Dev server | `npm run dev` | Once, keep running |
| Tambah dependency baru | `npm install` | Rarely |

---

## 🚀 Recommended Daily Workflow

### **Best Practice: Watch Mode**

```bash
# Morning: Start work
npm run ui:dev    # Terminal 1 - Keep running all day
npm run dev       # Terminal 2 - Keep running all day

# Edit sepuasnya di packages/react-ui/src/
# Auto rebuild + auto reload browser!

# Evening: Done
# Ctrl+C kedua terminal
```

**Anda TIDAK perlu jalankan command lain sepanjang hari!**

---

## 💡 Analogi Sederhana

### **Symlink = Jalan Raya (Permanent)**

```
Rumah Anda (packages/react-ui/)
  ↑
Jalan Raya (symlink di node_modules)
  ↑
Mobil (import statement)
```

**Jalan raya dibangun sekali** (`npm install`), kemudian permanent.

### **Build = Renovasi Rumah (Setiap Edit)**

```
Renovasi Rumah (edit source code)
  ↓
Build ulang (npm run ui:build)
  ↓
Rumah baru (dist/ updated)
```

**Jalan raya tetap sama!** Tidak perlu bangun ulang jalan.

---

## 🔧 Troubleshooting

### **Q: Saya edit tapi changes tidak muncul?**

```bash
# Solution:
npm run ui:build  # Rebuild!
# Refresh browser
```

**BUKAN `npm install`!**

### **Q: Error "Cannot find module @venturo/react-ui"**

```bash
# Check symlink
ls -la node_modules/@venturo/react-ui

# If missing, recreate:
npm install

# Then build:
npm run ui:build
```

### **Q: Changes tidak auto-reload?**

```bash
# Make sure watch mode running:
npm run ui:dev  # Terminal 1

# And dev server:
npm run dev     # Terminal 2
```

---

## 📝 Summary

### **npm install:**
- ✅ Pertama kali setup
- ✅ Tambah dependency baru
- ✅ Setelah delete node_modules
- ❌ **TIDAK** setiap edit komponen

### **npm run ui:build:**
- ✅ Setelah edit komponen
- ✅ Before test changes
- ❌ **TIDAK PERLU** jika pakai watch mode

### **npm run ui:dev (Watch Mode):**
- ✅ Auto rebuild setiap edit
- ✅ Best untuk active development
- ✅ Run once, keep running

---

## 🎉 Key Takeaway

```
Edit file → Build (NOT npm install!) → Test ✅
```

**Or even better:**

```
Watch mode → Edit file → Auto rebuild → Auto reload ✨
```

**npm install = Setup symlink (once)**
**npm run ui:build = Update build (after each edit)**

**Jangan bingung lagi!** 😄

---

## 🎯 TL;DR

**Q:** Harus npm install setelah edit?
**A:** **TIDAK!** Hanya perlu `npm run ui:build`

**Q:** Kapan perlu npm install?
**A:** Setup awal atau tambah dependency baru

**Q:** Workflow terbaik?
**A:** Pakai watch mode: `npm run ui:dev` (auto rebuild)

---

Sekarang sudah jelas? 🚀