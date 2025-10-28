# AlertDialog vs Toast di useLoginForm

## 🔍 Analisis

### Current State: `useLoginForm.ts` pakai **Toast**

```tsx
// src/modules/core/auth/hooks/useLoginForm.ts
import { useToast } from '@/shared/hooks/useToast';

const toast = useToast();

// On error:
toast.error(errorMessage);

// On success:
toast.success('Login successful!');
```

### Available: **AlertDialog** di Package (Belum Dipakai)

```tsx
// @venturo/react-ui
import { useAlertDialog } from '@venturo/react-ui';

const { showAlert } = useAlertDialog();

// Could be used for:
await showAlert({
  title: "Login Failed",
  message: errorMessage,
  variant: "danger"
});
```

---

## 🤔 Pertanyaan: Kenapa Pakai Toast, Bukan AlertDialog?

### **Toast** (Current - ✅ Correct!)

**Use Case:** Quick, non-blocking feedback
- ✅ Login success notification
- ✅ Login error message
- ✅ Auto-dismiss after few seconds
- ✅ Doesn't interrupt user flow

```tsx
toast.success('Login successful!');
toast.error('Invalid credentials');
```

**Karakteristik:**
- Muncul di corner/top screen
- Auto-dismiss (3-5 detik)
- Non-blocking (user bisa lanjut kerja)
- Info/feedback only

### **AlertDialog** (Alternative - ⚠️ Not Suitable!)

**Use Case:** Critical actions that need confirmation
- ❌ **NOT** suitable for login feedback
- ✅ Suitable for: Delete user, Logout confirmation, Critical actions

```tsx
const confirmed = await showAlert({
  title: "Delete User?",
  message: "This cannot be undone",
  variant: "danger"
});

if (confirmed) {
  // Delete user
}
```

**Karakteristik:**
- Modal dialog (blocks screen)
- Requires user action (click OK/Cancel)
- For confirmation/critical actions
- User MUST interact to dismiss

---

## ✅ Correct Usage

### **Toast for Login (Current - Correct!)**

```tsx
// ✅ CORRECT: Non-blocking feedback
export const useLoginForm = () => {
  const toast = useToast();

  const loginMutation = usePostLogin({
    onSuccess: async (response) => {
      toast.success('Login successful!');  // ← Just info, non-blocking
      // GuestGuard auto-redirect
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      toast.error(errorMessage);  // ← Just error msg, non-blocking
    }
  };

  return { form, isLoading, onSubmit };
};
```

**Why Correct?**
- User sees success → Auto redirect (smooth UX)
- User sees error → Can try again immediately
- No extra clicks needed

### **AlertDialog for Critical Actions (When Needed)**

```tsx
// ✅ CORRECT: Confirmation before destructive action
export const useDeleteUser = () => {
  const { showAlert } = useAlertDialog();
  const toast = useToast();

  const handleDelete = async (user: User) => {
    // Ask confirmation first
    const confirmed = await showAlert({
      title: `Delete "${user.name}"?`,
      message: "This action cannot be undone.",
      variant: "danger",
      confirmText: "Delete",
    });

    if (confirmed) {
      // User confirmed, proceed with deletion
      try {
        await deleteUserApi(user.id);
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  return { handleDelete };
};
```

**Why Correct?**
- Destructive action (delete) needs confirmation
- User must think before proceeding
- Prevents accidental deletions

---

## 🎯 When to Use What?

### Use **Toast** for:

✅ **Success/Error Feedback**
- Login success/error
- Form submission result
- Data saved
- Operation completed
- Network errors

✅ **Non-blocking Info**
- "Copied to clipboard"
- "File uploaded"
- "Settings saved"
- "Email sent"

### Use **AlertDialog** for:

✅ **Confirmations**
- Delete user/item
- Logout confirmation
- Discard changes
- Cancel subscription
- Permanent actions

✅ **Critical Warnings**
- "You have unsaved changes"
- "This will affect X users"
- "Cannot be undone"
- "Are you sure?"

---

## 📊 Comparison

