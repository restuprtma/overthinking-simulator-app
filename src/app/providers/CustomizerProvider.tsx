import { createContext, useState, ReactNode, useEffect, useLayoutEffect } from 'react';
import React from 'react';
import { storageService } from '@/app/services/storageService';

/**
 * Customizer Provider
 * Manages theme customization state with localStorage persistence
 */

const STORAGE_KEY = 'customizer-settings';

interface CustomizerConfig {
  activeDir: string;
  activeMode: string;
  activeTheme: string;
  activeLayout: string;
  isCardShadow: boolean;
  isLayout: string;
  isBorderRadius: number;
  isCollapse: string;
  isLanguage: string;
}

const defaultConfig: CustomizerConfig = {
  activeDir: 'ltr',
  activeMode: 'light',
  activeTheme: 'BLUE_THEME',
  activeLayout: 'horizontal',
  isCardShadow: true,
  isLayout: 'full',
  isBorderRadius: 4,
  isCollapse: 'full-sidebar',
  isLanguage: 'en',
};

// Load saved settings from localStorage or use defaults
const getInitialConfig = (): CustomizerConfig => {
  const savedConfig = storageService.get<CustomizerConfig>(STORAGE_KEY);
  return savedConfig ? { ...defaultConfig, ...savedConfig } : defaultConfig;
};

// Define the shape of the context state
interface CustomizerContextState {
  selectedIconId: number;
  setSelectedIconId: (id: number) => void;
  activeDir: string;
  setActiveDir: (dir: string) => void;
  activeMode: string;
  setActiveMode: (mode: string) => void;
  activeTheme: string;
  setActiveTheme: (theme: string) => void;
  activeLayout: string;
  setActiveLayout: (layout: string) => void;
  isCardShadow: boolean;
  setIsCardShadow: (shadow: boolean) => void;
  isLayout: string;
  setIsLayout: (layout: string) => void;
  isBorderRadius: number;
  setIsBorderRadius: (radius: number) => void;
  isCollapse: string;
  setIsCollapse: (collapse: string) => void;
  isLanguage: string;
  setIsLanguage: (language: string) => void;
}

// Create the context with an initial value
export const CustomizerContext = createContext<CustomizerContextState | any>(undefined);

// Define the type for the children prop
interface CustomizerContextProps {
  children: ReactNode;
}

// Create the provider component
export const CustomizerProvider: React.FC<CustomizerContextProps> = ({ children }) => {
  const initialConfig = getInitialConfig();
  
  const [selectedIconId, setSelectedIconId] = useState<number>(1);
  const [activeDir, setActiveDir] = useState<string>(initialConfig.activeDir);
  const [activeMode, setActiveMode] = useState<string>(initialConfig.activeMode);
  const [activeTheme, setActiveTheme] = useState<string>(initialConfig.activeTheme);
  const [activeLayout, setActiveLayout] = useState<string>(initialConfig.activeLayout);
  const [isCardShadow, setIsCardShadow] = useState<boolean>(initialConfig.isCardShadow);
  const [isLayout, setIsLayout] = useState<string>(initialConfig.isLayout);
  const [isBorderRadius, setIsBorderRadius] = useState<number>(initialConfig.isBorderRadius);
  const [isCollapse, setIsCollapse] = useState<string>(initialConfig.isCollapse);
  const [isLanguage, setIsLanguage] = useState<string>(initialConfig.isLanguage);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const config: CustomizerConfig = {
      activeDir,
      activeMode,
      activeTheme,
      activeLayout,
      isCardShadow,
      isLayout,
      isBorderRadius,
      isCollapse,
      isLanguage,
    };
    storageService.set(STORAGE_KEY, config);
  }, [activeDir, activeMode, activeTheme, activeLayout, isCardShadow, isLayout, isBorderRadius, isCollapse, isLanguage]);

  // Set DOM attributes synchronously before paint to prevent race conditions with theme creation
  useLayoutEffect(() => {
    document.documentElement.setAttribute('class', activeMode);
    document.documentElement.setAttribute('dir', activeDir);
    document.documentElement.setAttribute('data-color-theme', activeTheme);
    document.documentElement.setAttribute('data-layout', activeLayout);
    document.documentElement.setAttribute('data-boxed-layout', isLayout);
    document.documentElement.setAttribute('data-sidebar-type', isCollapse);
  }, [activeMode, activeDir, activeTheme, activeLayout, isLayout, isCollapse]);

  return (
    <CustomizerContext.Provider
      value={{
        selectedIconId,
        setSelectedIconId,
        activeDir,
        setActiveDir,
        activeMode,
        setActiveMode,
        activeTheme,
        setActiveTheme,
        activeLayout,
        setActiveLayout,
        isCardShadow,
        setIsCardShadow,
        isLayout,
        setIsLayout,
        isBorderRadius,
        setIsBorderRadius,
        isCollapse,
        setIsCollapse,
        isLanguage,
        setIsLanguage,
      }}
    >
      {children}
    </CustomizerContext.Provider>
  );
};
