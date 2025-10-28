import MuiBox, { BoxProps as MuiBoxProps } from '@mui/material/Box';
import React from 'react';

export type BoxProps = MuiBoxProps;

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  (props, ref) => {
    const { sx, ...otherProps } = props;
    return <MuiBox ref={ref} sx={sx} {...otherProps} />;
  }
);

Box.displayName = 'Box';
