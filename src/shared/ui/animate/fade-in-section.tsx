import type { MotionProps } from 'framer-motion';
import type { BoxProps } from '@mui/material/Box';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';

import { varReveal } from './variants';
import { reducedVariants, useReducedMotionSafe } from './use-reduced-motion-safe';

// ----------------------------------------------------------------------
// Entrance-on-mount primitive: the block fades and travels a short distance
// once, when it mounts.
//
// Deliberately NOT a scroll-reveal component — there is no `whileInView` here.
// Scroll reveal is skipped app-wide: no page in this product has long scrolling
// content, and a generic fade-slide-up on every section is precisely the
// "animation overload" anti-pattern the project forbids. Use `MotionViewport`
// if a viewport-triggered container is ever genuinely needed.
//
// All timing/travel comes from `varReveal`, i.e. from motion tokens.

export type FadeInSectionProps = BoxProps &
  MotionProps & {
    direction?: 'up' | 'left' | 'right' | 'none';
    /** Delay before the entrance starts, in ms. */
    delay?: number;
    /** Travel distance in px. Defaults to `motionTokens.distance.enter`. */
    distance?: number;
    /** Entrance duration in ms. Defaults to `motionTokens.duration.standard`. */
    duration?: number;
  };

export function FadeInSection({
  sx,
  delay,
  children,
  distance,
  duration,
  direction = 'up',
  ...other
}: FadeInSectionProps) {
  const reduceMotion = useReducedMotionSafe();

  const variants = varReveal(direction, { delay, distance, duration });

  return (
    <Box
      component={m.div}
      variants={reduceMotion ? reducedVariants(variants) : variants}
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
