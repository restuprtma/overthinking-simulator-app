# Snackbar

Modern snackbar notification component with MUI Alert integration for displaying temporary messages.

## Features

- ✅ 4 severity types (success, error, warning, info)
- ✅ Auto-dismiss with configurable duration
- ✅ Customizable position
- ✅ Close button (optional)
- ✅ Prevents dismiss on clickaway
- ✅ Helper methods for quick notifications
- ✅ TypeScript support
- ✅ Context-based for global access

## Setup

Wrap your app with `SnackbarProvider`:

```tsx
import { SnackbarProvider } from '@/shared/components/venturo-ui';

function App() {
  return (
    <SnackbarProvider>
      {/* Your app content */}
    </SnackbarProvider>
  );
}
```

## Usage

### Quick Methods (Recommended)

The easiest way to show notifications:

```tsx
import { useSnackbar } from '@/shared/components/venturo-ui';

function MyComponent() {
  const snackbar = useSnackbar();

  // Success notification
  snackbar.success("Data saved successfully");

  // Error notification
  snackbar.error("Failed to save data");

  // Warning notification
  snackbar.warning("Connection is slow");

  // Info notification
  snackbar.info("New update available");
}
```

### Custom Snackbar

For advanced customization:

```tsx
import { useSnackbar } from '@/shared/components/venturo-ui';

function MyComponent() {
  const snackbar = useSnackbar();

  snackbar.showSnackbar({
    message: "Custom message",
    severity: "success",
    duration: 3000,
    anchorOrigin: { vertical: 'top', horizontal: 'center' },
    showCloseButton: true,
  });
}
```

## API Reference

### Quick Methods

All quick methods accept the same parameters:

```tsx
success(message: string | ReactNode, duration?: number): void
error(message: string | ReactNode, duration?: number): void
warning(message: string | ReactNode, duration?: number): void
info(message: string | ReactNode, duration?: number): void
```

**Parameters:**
- `message`: Text or React element to display
- `duration`: Auto-hide duration in milliseconds (default: 6000)

### showSnackbar Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `message` | `string \| ReactNode` | required | Message to display |
| `severity` | `'success' \| 'error' \| 'warning' \| 'info'` | `'success'` | Type of notification |
| `duration` | `number` | `6000` | Duration in ms before auto-hide |
| `anchorOrigin` | `{ vertical, horizontal }` | `{ vertical: 'top', horizontal: 'right' }` | Position of the snackbar |
| `showCloseButton` | `boolean` | `true` | Show close (X) button |
| `action` | `ReactNode` | - | Custom action button |

### Position Options

**Vertical:** `'top' | 'bottom'`
**Horizontal:** `'left' | 'center' | 'right'`

## Examples

### Basic Usage

```tsx
import { useSnackbar } from '@/shared/components/venturo-ui';
import { Button } from '@/shared/components/venturo-ui';

function Example() {
  const snackbar = useSnackbar();

  return (
    <div>
      <Button onClick={() => snackbar.success("Success!")}>
        Show Success
      </Button>
      <Button onClick={() => snackbar.error("Error occurred")}>
        Show Error
      </Button>
    </div>
  );
}
```

### With Custom Duration

```tsx
// Show for 3 seconds instead of default 6
snackbar.success("Quick message", 3000);

// Show for 10 seconds
snackbar.error("Important error", 10000);
```

### Custom Position

```tsx
snackbar.showSnackbar({
  message: "Top center notification",
  severity: "info",
  anchorOrigin: { vertical: 'top', horizontal: 'center' },
});
```

### Without Close Button

```tsx
snackbar.showSnackbar({
  message: "No close button",
  severity: "info",
  showCloseButton: false,
});
```

### With Custom Action

```tsx
snackbar.showSnackbar({
  message: "File deleted",
  severity: "success",
  action: (
    <Button size="sm" variant="ghost" onClick={handleUndo}>
      Undo
    </Button>
  ),
});
```

### In API Calls

```tsx
import { useSnackbar } from '@/shared/components/venturo-ui';

function UserForm() {
  const snackbar = useSnackbar();

  const handleSubmit = async (data) => {
    try {
      await saveUser(data);
      snackbar.success("User saved successfully");
    } catch (error) {
      snackbar.error(`Failed to save: ${error.message}`);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### With React Query

```tsx
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from '@/shared/components/venturo-ui';

function UserManagement() {
  const snackbar = useSnackbar();

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      snackbar.success("User created successfully");
    },
    onError: (error) => {
      snackbar.error(error.message);
    },
  });

  return <Button onClick={() => createMutation.mutate(data)}>Create</Button>;
}
```

### Combined with AlertDialog

Best practice for delete operations:

```tsx
import { useAlertDialog, useSnackbar } from '@/shared/components/venturo-ui';

function UserTable() {
  const { showAlert } = useAlertDialog();
  const snackbar = useSnackbar();

  const handleDelete = async (userId: string, userName: string) => {
    await showAlert({
      title: `Delete "${userName}"?`,
      message: "This action cannot be undone.",
      variant: "danger",
      onConfirm: async () => {
        await deleteUser(userId);
      },
      onSuccess: () => {
        snackbar.success(`User "${userName}" deleted successfully`);
      },
      onError: (error) => {
        snackbar.error(`Failed to delete: ${error.message}`);
      },
    });
  };

  return <Button onClick={() => handleDelete('123', 'John')}>Delete</Button>;
}
```

## Best Practices

### 1. Keep Messages Concise
```tsx
// Good
snackbar.success("Data saved");

// Too verbose
snackbar.success("The data has been successfully saved to the database");
```

### 2. Use Appropriate Severity
```tsx
// Success - for completed actions
snackbar.success("User created");

// Error - for failures
snackbar.error("Failed to connect");

// Warning - for non-critical issues
snackbar.warning("Connection is slow");

// Info - for informational messages
snackbar.info("New features available");
```

### 3. Adjust Duration Based on Importance
```tsx
// Quick message (3s)
snackbar.success("Copied to clipboard", 3000);

// Standard message (6s - default)
snackbar.success("Data saved successfully");

// Important message (10s)
snackbar.error("Connection lost. Retrying...", 10000);
```

### 4. Don't Overuse
```tsx
// Bad - too many notifications
users.forEach(user => {
  snackbar.success(`Deleted ${user.name}`);
});

// Good - single summary notification
snackbar.success(`Deleted ${users.length} users`);
```

## Common Use Cases

| Use Case | Severity | Example |
|----------|----------|---------|
| Data saved | success | "Changes saved" |
| Item created | success | "User created successfully" |
| Item deleted | success | "Item deleted" |
| API error | error | "Failed to load data" |
| Network error | error | "Connection failed" |
| Validation error | error | "Please fill required fields" |
| Session expiring | warning | "Session expires in 5 minutes" |
| Feature disabled | warning | "This feature is currently unavailable" |
| New update | info | "New version available" |
| Background task | info | "Export in progress..." |

## Comparison with AlertDialog

| Feature | Snackbar | AlertDialog |
|---------|----------|-------------|
| Purpose | Feedback notification | Confirmation/Decision |
| User Action | None required | Required (confirm/cancel) |
| Blocking | No (non-modal) | Yes (modal) |
| Auto-dismiss | Yes | No |
| Position | Corner/edge | Center |
| Use for | Success, Error, Info | Delete, Discard, Logout |

## Tips

- Snackbar automatically prevents dismiss on clickaway (user must click X or wait)
- Multiple snackbars will queue (only one shows at a time)
- Position defaults to top-right for better visibility
- Always provide clear, actionable messages
- Use shorter durations for less important messages
