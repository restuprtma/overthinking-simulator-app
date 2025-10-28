# @venturo/react-ui

A comprehensive React UI component library built with Material-UI and Tailwind CSS, providing modern, accessible, and customizable components for your React applications.

## Features

- 🎨 **Modern Design** - Built with Material-UI v7 and Tailwind CSS
- 📦 **Tree-shakeable** - Only import what you need
- 🎯 **TypeScript First** - Full TypeScript support with comprehensive type definitions
- ♿ **Accessible** - WCAG compliant components
- 🎭 **Themeable** - Easy customization with MUI theming
- 📱 **Responsive** - Mobile-first design approach
- 🔋 **Batteries Included** - Form handling, dialogs, tables, and more

## Installation

```bash
npm install @venturo/react-ui
```

### Peer Dependencies

Make sure you have the required peer dependencies installed:

```bash
npm install react react-dom @mui/material @emotion/react @emotion/styled react-hook-form
```

## Usage

### Basic Example

```tsx
import { Button, TextField, Card } from '@venturo/react-ui';

function App() {
  return (
    <Card>
      <TextField label="Email" type="email" fullWidth />
      <Button color="primary" variant="solid">
        Submit
      </Button>
    </Card>
  );
}
```

### Form Example

```tsx
import { Form, FormTextField, Button } from '@venturo/react-ui';
import { useForm } from 'react-hook-form';

function LoginForm() {
  const form = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FormTextField
        name="email"
        label="Email"
        rules={{ required: 'Email is required' }}
      />
      <FormTextField
        name="password"
        type="password"
        label="Password"
        rules={{ required: 'Password is required' }}
      />
      <Button type="submit" color="primary">
        Login
      </Button>
    </Form>
  );
}
```

### Alert Dialog Example

```tsx
import { AlertDialogProvider, useAlertDialog, Button } from '@venturo/react-ui';

function App() {
  return (
    <AlertDialogProvider>
      <MyComponent />
    </AlertDialogProvider>
  );
}

function MyComponent() {
  const { confirm } = useAlertDialog();

  const handleDelete = async () => {
    const result = await confirm({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item?',
      variant: 'danger',
    });

    if (result) {
      // Handle deletion
    }
  };

  return <Button onClick={handleDelete}>Delete</Button>;
}
```

### Snackbar Example

```tsx
import { SnackbarProvider, useSnackbar, Button } from '@venturo/react-ui';

function App() {
  return (
    <SnackbarProvider>
      <MyComponent />
    </SnackbarProvider>
  );
}

function MyComponent() {
  const { success, error, info } = useSnackbar();

  return (
    <>
      <Button onClick={() => success('Operation successful!')}>
        Show Success
      </Button>
      <Button onClick={() => error('Something went wrong!')}>
        Show Error
      </Button>
    </>
  );
}
```

## Available Components

### Layout Components
- `Box` - Flexible container component
- `Container` - Centered content container
- `Grid` - Responsive grid layout
- `Stack` - Vertical/horizontal stack layout
- `Paper` - Material Design paper component
- `Card` - Card component with header, content, and actions
- `Divider` - Visual separator

### Form Components
- `Form` - Form wrapper with react-hook-form integration
- `TextField` / `FormTextField` - Text input field
- `Select` / `FormSelect` - Dropdown selection
- `Checkbox` / `FormCheckbox` - Checkbox input
- `Switch` - Toggle switch
- `FormControl` - Form control wrapper
- `FormHelperText` - Helper text for form fields

### Data Display
- `Table` - Basic table components
- `VenturoTable` - Advanced table with pagination, sorting, and filtering
- `Typography` - Text component with variants
- `Badge` - Small status indicator
- `Chip` - Compact element for tags/labels
- `TablePagination` - Pagination controls

### Feedback
- `Alert` - Alert messages
- `AlertDialogConfirmation` - Confirmation dialogs
- `SnackbarProvider` / `useSnackbar` - Toast notifications
- `CircularProgress` - Loading spinner

### Navigation
- `Tabs` / `Tab` / `TabPanel` - Tabbed navigation
- `Drawer` - Side drawer panel

### Inputs
- `Button` - Button component with variants
- `IconButton` - Icon-only button

### Overlays
- `Dialog` - Modal dialog
- `DialogTitle` / `DialogContent` / `DialogActions` - Dialog parts

## Tailwind CSS Configuration

Add the Venturo UI paths to your Tailwind configuration:

```js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@venturo/react-ui/dist/**/*.{js,mjs}',
  ],
  // ... rest of your config
};
```

## TypeScript

This library is written in TypeScript and includes type definitions. No additional @types packages are needed.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT © Venturo

## Support

For issues and questions, please visit our [GitHub repository](https://github.com/your-org/react-ui).