| Feature | Toast | AlertDialog |
|---------|-------|-------------|
| **Blocking** | ❌ Non-blocking | ✅ Blocks interaction |
| **Auto-dismiss** | ✅ Yes (3-5s) | ❌ Requires action |
| **Use Case** | Feedback/Info | Confirmation |
| **User Action** | None required | Must click button |
| **Position** | Corner/Top | Center (modal) |
| **Example** | "Login successful" | "Delete user?" |

---

## 🔄 Could Login Use AlertDialog?

### ❌ **NOT Recommended:**

```tsx
// ❌ BAD UX: Forces user to click OK
const loginMutation = usePostLogin({
  onSuccess: async () => {
    await showAlert({
      title: "Success!",
      message: "Login successful",
      variant: "success",
      hideCancelButton: true,
    });
    // User must click OK to continue → Annoying!
  },
});
```

**Problems:**
- Extra click needed (bad UX)
- Delays redirect
- Blocks screen unnecessarily
- Feels like error popup

### ✅ **Better with Toast:**

```tsx
// ✅ GOOD UX: Quick feedback, auto-continue
const loginMutation = usePostLogin({
  onSuccess: async () => {
    toast.success('Login successful!');
    // Auto-redirect immediately → Smooth!
  },
});
```

**Benefits:**
- No extra clicks
- Immediate redirect
- Smooth user flow
- Modern UX pattern

---

## 💡 Real-World Example: When to Use AlertDialog

### Example: Logout Button

```tsx
export const useLogout = () => {
  const { showAlert } = useAlertDialog();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async () => {
    // ✅ GOOD: Confirmation before logout
    const confirmed = await showAlert({
      title: "Logout",
      message: "Are you sure you want to logout?",
      variant: "warning",
      confirmText: "Logout",
      cancelText: "Cancel",
    });

    if (confirmed) {
      await authService.logout();
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  return { handleLogout };
};
```

### Example: Delete User (from EXAMPLE.tsx)

```tsx
const handleDeleteUser = async () => {
  const userName = "John Doe";

  // ✅ GOOD: Confirmation before delete
  await showAlert({
    title: `Delete "${userName}"?`,
    message: "This action cannot be undone.",
    confirmText: "Delete",
    variant: "danger",
    onConfirm: async () => {
      await deleteUserApi(userId);
    },
    onSuccess: () => {
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed: ${error.message}`);
    },
  });
};
```

---

## 🎯 Conclusion

### Current `useLoginForm.ts` Implementation:

**✅ CORRECT!** Uses Toast for:
- Success feedback → Non-blocking
- Error messages → Non-blocking
- Smooth UX → Auto-redirect

### AlertDialog in Package:

**✅ AVAILABLE!** Should be used for:
- Delete actions
- Logout confirmation
- Discard changes
- Critical confirmations

### Should We Change Login to Use AlertDialog?

**❌ NO!** Current implementation is better because:
- Login feedback doesn't need confirmation
- Toast is perfect for non-blocking feedback
- AlertDialog would slow down UX

---

## 📚 Summary

| Component | Current Use | Correct? | When to Change? |
|-----------|-------------|----------|-----------------|
| **useLoginForm** | Toast | ✅ Yes | Never (already optimal) |
| **useDeleteUser** | Should use AlertDialog | Need to implement | Yes, for confirmations |
| **useLogout** | Should use AlertDialog | Need to implement | Yes, for confirmation |
| **useFormSubmit** | Toast | ✅ Yes | No (feedback only) |

---

## 🚀 Next Steps

If you want to use AlertDialog for other features:

1. **Delete User** → Use AlertDialog for confirmation
2. **Logout** → Use AlertDialog for confirmation
3. **Delete Role** → Use AlertDialog for confirmation
4. **Discard Form** → Use AlertDialog for confirmation

But for **Login/Form Feedback** → Keep using Toast! ✅

---

**Bottom Line:**
- ✅ Login uses Toast = CORRECT (no change needed)
- ✅ AlertDialog available for confirmations (use when needed)
- ❌ Don't use AlertDialog for login feedback (bad UX)

Hope this clears up the confusion! 😄
