import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import React from 'react';

export type ButtonProps = MuiButtonProps;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return <MuiButton ref={ref} variant="contained" color="primary" {...props} />;
  }
);

Button.displayName = 'Button';
