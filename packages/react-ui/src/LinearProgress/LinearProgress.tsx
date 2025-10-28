import MuiLinearProgress, { LinearProgressProps as MuiLinearProgressProps } from '@mui/material/LinearProgress';
import React from 'react';

export type LinearProgressProps = MuiLinearProgressProps;

export const LinearProgress = React.forwardRef<HTMLSpanElement, LinearProgressProps>(
  (props, ref) => {
    return <MuiLinearProgress ref={ref} {...props} />;
  }
);

LinearProgress.displayName = 'LinearProgress';
