import MuiDialog, { DialogProps as MuiDialogProps } from '@mui/material/Dialog';
import MuiDialogTitle, { DialogTitleProps as MuiDialogTitleProps } from '@mui/material/DialogTitle';
import MuiDialogContent, {
  DialogContentProps as MuiDialogContentProps,
} from '@mui/material/DialogContent';
import MuiDialogActions, {
  DialogActionsProps as MuiDialogActionsProps,
} from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';

export type DialogProps = MuiDialogProps;
export interface DialogTitleProps extends MuiDialogTitleProps {
  onClose?: () => void;
  showCloseButton?: boolean;
}
export type DialogContentProps = MuiDialogContentProps;
export type DialogActionsProps = MuiDialogActionsProps;

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>((props, ref) => {
  const { sx, onClose, ...otherProps } = props;

  const handleClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
    // Prevent closing on backdrop click
    if (reason === 'backdropClick') {
      return;
    }
    // Allow closing via escape key or custom close handlers
    if (onClose) {
      onClose(event, reason);
    }
  };

  return (
    <MuiDialog
      ref={ref}
      scroll="paper"
      disableEscapeKeyDown={false}
      {...otherProps}
      onClose={handleClose}
      sx={{
        '& .MuiDialog-paper': {
          padding: 0,
        },
        ...sx,
      }}
    />
  );
});

export const DialogTitle = React.forwardRef<HTMLDivElement, DialogTitleProps>((props, ref) => {
  const { sx, onClose, showCloseButton = true, children, ...otherProps } = props;
  return (
    <MuiDialogTitle
      ref={ref}
      {...otherProps}
      sx={{
        typography: 'h6',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...sx,
      }}
    >
      {children}
      {showCloseButton && onClose && (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
            '&:hover': {
              backgroundColor: 'transparent',
              color: (theme) => theme.palette.primary.main,
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
    </MuiDialogTitle>
  );
});

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>((props, ref) => {
  const { sx, ...otherProps } = props;
  return (
    <MuiDialogContent
      ref={ref}
      {...otherProps}
      sx={{
        marginTop: 0.5,
        ...sx,
      }}
    />
  );
});

export const DialogActions = React.forwardRef<HTMLDivElement, DialogActionsProps>((props, ref) => {
  const { sx, ...otherProps } = props;
  return (
    <MuiDialogActions
      ref={ref}
      {...otherProps}
      sx={{
        borderTop: '1px solid rgba(0, 0, 0, 0.12)',
        paddingX: 3,
        paddingY: 1.5,
        ...sx,
      }}
    />
  );
});

Dialog.displayName = 'Dialog';
DialogTitle.displayName = 'DialogTitle';
DialogContent.displayName = 'DialogContent';
DialogActions.displayName = 'DialogActions';
