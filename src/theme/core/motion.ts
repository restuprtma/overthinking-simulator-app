/**
 * Motion design tokens.
 *
 * Motion personality: **Premium** archetype — 350-600ms band for the expressive
 * durations, zero overshoot, one signature curve carrying ~80% of all animation.
 *
 * Content type is Healthcare (mental-health reflection), therefore
 * **motion density: Very low**. Motion exists to orient the user, never to
 * entertain. Prefer opacity + small distance over travel and scale.
 *
 * `easing.playful` is the single sanctioned exception to the zero-overshoot
 * rule — it is reserved for the one success beat and must not be used anywhere
 * else.
 *
 * No component should hardcode a duration or a curve: read them from
 * `theme.motion` (registered in `create-theme.ts`) or import `motionTokens`.
 *
 * TypeScript extension for MUI theme augmentation.
 * @to {@link file://./../extend-theme-types.d.ts}
 */

// ----------------------------------------------------------------------

export type MotionEase = readonly [number, number, number, number];

export type MotionTokens = {
  duration: { instant: number; quick: number; standard: number; slow: number; reveal: number };
  easing: {
    signature: MotionEase;
    entrance: MotionEase;
    exit: MotionEase;
    ambient: MotionEase;
    playful: MotionEase;
  };
  stagger: { micro: number; standard: number; dramatic: number };
  distance: { nudge: number; enter: number };
};

/* **********************************************************************
 * 📦 Final
 * **********************************************************************/
/** All durations and stagger delays are in MILLISECONDS. Distances are in px. */
export const motion: MotionTokens = {
  duration: {
    instant: 120,
    quick: 200,
    standard: 320,
    slow: 460,
    reveal: 1200,
  },
  easing: {
    /** Premium signature curve — target ~80% of all animation. */
    signature: [0.4, 0, 0.2, 1],
    /** MD3 Emphasized — hero entrances only. */
    entrance: [0.05, 0.7, 0.1, 1],
    /** MD3 Accelerate — exits and dismissals. */
    exit: [0.3, 0, 1, 1],
    /** Sine-like, for seamless ambient loops. */
    ambient: [0.4, 0, 0.6, 1],
    /** Overshoot — reserved for the one success beat. */
    playful: [0.175, 0.885, 0.32, 1.275],
  },
  stagger: {
    micro: 40,
    standard: 80,
    dramatic: 140,
  },
  distance: {
    nudge: 8,
    enter: 16,
  },
};

/**
 * Alias export. Framer Motion also exports a `motion` binding, so prefer
 * importing `motionTokens` at call sites to avoid a naming collision.
 */
export const motionTokens = motion;

// ----------------------------------------------------------------------

/** Formats a motion ease tuple as a CSS `cubic-bezier(...)` value. */
export function cssEase(ease: MotionEase): string {
  return `cubic-bezier(${ease.join(', ')})`;
}

/** Converts a millisecond token to seconds, the unit framer-motion expects. */
export function toSeconds(ms: number): number {
  return ms / 1000;
}
