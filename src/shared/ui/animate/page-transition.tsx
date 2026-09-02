import type { Variants } from 'framer-motion';
import type { BoxProps } from '@mui/material/Box';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';

import { toSeconds, motionTokens } from 'src/theme/core/motion';

import { reducedVariants, useReducedMotionSafe } from './use-reduced-motion-safe';

// ----------------------------------------------------------------------
// Route-level cross-fade.
//
// Design constraint: NO horizontal slide. The dashboard sidebar is
// `position: fixed`, so sliding page content sideways underneath a static
// sidebar reads as jank, not polish — the two planes visibly disagree about
// whether the app moved. A cross-fade plus a `distance.nudge` (8px) lift is
// enough to signal "new context" without fighting the shell.
//
// The lift is applied on ENTER only. On exit the page just fades: pushing
// content back down while the next route is already rising would double the
// perceived motion.
//
// Exit timing uses the `quick` token (200ms) so leaving is clearly faster than
// arriving (the user has already committed to the navigation). There is no
// ~180ms token and inventing one would defeat the point of `motion.ts`, so
// `duration.quick` is the closest sanctioned value.

const pageVariants: Variants = {
  initial: { opacity: 0, y: motionTokens.distance.nudge },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: toSeconds(motionTokens.duration.standard),
      ease: motionTokens.easing.signature,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: toSeconds(motionTokens.duration.quick),
      ease: motionTokens.easing.exit,
    },
  },
};

// ----------------------------------------------------------------------

export type PageTransitionProps = BoxProps & {
  children: React.ReactNode;
};

/**
 * Wraps a route body in a cross-fade entrance.
 *
 * Safe to use without an `<AnimatePresence>` parent: the enter animation always
 * runs on mount, and the `exit` variant is simply never triggered because
 * nothing detains the subtree — React unmounts it directly. Add
 * `<AnimatePresence mode="wait">` around the router outlet if the exit beat is
 * wanted too.
 */
export function PageTransition({ children, sx, ...other }: PageTransitionProps) {
  const reduceMotion = useReducedMotionSafe();

  return (
    <Box
      component={m.div}
      variants={reduceMotion ? reducedVariants(pageVariants) : pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      sx={sx}
      {...other}
    >
      {children}
    </Box>
  );
}
