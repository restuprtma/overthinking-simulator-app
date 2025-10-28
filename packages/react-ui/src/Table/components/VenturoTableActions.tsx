import { useState } from 'react';
import { IconButton } from '../../IconButton';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '../../Dialog';
import { Button } from '../../Button';
import { Typography } from '../../Typography';
import { Tooltip } from '../../Tooltip';
import type { VenturoTableAction } from '../VenturoTable.types';

interface VenturoTableActionsProps<TData> {
  row: TData;
  actions: VenturoTableAction<TData>[];
}

export function VenturoTableActions<TData>({ row, actions }: VenturoTableActionsProps<TData>) {
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: VenturoTableAction<TData> | null;
  }>({
    open: false,
    action: null,
  });

  const handleActionClick = (action: VenturoTableAction<TData>) => {
    if (action.needsConfirmation) {
      setConfirmDialog({ open: true, action });
    } else {
      action.onClick(row);
    }
  };

  const handleConfirm = () => {
    if (confirmDialog.action) {
      confirmDialog.action.onClick(row);
    }
    setConfirmDialog({ open: false, action: null });
  };

  const handleCancel = () => {
    setConfirmDialog({ open: false, action: null });
  };

  const isDisabled = (action: VenturoTableAction<TData>): boolean => {
    if (typeof action.disabled === 'function') {
      return action.disabled(row);
    }
    return action.disabled || false;
  };

  const getButtonColor = (actionColor?: string): 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'danger' | 'grey' => {
    // Map 'inherit' to 'grey' or provide a valid default
    if (!actionColor || actionColor === 'inherit') {
      return 'grey';
    }
    // Type assertion is safe here since we control the valid values
    return actionColor as 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'danger' | 'grey';
  };

  const getTooltipText = (action: VenturoTableAction<TData>): string => {
    if (typeof action.tooltip === 'function') {
      return action.tooltip(row);
    }
    return action.tooltip || '';
  };

  return (
    <>
      {/* <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}> */}
      {actions.map((action, index) => {
        const disabled = isDisabled(action);
        const button = (
          <IconButton
            size="small"
            color={action.color || 'default'}
            onClick={() => handleActionClick(action)}
            disabled={disabled}
          >
            {action.icon}
          </IconButton>
        );

        // Wrap with Tooltip if tooltip prop is provided
        if (action.tooltip) {
          return (
            <Tooltip key={index} title={getTooltipText(action)}>
              <span style={{ display: 'inline-block' }}>
                {button}
              </span>
            </Tooltip>
          );
        }

        return <span key={index} style={{ display: 'inline-block' }}>{button}</span>;
      })}
      {/* </Box> */}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={handleCancel}>
        <DialogTitle>{confirmDialog.action?.confirmationTitle || 'Confirm Action'}</DialogTitle>
        <DialogContent>
          <Typography>
            {confirmDialog.action?.confirmationMessage
              ? confirmDialog.action.confirmationMessage(row)
              : 'Are you sure you want to perform this action?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="grey">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            color={getButtonColor(confirmDialog.action?.color)}
            variant="solid"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
