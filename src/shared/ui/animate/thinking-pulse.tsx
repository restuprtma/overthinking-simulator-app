import type { Transition } from 'framer-motion';
import type { BoxProps } from '@mui/material/Box';
import type { Theme, SxProps } from '@mui/material/styles';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';

import { toSeconds, motionTokens } from 'src/theme/core/motion';

import { useReducedMotionSafe } from './use-reduced-motion-safe';

// ----------------------------------------------------------------------
// Three dots pulsing in sequence while the LLM call is in flight.
//
// This is the ONLY ambient/looping animation sanctioned in the entire app, and
// it is functional rather than decorative: the backend round-trip takes real
// seconds, and the loop is what says "the system is alive, not stuck". Every
// other animation in this kit is a one-shot entrance.
//
// a11y, non-negotiable: under `prefers-reduced-motion` the dots render STATIC
// with no animation whatsoever. The rule is "never auto-play loops" — a
// shortened loop is still a loop, so shortening is not an acceptable fallback.
//
// The element is `aria-hidden` because it is decorative reinforcement. The
// loading state itself must be conveyed by text elsewhere; motion alone is not
// an accessible status.

const DOT_COUNT = 3;

/**
 * Pulse amplitudes. Not motion tokens — `motion.ts` tokenises time and
 * distance, not opacity/scale range, and there is no existing token to borrow.
 * Kept shallow on purpose so the loop reads as breathing, not blinking.
 */
const OPACITY_RANGE = [0.3, 1, 0.3];

const SCALE_RANGE = [0.85, 1, 0.85];

/**
 * One full cycle. `duration.reveal` (1200ms) is the only token in the slow band
 * and matches the ~1.2s target for an ambient loop.
 */
const pulseTransition = (delay: number): Transition => ({
  duration: toSeconds(motionTokens.duration.reveal),
  ease: motionTokens.easing.ambient,
  repeat: Infinity,
  repeatType: 'loop',
  delay: toSeconds(delay),
});

/**
 * Dot geometry and color. Sized from theme spacing and painted with
 * `currentColor` so the parent owns the hue — persona-tinted or plain text
 * color, never a hex literal here.
 */
const dotSx: SxProps<Theme> = (theme) => ({
  display: 'block',
  borderRadius: '50%',
  bgcolor: 'currentColor',
  width: theme.spacing(0.75),
  height: theme.spacing(0.75),
});

// ----------------------------------------------------------------------

export type ThinkingPulseProps = BoxProps;

export function ThinkingPulse({ sx, ...other }: ThinkingPulseProps) {
  const reduceMotion = useReducedMotionSafe();

  return (
    <Box
      aria-hidden="true"
      sx={[
        { gap: 0.5, display: 'inline-flex', alignItems: 'center' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {Array.from({ length: DOT_COUNT }, (_, index) =>
        reduceMotion ? (
          <Box key={index} component="span" sx={dotSx} />
        ) : (
          <Box
            key={index}
            component={m.span}
            animate={{ opacity: OPACITY_RANGE, scale: SCALE_RANGE }}
            transition={pulseTransition(index * motionTokens.stagger.dramatic)}
            sx={dotSx}
          />
        )
      )}
    </Box>
  );
}
