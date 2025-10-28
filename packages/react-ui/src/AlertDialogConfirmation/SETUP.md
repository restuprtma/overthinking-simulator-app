# Setup AlertDialogConfirmation

## Step 1: Wrap Your App with Provider

Add `AlertDialogProvider` to your App.tsx:

```tsx
// src/App.tsx
import { RouterProvider } from "react-router";
import { AlertDialogProvider } from '@/shared/components/venturo-ui';

import { Flowbite, ThemeModeScript } from '@/shared/components/theme-ui';
import customTheme from '@/shared/utils/theme/custom-theme';
import router from "@/app/router/Router";

function App() {
  return (
    <>
      <ThemeModeScript />
      <Flowbite theme={{ theme: customTheme }}>
        <AlertDialogProvider>
          <RouterProvider router={router} />
        </AlertDialogProvider>
      </Flowbite>
    </>
  );
}

export default App;
```

## Step 2: Use in Your Components

### Example 1: Simple Delete Confirmation

```tsx
import { useAlertDialog } from '@/shared/components/venturo-ui';
import { Button } from '@/shared/components/venturo-ui';

function UserManagement() {
  const { showAlert } = useAlertDialog();

  const handleDelete = async (userName: string) => {
    const confirmed = await showAlert({
      title: `Delete "${userName}"?`,
      message: "This action cannot be undone. Are you sure you want to delete this user?",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (confirmed) {
      // Your delete logic here
      console.log('User deleted');
    }
  };

  return (
    <Button onClick={() => handleDelete('John Doe')}>
      Delete User
    </Button>
  );
}
```

### Example 2: With API Call and Loading State

```tsx
import { useAlertDialog } from '@/shared/components/venturo-ui';
import { Button } from '@/shared/components/venturo-ui';
import { toast } from 'your-toast-library';

function ProductManagement() {
  const { showAlert } = useAlertDialog();

  const handleDelete = async (productId: string, productName: string) => {
    await showAlert({
      title: `Delete "${productName}"?`,
      message: "This action cannot be undone. Are you sure you want to delete this product?",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: async () => {
        // API call - dialog will show loading automatically
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete product');
        }
      },
      onSuccess: () => {
        toast.success("Product deleted successfully");
        // Refresh your data here
      },
      onError: (error) => {
        toast.error(`Failed to delete: ${error.message}`);
      },
    });
  };

  return (
    <Button onClick={() => handleDelete('123', '20 Mbps')}>
      Delete Product
    </Button>
  );
}
```

### Example 3: Multiple Variants

```tsx
import { useAlertDialog } from '@/shared/components/venturo-ui';

function Actions() {
  const { showAlert } = useAlertDialog();

  const showDangerDialog = () => {
    showAlert({
      title: "Delete Item",
      message: "This is a destructive action.",
      variant: "danger",
    });
  };

  const showWarningDialog = () => {
    showAlert({
      title: "Warning",
      message: "This action requires attention.",
      variant: "warning",
    });
  };

  const showInfoDialog = () => {
    showAlert({
      title: "Information",
      message: "This is an informational message.",
      variant: "info",
    });
  };

  const showSuccessDialog = () => {
    showAlert({
      title: "Success",
      message: "This is a success message.",
      variant: "success",
    });
  };

  return (
    <div className="flex gap-2">
      <Button onClick={showDangerDialog} color="danger">Danger</Button>
      <Button onClick={showWarningDialog} color="warning">Warning</Button>
      <Button onClick={showInfoDialog} color="info">Info</Button>
      <Button onClick={showSuccessDialog} color="success">Success</Button>
    </div>
  );
}
```

### Example 4: In a Service/Hook

```tsx
// services/userService.ts
import { AlertDialogOptions } from '@/shared/components/venturo-ui';

// Create a reference that will be set by the provider
let showAlertRef: ((options: AlertDialogOptions) => Promise<boolean>) | null = null;

export const setAlertDialogRef = (
  showAlert: (options: AlertDialogOptions) => Promise<boolean>
) => {
  showAlertRef = showAlert;
};

export const userService = {
  async deleteUser(userId: string, userName: string) {
    if (!showAlertRef) {
      throw new Error('AlertDialog not initialized');
    }

    const confirmed = await showAlertRef({
      title: `Delete "${userName}"?`,
      message: "This action cannot be undone.",
      variant: "danger",
    });

    if (confirmed) {
      // Perform delete
      await fetch(`/api/users/${userId}`, { method: 'DELETE' });
    }
  },
};
```

```tsx
// In your App.tsx or a wrapper component
import { useEffect } from 'react';
import { useAlertDialog } from '@/shared/components/venturo-ui';
import { setAlertDialogRef } from '@/services/userService';

function AppInitializer({ children }) {
  const { showAlert } = useAlertDialog();

  useEffect(() => {
    setAlertDialogRef(showAlert);
  }, [showAlert]);

  return <>{children}</>;
}
```

## Step 3: Testing

Create a test page to verify all variants work correctly:

```tsx
// pages/TestAlertDialog.tsx
import { useAlertDialog } from '@/shared/components/venturo-ui';
import { Button } from '@/shared/components/venturo-ui';

function TestAlertDialog() {
  const { showAlert } = useAlertDialog();

  const testSimpleConfirmation = async () => {
    const result = await showAlert({
      title: "Delete '20 Mbps'?",
      message: "This action cannot be undone. Are you sure you want to delete this item?",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });
    console.log('Result:', result);
  };

  const testWithAction = async () => {
    await showAlert({
      title: "Processing...",
      message: "This will take a few seconds.",
      confirmText: "Process",
      variant: "info",
      onConfirm: async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
      },
      onSuccess: () => {
        console.log('Success!');
      },
      onError: (error) => {
        console.error('Error:', error);
      },
    });
  };

  const testWithError = async () => {
    await showAlert({
      title: "Test Error",
      message: "Click confirm to simulate an error.",
      confirmText: "Trigger Error",
      variant: "danger",
      onConfirm: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        throw new Error('This is a test error');
      },
    });
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Test Alert Dialog</h1>
      <div className="flex gap-2">
        <Button onClick={testSimpleConfirmation}>
          Simple Confirmation
        </Button>
        <Button onClick={testWithAction}>
          With Action
        </Button>
        <Button onClick={testWithError}>
          With Error
        </Button>
      </div>
    </div>
  );
}

export default TestAlertDialog;
```

## Notes

- The dialog is **draggable** from the title bar
- You can drag it around the screen
- While an action is loading, the dialog cannot be closed
- Errors are displayed within the dialog
- The dialog automatically closes on success
- Press ESC or click outside to cancel (when not loading)
