import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Paper, { PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { AlertTriangle, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../Button';
import { AlertDialogState, AlertDialogVariant } from './AlertDialogConfirmation.types';
import { cn } from '../utils';

// Draggable Paper Component
function DraggablePaperComponent(props: PaperProps) {
  const nodeRef = React.useRef(null);

  return (
    <Draggable
      nodeRef={nodeRef}
      handle="#alert-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper ref={nodeRef} {...props} />
    </Draggable>
  );
}

interface AlertDialogConfirmationProps {
  state: AlertDialogState;
  onConfirm: () => void;
  onCancel: () => void;
}

// Variant configurations
const variantConfig: Record<AlertDialogVariant, {
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  confirmButtonColor: 'danger' | 'warning' | 'info' | 'success';
}> = {
  danger: {
    icon: <AlertTriangle className="w-6 h-6" />,
    iconBgColor: 'bg-red-50 dark:bg-red-900/20',
    iconColor: 'text-red-600 dark:text-red-400',
    confirmButtonColor: 'danger',
  },
  warning: {
    icon: <AlertCircle className="w-6 h-6" />,
    iconBgColor: 'bg-orange-50 dark:bg-orange-900/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
    confirmButtonColor: 'warning',
  },
  info: {
    icon: <Info className="w-6 h-6" />,
    iconBgColor: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    confirmButtonColor: 'info',
  },
  success: {
    icon: <CheckCircle2 className="w-6 h-6" />,
    iconBgColor: 'bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400',
    confirmButtonColor: 'success',
  },
};

export const AlertDialogConfirmation: React.FC<AlertDialogConfirmationProps> = ({
  state,
  onConfirm,
  onCancel,
}) => {
  const variant = state.variant || 'danger';
  const config = variantConfig[variant];
  const displayIcon = state.icon || config.icon;

  return (
    <Dialog
      open={state.open}
      onClose={state.loading ? undefined : onCancel}
      PaperComponent={DraggablePaperComponent}
      aria-labelledby="alert-dialog-title"
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        },
      }}
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          cursor: 'move',
          userSelect: 'none',
          pb: 2,
          pt: 3,
          px: 3,
        }}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={cn(
            'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center',
            config.iconBgColor
          )}>
            <div className={config.iconColor}>
              {displayIcon}
            </div>
          </div>

          {/* Title */}
          <div className="flex-1 pt-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {state.title}
            </h3>
          </div>
        </div>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 2 }}>
        {/* Custom content or message */}
        {state.customContent ? (
          <div className="mt-2">{state.customContent}</div>
        ) : (
          <div className="ml-[60px] mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {state.message}
            </p>
          </div>
        )}

        {/* Error message */}
        {state.error && (
          <div className="mt-3 ml-[60px]">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-600 dark:text-red-400">
                {state.error}
              </p>
            </div>
          </div>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <div className="flex gap-2 w-full justify-end">
          {!state.hideCancelButton && (
            <Button
              variant="outlined"
              color="grey"
              onClick={onCancel}
              disabled={state.loading}
              size="md"
            >
              {state.cancelText || 'Cancel'}
            </Button>
          )}
          <Button
            variant="solid"
            color={config.confirmButtonColor}
            onClick={onConfirm}
            loading={state.loading}
            disabled={state.loading}
            size="md"
            autoFocus
          >
            {state.confirmText || 'Confirm'}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

AlertDialogConfirmation.displayName = 'AlertDialogConfirmation';
