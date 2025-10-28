/**
 * Example usage of AlertDialogConfirmation
 * This file demonstrates various ways to use the AlertDialogConfirmation component
 */

import React from 'react';
import { Button } from '../Button';
import { useAlertDialog } from './useAlertDialog';
import { Trash2 } from 'lucide-react';

export const AlertDialogExample: React.FC = () => {
  const { showAlert } = useAlertDialog();

  // Example 1: Simple Confirmation (returns boolean)
  const handleSimpleConfirmation = async () => {
    const confirmed = await showAlert({
      title: "Delete '20 Mbps'?",
      message: "This action cannot be undone. Are you sure you want to delete this item?",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (confirmed) {
      console.log('User confirmed deletion');
      alert('Item would be deleted here');
    } else {
      console.log('User cancelled');
    }
  };

  // Example 2: With Action (automatic execution with loading state)
  const handleWithAction = async () => {
    await showAlert({
      title: "Delete User?",
      message: "This action cannot be undone. The user will be permanently deleted.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: async () => {
        // Simulate API call
        console.log('Deleting user...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('User deleted successfully');
      },
      onSuccess: () => {
        alert('User deleted successfully!');
      },
      onError: (error) => {
        alert(`Error: ${error.message}`);
      },
    });
  };

  // Example 3: With Error Handling
  const handleWithError = async () => {
    await showAlert({
      title: "Test Error Handling",
      message: "Click confirm to simulate an error.",
      confirmText: "Trigger Error",
      variant: "danger",
      onConfirm: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        throw new Error('This is a simulated error from the API');
      },
      onError: (error) => {
        console.error('Caught error:', error);
      },
    });
  };

  // Example 4: Warning Variant
  const handleWarning = async () => {
    const confirmed = await showAlert({
      title: "Proceed with caution",
      message: "This action may have unintended consequences. Are you sure you want to continue?",
      confirmText: "Proceed",
      cancelText: "Cancel",
      variant: "warning",
    });

    if (confirmed) {
      alert('Proceeding with action');
    }
  };

  // Example 5: Info Variant
  const handleInfo = async () => {
    await showAlert({
      title: "Information",
      message: "This is an informational message. Please read carefully before proceeding.",
      confirmText: "I Understand",
      cancelText: "Cancel",
      variant: "info",
    });
  };

  // Example 6: Success Variant
  const handleSuccess = async () => {
    await showAlert({
      title: "Success!",
      message: "Your operation completed successfully. Would you like to continue?",
      confirmText: "Continue",
      cancelText: "Close",
      variant: "success",
    });
  };

  // Example 7: Custom Icon
  const handleCustomIcon = async () => {
    await showAlert({
      title: "Delete Permanently",
      message: "This will permanently delete the selected items.",
      confirmText: "Delete",
      variant: "danger",
      icon: <Trash2 className="w-6 h-6" />,
    });
  };

  // Example 8: Hide Cancel Button
  const handleNoCancelButton = async () => {
    await showAlert({
      title: "Important Notice",
      message: "Please read and acknowledge this important information.",
      confirmText: "I Acknowledge",
      hideCancelButton: true,
      variant: "info",
    });
  };

  // Example 9: Custom Content
  const handleCustomContent = async () => {
    await showAlert({
      title: "Delete Multiple Items",
      message: "You are about to delete multiple items.",
      customContent: (
        <div>
          <p className="text-sm text-gray-600 mb-3">
            You are about to delete the following items:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            <li>Item 1 - Document.pdf</li>
            <li>Item 2 - Image.png</li>
            <li>Item 3 - Video.mp4</li>
          </ul>
          <p className="mt-3 text-sm text-red-600 font-medium">
            This action cannot be undone!
          </p>
        </div>
      ),
      confirmText: "Delete All",
      variant: "danger",
    });
  };

  // Example 10: Real-world Delete User Example
  const handleDeleteUser = async () => {
    const userName = "John Doe";
    const userId = "123";

    await showAlert({
      title: `Delete "${userName}"?`,
      message: "This action cannot be undone. Are you sure you want to delete this user?",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: async () => {
        // Simulate API call
        console.log(`Deleting user ${userId}...`);
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Uncomment to test error
        // throw new Error('Failed to delete user: Permission denied');
      },
      onSuccess: () => {
        alert(`User "${userName}" has been deleted successfully`);
      },
      onError: (error) => {
        alert(`Failed to delete user: ${error.message}`);
      },
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">AlertDialogConfirmation Examples</h1>
      <p className="text-gray-600 mb-8">
        Click the buttons below to see different variants and use cases of the AlertDialogConfirmation component.
      </p>

      <div className="space-y-6">
        {/* Basic Examples */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Basic Examples</h2>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSimpleConfirmation} color="danger">
              Simple Confirmation
            </Button>
            <Button onClick={handleWithAction} color="danger">
              With Action & Loading
            </Button>
            <Button onClick={handleWithError} color="danger">
              Test Error Handling
            </Button>
          </div>
        </section>

        {/* Variants */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Variants</h2>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSimpleConfirmation} color="danger">
              Danger
            </Button>
            <Button onClick={handleWarning} color="warning">
              Warning
            </Button>
            <Button onClick={handleInfo} color="info">
              Info
            </Button>
            <Button onClick={handleSuccess} color="success">
              Success
            </Button>
          </div>
        </section>

        {/* Customization */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Customization</h2>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleCustomIcon} color="danger">
              Custom Icon
            </Button>
            <Button onClick={handleNoCancelButton} color="info">
              No Cancel Button
            </Button>
            <Button onClick={handleCustomContent} color="danger">
              Custom Content
            </Button>
          </div>
        </section>

        {/* Real-world Example */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Real-world Example</h2>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleDeleteUser} color="danger" startIcon={<Trash2 size={16} />}>
              Delete User (Complete Example)
            </Button>
          </div>
        </section>

        {/* Notes */}
        <section className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
            Notes:
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-blue-800 dark:text-blue-200">
            <li>The dialog is draggable - try dragging it by the title bar!</li>
            <li>While loading, the dialog cannot be closed</li>
            <li>Errors are displayed within the dialog</li>
            <li>The dialog automatically closes on success</li>
            <li>Press ESC or click outside to cancel (when not loading)</li>
          </ul>
        </section>
      </div>
    </div>
  );
};
