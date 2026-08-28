import type { Theme, Components, ComponentsVariants } from '@mui/material/styles';

import { colorKeys } from '../palette';

// ----------------------------------------------------------------------

/**
 * TypeScript extension for MUI theme augmentation.
 * @to {@link file://./../../extend-theme-types.d.ts}
 */
export type IconButtonExtendColor = { black: true; white: true };

type IconButtonVariants = ComponentsVariants<Theme>['MuiIconButton'];

/* **********************************************************************
 * 🗳️ Variants
 * **********************************************************************/
const colorVariants = [
  ...(colorKeys.common.map((colorKey) => ({
    props: (props) => props.color === colorKey,
    style: ({ theme }) => ({
      color: theme.vars.palette.common[colorKey],
    }),
  })) satisfies IconButtonVariants),
] satisfies IconButtonVariants;

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/
const MuiIconButton: Components<Theme>['MuiIconButton'] = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      minWidth: 44,
      minHeight: 44,
      transition: theme.transitions.create(['background-color', 'color'], {
        duration: theme.transitions.duration.shortest,
      }),
      variants: [...colorVariants],
    }),
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const iconButton: Components<Theme> = {
  MuiIconButton,
};
