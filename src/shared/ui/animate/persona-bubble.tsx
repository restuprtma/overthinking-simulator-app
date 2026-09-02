import type { Variants } from 'framer-motion';
import type { BoxProps } from '@mui/material/Box';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';

import { toSeconds, motionTokens } from 'src/theme/core/motion';

import { reducedVariants, useReducedMotionSafe } from './use-reduced-motion-safe';

// ----------------------------------------------------------------------
// Entrance for a single line of the persona debate. `cemas` (the user's own
// anxious thought) sits on the right, `realistis` (the balanced counter-voice)
// on the left, and each enters from its own side.
//
// DELIBERATE RULE DEVIATION — a reviewer will flag this, so: motion-design's
// "Spatial Origin Consistency" says every element in a scene should enter from
// the same direction. We break it on purpose. Here direction carries semantic
// meaning — it tells you which voice is speaking before you read a word — the
// same affordance every chat UI relies on. Consistency is preserved
// per-channel: a given persona ALWAYS enters from its own side, so the mapping
// stays learnable instead of arbitrary.
//
// Colors are NOT set here. They live in the theme as
// `theme.palette.persona.cemas` / `.realistis` (`surface` / `ink` / `edge` /
// `accent`) and are the consuming component's decision. This primitive only
// positions and animates.

/**
 * Hard ceiling on the accumulated stagger delay, in ms.
 *
 * Not a motion token: this is the choreography *budget* from motion-design
 * ("total stagger must stay under 500ms"), not a duration to animate with. A
 * long transcript would otherwise leave the last bubble waiting several
 * seconds — at 140ms per index, bubble #10 would start at 1.4s.
 */
const STAGGER_BUDGET = 500;

// ----------------------------------------------------------------------

export type PersonaSpeaker = 'cemas' | 'realistis';

/** Which side each voice travels in from. Sign only — magnitude is a token. */
const ENTER_SIGN: Record<PersonaSpeaker, number> = {
  cemas: 1,
  realistis: -1,
};

const ALIGNMENT: Record<PersonaSpeaker, 'flex-end' | 'flex-start'> = {
  cemas: 'flex-end',
  realistis: 'flex-start',
};

function personaVariants(speaker: PersonaSpeaker, delay: number): Variants {
  const offset = motionTokens.distance.enter * ENTER_SIGN[speaker];

  return {
    initial: { x: offset, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: toSeconds(motionTokens.duration.slow),
        ease: motionTokens.easing.signature,
        delay: toSeconds(delay),
      },
    },
  };
}

// ----------------------------------------------------------------------

export type PersonaBubbleProps = BoxProps & {
  speaker: PersonaSpeaker;
  /** Position in the transcript. Drives the stagger delay. */
  index?: number;
  children: React.ReactNode;
};

export function PersonaBubble({ speaker, index = 0, children, sx, ...other }: PersonaBubbleProps) {
  const reduceMotion = useReducedMotionSafe();

  const delay = Math.min(index * motionTokens.stagger.dramatic, STAGGER_BUDGET);

  const variants = personaVariants(speaker, delay);

  return (
    <Box
      component={m.div}
      variants={reduceMotion ? reducedVariants(variants) : variants}
      initial="initial"
      animate="animate"
      sx={[
        { display: 'flex', justifyContent: ALIGNMENT[speaker] },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {children}
    </Box>
  );
}
