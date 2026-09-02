import type { PaletteColorNoChannels } from '../core';

import { primary, secondary } from '../core/palette';

// ----------------------------------------------------------------------

export type ThemeColorPreset = 'default' | 'preset1' | 'preset2';

export const primaryColorPresets: Record<ThemeColorPreset, PaletteColorNoChannels> = {
  default: {
    lighter: primary.lighter,
    light: primary.light,
    main: primary.main,
    dark: primary.dark,
    darker: primary.darker,
    contrastText: primary.contrastText,
  },
  // Indigo
  preset1: {
    lighter: '#E0E7FF',
    light: '#A5B4FC',
    main: '#4F46E5',
    dark: '#4338CA',
    darker: '#312E81',
    contrastText: '#FFFFFF',
  },
  // Deep blue
  preset2: {
    lighter: '#DBEAFE',
    light: '#93C5FD',
    main: '#1D4ED8',
    dark: '#1E40AF',
    darker: '#1E3A8A',
    contrastText: '#FFFFFF',
  },
};

export const secondaryColorPresets: Record<ThemeColorPreset, PaletteColorNoChannels> = {
  default: {
    lighter: secondary.lighter,
    light: secondary.light,
    main: secondary.main,
    dark: secondary.dark,
    darker: secondary.darker,
    contrastText: secondary.contrastText,
  },
  // Indigo — soft tints to pair with `preset1`
  preset1: {
    lighter: '#EEF2FF',
    light: '#E0E7FF',
    main: '#C7D2FE',
    dark: '#A5B4FC',
    darker: '#818CF8',
    contrastText: '#0F172A',
  },
  // Deep blue — soft tints to pair with `preset2`
  preset2: {
    lighter: '#EFF6FF',
    light: '#DBEAFE',
    main: '#BFDBFE',
    dark: '#93C5FD',
    darker: '#60A5FA',
    contrastText: '#0F172A',
  },
};
