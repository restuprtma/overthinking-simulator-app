import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import React from 'react';

export type TextFieldProps = MuiTextFieldProps;

export const TextField = React.forwardRef<HTMLDivElement, TextFieldProps>((props, ref) => {
  return (
    <MuiTextField
      variant="outlined"
      ref={ref}
      InputLabelProps={{
        sx: { color: 'text.secondary' },
        ...props.InputLabelProps,
      }}
      {...props}
    />
  );
});

TextField.displayName = 'TextField';
