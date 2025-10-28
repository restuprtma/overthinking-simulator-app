import MuiBadge, { BadgeProps as MuiBadgeProps } from '@mui/material/Badge';
import React from 'react';

export type BadgeProps = MuiBadgeProps;

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (props, ref) => {
    return <MuiBadge ref={ref} {...props} />;
  }
);

Badge.displayName = 'Badge';
