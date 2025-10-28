import React from 'react';
import { cn } from '../utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant */
  variant?: 'solid' | 'outlined' | 'ghost' | 'link';
  /** Button color theme - matches palette colors from muiTheme.ts */
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'danger' | 'warning' | 'info' | 'grey';
  /** Button size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Full width button */
  fullWidth?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Icon before text */
  startIcon?: React.ReactNode;
  /** Icon after text */
  endIcon?: React.ReactNode;
  /** Pill shaped button (fully rounded) */
  pill?: boolean;
  /** Children content */
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'solid',
      color = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      startIcon,
      endIcon,
      pill = false,
      disabled,
      className,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    // Base styles
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50';

    // Size variants
    const sizeStyles = {
      xs: 'px-3 py-1.5 text-xs gap-1.5',
      sm: 'px-4 py-2 text-sm gap-2',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-5 py-3 text-base gap-2.5',
      xl: 'px-6 py-3.5 text-base gap-3',
    };

    // Solid variant colors (using project theme colors from muiTheme.ts)
    const solidColors = {
      primary: 'bg-primary text-white hover:bg-primaryemphasis focus:ring-lightprimary',
      secondary: 'bg-secondary text-white hover:bg-secondaryemphasis focus:ring-lightsecondary',
      success: 'bg-success text-white hover:bg-successemphasis focus:ring-lightsuccess',
      error: 'bg-error text-white hover:bg-erroremphasis focus:ring-lighterror',
      danger: 'bg-danger text-white hover:bg-danger-dark focus:ring-danger-light-active',
      warning: 'bg-warning text-white hover:bg-warningemphasis focus:ring-lightwarning',
      info: 'bg-info text-white hover:bg-infoemphasis focus:ring-lightinfo',
      grey: 'bg-muted text-link dark:text-white hover:bg-border dark:hover:bg-darkborder focus:ring-lighthover',
    };

    // Outlined variant colors
    const outlinedColors = {
      primary:
        'border border-primary text-primary hover:bg-primary hover:text-white focus:ring-lightprimary',
      secondary:
        'border border-secondary text-secondary hover:bg-secondary hover:text-white focus:ring-lightsecondary',
      success:
        'border border-success text-success hover:bg-success hover:text-white focus:ring-lightsuccess',
      error: 'border border-error text-error hover:bg-error hover:text-white focus:ring-lighterror',
      danger:
        'border border-danger text-danger hover:bg-danger hover:text-white focus:ring-danger-light-active',
      warning:
        'border border-warning text-warning hover:bg-warning hover:text-white focus:ring-lightwarning',
      info: 'border border-info text-info hover:bg-info hover:text-white focus:ring-lightinfo',
      grey: 'border border-border dark:border-darkborder text-link dark:text-white hover:bg-muted hover:text-link dark:hover:bg-darkmuted focus:ring-lighthover',
    };

    // Ghost variant colors
    const ghostColors = {
      primary: 'text-primary hover:bg-lightprimary focus:ring-lightprimary',
      secondary: 'text-secondary hover:bg-lightsecondary focus:ring-lightsecondary',
      success: 'text-success hover:bg-lightsuccess focus:ring-lightsuccess',
      error: 'text-error hover:bg-lighterror focus:ring-lighterror',
      danger: 'text-danger hover:bg-danger-light-active focus:ring-danger-light-active',
      warning: 'text-warning hover:bg-lightwarning focus:ring-lightwarning',
      info: 'text-info hover:bg-lightinfo focus:ring-lightinfo',
      grey: 'text-link dark:text-white hover:bg-lighthover dark:hover:bg-darkmuted focus:ring-lighthover',
    };

    // Link variant colors
    const linkColors = {
      primary: 'text-primary hover:underline focus:ring-0',
      secondary: 'text-secondary hover:underline focus:ring-0',
      success: 'text-success hover:underline focus:ring-0',
      error: 'text-error hover:underline focus:ring-0',
      danger: 'text-danger hover:underline focus:ring-0',
      warning: 'text-warning hover:underline focus:ring-0',
      info: 'text-info hover:underline focus:ring-0',
      grey: 'text-bodytext hover:underline focus:ring-0',
    };

    // Get color styles based on variant
    const getColorStyles = () => {
      switch (variant) {
        case 'outlined':
          return outlinedColors[color];
        case 'ghost':
          return ghostColors[color];
        case 'link':
          return linkColors[color];
        case 'solid':
        default:
          return solidColors[color];
      }
    };

    // Border radius
    const roundedStyles = pill ? 'rounded-full' : 'rounded-md';

    // Width
    const widthStyles = fullWidth ? 'w-full' : '';

    // Loading spinner component
    const Spinner = () => (
      <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          baseStyles,
          sizeStyles[size],
          getColorStyles(),
          roundedStyles,
          widthStyles,
          className,
        )}
        {...props}
      >
        {loading && <Spinner />}
        {!loading && startIcon && <span className="inline-flex">{startIcon}</span>}
        {children}
        {!loading && endIcon && <span className="inline-flex">{endIcon}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
