import { createTheme, Theme } from '@mui/material/styles';
import { getMuiComponentOverrides } from './muiComponentOverrides';
import { getThemeColors } from './themeColors';

/**
 * Get CSS variable value from the document root
 * Reads directly from CSS custom properties defined in default-colors.css
 */
const getCSSVariable = (variable: string, fallback: string = ''): string => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim() || fallback;
  }
  return fallback;
};

/**
 * Material-UI Theme Configuration
 * Reads colors directly from CSS variables for consistency across the entire app
 */
const createVenturoTheme = (
  mode: 'light' | 'dark' = 'light',
  activeTheme: string = 'BLUE_THEME'
): Theme => {
  // Get theme-specific colors from CSS variables (fallback to hardcoded for SSR)
  const themeColors = getThemeColors(activeTheme);

  // Create base theme first
  const baseTheme = createTheme({
    palette: {
      mode,
      primary: {
        main: getCSSVariable('--color-primary-500', themeColors.primary),
        dark: getCSSVariable('--color-primary-700', themeColors.primaryDark),
        light: getCSSVariable('--color-primary-100', themeColors.primaryLight),
        contrastText: '#ffffff',
      },
      secondary: {
        main: getCSSVariable('--color-secondary-500', themeColors.secondary),
        dark: getCSSVariable('--color-secondary-700', themeColors.secondaryDark),
        light: getCSSVariable('--color-secondary-100', themeColors.secondaryLight),
        contrastText: '#ffffff',
      },
      error: {
        main: getCSSVariable('--color-error-500', '#dc3545'),
        dark: getCSSVariable('--color-error-700', '#9c2631'),
        light: getCSSVariable('--color-error-100', '#f4c0c5'),
        contrastText: '#ffffff',
      },
      warning: {
        main: getCSSVariable('--color-warning-500', '#ffc107'),
        dark: getCSSVariable('--color-warning-700', '#b58905'),
        light: getCSSVariable('--color-warning-100', '#ffecb2'),
        contrastText: '#ffffff',
      },
      info: {
        main: getCSSVariable('--color-info-500', '#17a2b8'),
        dark: getCSSVariable('--color-info-700', '#107383'),
        light: getCSSVariable('--color-info-100', '#b7e2e9'),
        contrastText: '#ffffff',
      },
      success: {
        main: getCSSVariable('--color-success-500', '#28a745'),
        dark: getCSSVariable('--color-success-700', '#1c7731'),
        light: getCSSVariable('--color-success-100', '#bce4c5'),
        contrastText: '#ffffff',
      },
      grey: {
        50: getCSSVariable('--color-neutral-50', '#c7c7c7'),
        100: getCSSVariable('--color-neutral-100', '#868686'),
        200: getCSSVariable('--color-neutral-200', '#787878'),
        300: getCSSVariable('--color-neutral-300', '#6b6b6b'),
        400: getCSSVariable('--color-neutral-400', '#5f5f5f'),
        500: getCSSVariable('--color-neutral-500', '#525252'),
        600: getCSSVariable('--color-neutral-600', '#474747'),
        700: getCSSVariable('--color-neutral-700', '#373737'),
        800: getCSSVariable('--color-neutral-800', '#292929'),
        900: getCSSVariable('--color-neutral-900', '#1e1e1e'),
      },
      background: {
        default: mode === 'light'
          ? getCSSVariable('--color-neutral-20', '#f6f6f6')
          : getCSSVariable('--color-neutral-900', '#1e1e1e'),
        paper: mode === 'light'
          ? getCSSVariable('--color-neutral-0', '#ffffff')
          : getCSSVariable('--color-neutral-900', '#1e1e1e'),
      },
      text: {
        primary: mode === 'light'
          ? getCSSVariable('--color-neutral-800', '#292929')
          : getCSSVariable('--color-neutral-0', '#ffffff'),
        secondary: getCSSVariable('--color-neutral-100', '#868686'),
        disabled: getCSSVariable('--color-neutral-200', '#787878'),
      },
      divider: mode === 'light'
        ? getCSSVariable('--color-neutral-40', '#e2e2e2')
        : getCSSVariable('--color-neutral-700', '#373737'),
    },
    typography: {
      fontFamily: 'Manrope, system-ui, serif',
      fontSize: 14,
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
      },
      body1: {
        fontSize: '0.875rem', // 14px
      },
      body2: {
        fontSize: '0.8125rem', // 13px
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    shadows: [
      'none',
      '0px 2px 4px -1px rgba(175, 182, 201, 0.2)', // md
      '0px 2px 4px -1px rgba(175, 182, 201, 0.2)',
      '0px 2px 4px -1px rgba(175, 182, 201, 0.2)',
      'rgba(145, 158, 171, 0.3) 0px 0px 2px 0px, rgba(145, 158, 171, 0.02) 0px 12px 24px -4px', // dark-md
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
    ],
  });

  // Apply component overrides
  return createTheme({
    ...baseTheme,
    components: getMuiComponentOverrides(baseTheme),
  });
};

export default createVenturoTheme;
