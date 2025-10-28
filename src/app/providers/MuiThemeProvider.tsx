import { FC, ReactNode, useState, useLayoutEffect, useContext } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CustomizerContext } from './CustomizerProvider';
import createVenturoTheme from '@/shared/theme/muiTheme';

interface MuiThemeProviderProps {
  children: ReactNode;
}

/**
 * MUI Theme Provider
 * Integrates with CustomizerProvider for theme mode (light/dark)
 * Note: CssBaseline removed to prevent overriding existing global styles
 */
export const MuiThemeProvider: FC<MuiThemeProviderProps> = ({ children }) => {
  const { activeMode, activeTheme } = useContext(CustomizerContext);

  // Initialize theme state with current mode and theme color
  const [theme, setTheme] = useState(() =>
    createVenturoTheme(activeMode === 'dark' ? 'dark' : 'light', activeTheme)
  );

  // Update theme when mode or theme color changes
  // useLayoutEffect ensures theme is updated before paint for immediate visual updates
  useLayoutEffect(() => {
    setTheme(createVenturoTheme(activeMode === 'dark' ? 'dark' : 'light', activeTheme));
  }, [activeMode, activeTheme]);

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};
