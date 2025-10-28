/**
 * Theme Color Definitions
 * Matches the CSS variables defined in src/shared/theme/default-colors.css
 * Used by Material-UI theme to avoid race conditions with CSS variable computation
 */

export interface ThemeColorPalette {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
}

export const THEME_COLORS: Record<string, ThemeColorPalette> = {
  DEFAULT_THEME: {
    primary: '#e34234',           // primary-500
    primaryLight: '#f6c4c0',      // primary-100
    primaryDark: '#a12f25',       // primary-700
    secondary: '#1e90ff',         // secondary-500
    secondaryLight: '#b9ddff',    // secondary-100
    secondaryDark: '#1566b5',     // secondary-700
  },
  BLUE_THEME: {
    primary: '#e34234',           // primary-500
    primaryLight: '#f6c4c0',      // primary-100
    primaryDark: '#a12f25',       // primary-700
    secondary: '#1e90ff',         // secondary-500
    secondaryLight: '#b9ddff',    // secondary-100
    secondaryDark: '#1566b5',     // secondary-700
  },
  AQUA_THEME: {
    primary: '#0074BA',
    primaryLight: 'rgba(0, 116, 186, 0.125)',
    primaryDark: '#00639e',
    secondary: '#47D7BC',
    secondaryLight: 'rgba(71, 215, 188, 0.125)',
    secondaryDark: '#3cb7a0',
  },
  PURPLE_THEME: {
    primary: '#763EBD',
    primaryLight: 'rgba(118, 62, 189, 0.125)',
    primaryDark: '#6435a1',
    secondary: '#49BEFF',
    secondaryLight: 'rgba(73, 190, 255, 0.125)',
    secondaryDark: '#7fb0b5',
  },
  GREEN_THEME: {
    primary: '#0A7EA4',
    primaryLight: 'rgba(10, 126, 164, 0.125)',
    primaryDark: '#096b8b',
    secondary: '#CCDA4E',
    secondaryLight: 'rgba(204, 218, 78, 0.125)',
    secondaryDark: '#d4e069',
  },
  CYAN_THEME: {
    primary: '#01C0C8',
    primaryLight: 'rgba(1, 192, 200, 0.125)',
    primaryDark: '#01a3aa',
    secondary: '#FB9678',
    secondaryLight: 'rgba(251, 150, 120, 0.125)',
    secondaryDark: '#d58066',
  },
  ORANGE_THEME: {
    primary: '#FA896B',
    primaryLight: 'rgba(250, 137, 107, 0.125)',
    primaryDark: '#d5745b',
    secondary: '#0074BA',
    secondaryLight: 'rgba(0, 116, 186, 0.125)',
    secondaryDark: '#00639e',
  },
};

// Default theme colors (fallback)
export const DEFAULT_THEME_COLORS = THEME_COLORS.DEFAULT_THEME;

/**
 * Get theme colors for a specific theme
 */
export const getThemeColors = (themeName: string): ThemeColorPalette => {
  return THEME_COLORS[themeName] || DEFAULT_THEME_COLORS;
};
