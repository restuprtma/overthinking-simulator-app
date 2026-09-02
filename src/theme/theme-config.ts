import type { Theme, Direction, CommonColors, ThemeProviderProps } from '@mui/material/styles';
import type { ThemeCssVariables } from './types';
import type { PaletteColorKey, PaletteColorNoChannels } from './core/palette';

// ----------------------------------------------------------------------

export type ThemeConfig = {
  direction: Direction;
  classesPrefix: string;
  cssVariables: ThemeCssVariables;
  defaultMode: ThemeProviderProps<Theme>['defaultMode'];
  modeStorageKey: ThemeProviderProps<Theme>['modeStorageKey'];
  fontFamily: Record<'primary' | 'secondary', string>;
  palette: Record<PaletteColorKey, PaletteColorNoChannels> & {
    common: Pick<CommonColors, 'black' | 'white'>;
    grey: {
      [K in 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 as `${K}`]: string;
    };
  };
};

export const themeConfig: ThemeConfig = {
  /** **************************************
   * Base
   *************************************** */
  defaultMode: 'light',
  modeStorageKey: 'theme-mode',
  direction: 'ltr',
  classesPrefix: 'minimal',
  /** **************************************
   * Css variables
   *************************************** */
  cssVariables: {
    cssVarPrefix: '',
    colorSchemeSelector: 'data-color-scheme',
  },
  /** **************************************
   * Typography
   *************************************** */
  fontFamily: {
    primary: 'Poppins',
    secondary: 'Poppins',
  },
  /** **************************************
   * Palette
   *************************************** */
  palette: {
    primary: {
      lighter: '#EDE9FE',
      light: '#8B5CF6',
      main: '#7C3AED',
      dark: '#6D28D9',
      darker: '#4C1D95',
      contrastText: '#FFFFFF',
    },
    secondary: {
      lighter: '#F5F3FF',
      light: '#DDD6FE',
      main: '#C4B5FD',
      dark: '#A78BFA',
      darker: '#8B5CF6',
      contrastText: '#0F172A',
    },
    info: {
      lighter: '#CFFAFE',
      light: '#67E8F9',
      main: '#0E7490',
      dark: '#155E75',
      darker: '#164E63',
      contrastText: '#FFFFFF',
    },
    success: {
      lighter: '#D1FAE5',
      light: '#6EE7B7',
      main: '#047857',
      dark: '#065F46',
      darker: '#064E3B',
      contrastText: '#FFFFFF',
    },
    warning: {
      lighter: '#FFF5CC',
      light: '#FFD666',
      main: '#FFAB00',
      dark: '#B76E00',
      darker: '#7A4100',
      contrastText: '#1C252E',
    },
    error: {
      lighter: '#FEE2E2',
      light: '#FCA5A5',
      main: '#DC2626',
      dark: '#B91C1C',
      darker: '#7F1D1D',
      contrastText: '#FFFFFF',
    },
    grey: {
      50: '#FAF7FF',
      100: '#F3F1FA',
      200: '#E7E9F1',
      300: '#D2D7E2',
      400: '#A6AFC0',
      500: '#7E8CA0',
      600: '#5B6A80',
      700: '#475569',
      800: '#334155',
      900: '#1E293B',
    },
    common: {
      black: '#000000',
      white: '#FFFFFF',
    },
  },
};
