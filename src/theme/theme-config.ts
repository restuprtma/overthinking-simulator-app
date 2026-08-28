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
    primary: 'Raleway',
    secondary: 'Lora',
  },
  /** **************************************
   * Palette
   *************************************** */
  palette: {
    primary: {
      lighter: '#EDE9FE',
      light: '#C4B5FD',
      main: '#8B5CF6',
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
      lighter: '#EDE9FE',
      light: '#C4B5FD',
      main: '#8B5CF6',
      dark: '#6D28D9',
      darker: '#4C1D95',
      contrastText: '#FFFFFF',
    },
    success: {
      lighter: '#D1FAE5',
      light: '#6EE7B7',
      main: '#059669',
      dark: '#047857',
      darker: '#065F46',
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
      50: '#FAF5FF',
      100: '#F5F0FF',
      200: '#EDE9FE',
      300: '#E2D9FD',
      400: '#C4B5FD',
      500: '#A78BFA',
      600: '#8B5CF6',
      700: '#6D28D9',
      800: '#4C1D95',
      900: '#3B157A',
    },
    common: {
      black: '#000000',
      white: '#FFFFFF',
    },
  },
};
