import MuiTooltip, { TooltipProps as MuiTooltipProps } from '@mui/material/Tooltip';
import React from 'react';

export type TooltipProps = MuiTooltipProps & {
  /**
   * Tooltip title/content
   */
  title: NonNullable<React.ReactNode>;
  /**
   * Enable arrow on tooltip
   * @default true
   */
  arrow?: boolean;
};

/**
 * Tooltip component wrapper for MUI Tooltip with arrow enabled by default
 *
 * @example
 * ```tsx
 * <Tooltip title="Add">
 *   <Button>Arrow</Button>
 * </Tooltip>
 * ```
 */
export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ arrow = true, ...props }, ref) => {
    return (
      <MuiTooltip
        ref={ref}
        arrow={arrow}
        {...props}
      />
    );
  }
);

Tooltip.displayName = 'Tooltip';
