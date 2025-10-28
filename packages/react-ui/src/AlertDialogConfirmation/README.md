# AlertDialogConfirmation

Draggable confirmation dialog component with support for async actions, loading states, and error handling.

## Features

- ✅ Draggable dialog (drag from title bar)
- ✅ Multiple variants (danger, warning, info, success)
- ✅ Promise-based API for easy async/await usage
- ✅ Automatic loading state handling
- ✅ Error handling with error display
- ✅ Custom icons and content support
- ✅ Two modes: Simple confirmation or with action execution
- ✅ TypeScript support

## Setup

Wrap your app with `AlertDialogProvider`:

```tsx
import { AlertDialogProvider } from '@/shared/components/venturo-ui';

function App() {
  return (
    <AlertDialogProvider>
      {/* Your app content */}
    </AlertDialogProvider>
  );
}
```

## Usage

### Mode 1: Simple Confirmation (return boolean)

Use this when you want to handle the action yourself after confirmation.

```tsx
import { useAlertDialog } from '@/shared/components/venturo-ui';

function MyComponent() {
  const { showAlert } = useAlertDialog();

  const handleDelete = async () => {
    const confirmed = await showAlert({
      title: "Delete '20 Mbps'?",
      message: "This action cannot be undone. Are you sure you want to delete this item?",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (confirmed) {
      // Handle delete here
      await deleteItem(id);
      toast.success("Item deleted successfully");
    }
  };

  return <Button onClick={handleDelete}>Delete</Button>;
}
```

### Mode 2: With Action (automatic execution)

Use this when you want the dialog to handle the action execution, loading state, and error handling automatically.

```tsx
import { useAlertDialog } from '@/shared/components/venturo-ui';

function MyComponent() {
  const { showAlert } = useAlertDialog();

  const handleDelete = async () => {
    await showAlert({
      title: "Delete '20 Mbps'?",
      message: "This action cannot be undone. Are you sure you want to delete this item?",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: async () => {
        // Action is executed here
        await deleteItem(id);
      },
      onSuccess: () => {
        toast.success("Item deleted successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return <Button onClick={handleDelete}>Delete</Button>;
}
```

### Using in Services (non-component)

You can call the dialog from services by accessing the context:

```tsx
// In a service file
import { alertDialogService } from '@/shared/components/venturo-ui';

export const userService = {
  async deleteUser(userId: string) {
    const confirmed = await alertDialogService.show({
      title: "Delete user?",
      message: "This action cannot be undone.",
      variant: "danger",
    });

    if (confirmed) {
      await api.delete(`/users/${userId}`);
    }
  },
};
```

## API Reference

### AlertDialogOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | required | Dialog title |
| `message` | `string \| ReactNode` | required | Dialog message or custom content |
| `confirmText` | `string` | `"Confirm"` | Confirm button text |
| `cancelText` | `string` | `"Cancel"` | Cancel button text |
| `variant` | `'danger' \| 'warning' \| 'info' \| 'success'` | `"danger"` | Visual variant for the dialog |
| `icon` | `ReactNode` | auto | Custom icon (default based on variant) |
| `hideCancelButton` | `boolean` | `false` | Hide the cancel button |
| `onConfirm` | `() => Promise<void> \| void` | - | Action to execute on confirm |
| `onSuccess` | `() => void` | - | Callback when action succeeds |
| `onError` | `(error: Error) => void` | - | Callback when action fails |
| `customContent` | `ReactNode` | - | Custom content instead of message |

### Variants

#### Danger (Red)
```tsx
variant: "danger"
```
Use for destructive actions like delete, remove, etc.

#### Warning (Orange)
```tsx
variant: "warning"
```
Use for potentially risky actions that need attention.

#### Info (Blue)
```tsx
variant: "info"
```
Use for informational confirmations.

#### Success (Green)
```tsx
variant: "success"
```
Use for positive confirmations.

## Examples

### Custom Icon

```tsx
import { Trash2 } from 'lucide-react';

await showAlert({
  title: "Delete item?",
  message: "This will permanently delete the item.",
  icon: <Trash2 className="w-6 h-6" />,
  variant: "danger",
});
```

### Hide Cancel Button

```tsx
await showAlert({
  title: "Important Notice",
  message: "Please read and acknowledge this message.",
  confirmText: "I Understand",
  hideCancelButton: true,
  variant: "info",
});
```

### Custom Content

```tsx
await showAlert({
  title: "Delete multiple items?",
  customContent: (
    <div>
      <p>You are about to delete:</p>
      <ul className="list-disc pl-5 mt-2">
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
      <p className="mt-2 text-red-600">This action cannot be undone.</p>
    </div>
  ),
  variant: "danger",
});
```

### With Loading State

The dialog automatically handles loading state when `onConfirm` is provided:

```tsx
await showAlert({
  title: "Process data?",
  message: "This may take a few seconds.",
  confirmText: "Process",
  variant: "info",
  onConfirm: async () => {
    // Dialog shows loading spinner on button
    await processData();
  },
});
```

## Tips

1. **Use appropriate variants**: Choose the variant that matches the action severity
2. **Clear messaging**: Write clear, concise messages that explain what will happen
3. **Action verbs**: Use specific action verbs for button text (e.g., "Delete", "Remove", "Archive")
4. **Error handling**: Always provide `onError` callback when using `onConfirm`
5. **Loading states**: Let the dialog handle loading states by using `onConfirm` for async actions
