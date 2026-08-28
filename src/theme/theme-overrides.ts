import type { ThemeOptions } from './types';

import { createPaletteChannel } from 'minimal-shared/utils';

// ----------------------------------------------------------------------

export const themeOverrides: ThemeOptions = {
  colorSchemes: {
    light: {
      palette: {
        primary: createPaletteChannel({
          lighter: '#EDE9FE',
          light: '#C4B5FD',
          main: '#8B5CF6',
          dark: '#6D28D9',
          darker: '#4C1D95',
          contrastText: '#FFFFFF',
        }),
      },
    },
  },
};
