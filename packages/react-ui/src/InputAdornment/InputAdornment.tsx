import MuiInputAdornment, { InputAdornmentProps as MuiInputAdornmentProps } from '@mui/material/InputAdornment';
import React from 'react';

export type InputAdornmentProps = MuiInputAdornmentProps;

export const InputAdornment = React.forwardRef<HTMLDivElement, InputAdornmentProps>(
  (props, ref) => {
    return <MuiInputAdornment ref={ref} {...props} />;
  }
);

InputAdornment.displayName = 'InputAdornment';
