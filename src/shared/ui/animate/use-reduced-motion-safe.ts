import type { Variant, Variants, Transition, TargetAndTransition } from 'framer-motion';

import { useReducedMotion } from 'framer-motion';

// ----------------------------------------------------------------------
// `src/global.css` already clamps CSS `animation-duration` / `transition-duration`
// under `prefers-reduced-motion: reduce`, but that block has no effect on
// JS-driven framer-motion animation (framer writes inline transforms frame by
// frame, it does not rely on CSS transitions). Everything in this kit that
// animates through framer MUST therefore consult `useReducedMotionSafe()`
// explicitly — that is the gap this module closes.

/**
 * Properties dropped under reduced motion: they are the spatial / expressive
 * channels. `opacity` is deliberately NOT in this list.
 */
const SPATIAL_KEYS = ['x', 'y', 'scale', 'rotate', 'filter'] as const;

/** Reduced motion shortens what is left of the animation by 50%. */
const REDUCED_DURATION_SCALE = 0.5;

// ----------------------------------------------------------------------

/**
 * `useReducedMotion()` resolves to `null` until the media query has been read
 * (and on non-browser renders), which makes `boolean | null` awkward at call
 * sites — `if (reduced)` and `if (reduced === true)` behave the same but read
 * differently, and `reduced ? a : b` silently takes the "no preference" branch.
 *
 * This wrapper normalises the tri-state to a plain `boolean`, treating `null`
 * as "no preference expressed" (`false`), i.e. animate normally.
 */
export function useReducedMotionSafe(): boolean {
  return useReducedMotion() ?? false;
}

// ----------------------------------------------------------------------

/**
 * Rewrites a variants object into its reduced-motion counterpart.
 *
 * The motion-design accessibility rule is **"Complex choreography -> Single
 * fade"**. Concretely, reduced motion means:
 *
 * - remove spatial movement (`x`, `y`, `scale`, `rotate`, `filter`)
 * - keep opacity — the state change must still be perceivable
 * - remove spring easing (momentum reads as movement even in place)
 * - reduce duration 50%+
 * - never auto-play loops
 *
 * The last rule cannot be expressed as a variant transform: a looping animation
 * has to be dropped at the component level, not softened here. See
 * `thinking-pulse.tsx`, which renders static dots instead of calling this.
 *
 * Defensive by design: variant states may be objects, numbers, arrays or
 * resolver functions (`TargetResolver`). Only plain-object states are
 * rewritten; anything else is passed through untouched.
 */
export function reducedVariants(variants: Variants): Variants {
  const reduced: Variants = {};

  Object.entries(variants).forEach(([state, definition]) => {
    reduced[state] = isTargetState(definition) ? stripSpatialKeys(definition) : definition;
  });

  return reduced;
}

// ----------------------------------------------------------------------

/** A variant state is rewritable only when it is a plain object target. */
function isTargetState(definition: Variant): definition is TargetAndTransition {
  return typeof definition === 'object' && definition !== null && !Array.isArray(definition);
}

/** Opacity-only projection of a single variant state. */
function stripSpatialKeys(definition: TargetAndTransition): TargetAndTransition {
  const target: TargetAndTransition = { ...definition };

  SPATIAL_KEYS.forEach((key) => {
    delete target[key];
  });

  if (target.transition) {
    target.transition = softenTransition(target.transition);
  }

  return target;
}

/** Halves the duration and strips spring momentum from a transition. */
function softenTransition(transition: Transition): Transition {
  const softened: Transition = { ...transition };

  if (typeof softened.duration === 'number') {
    softened.duration *= REDUCED_DURATION_SCALE;
  }

  // A spring keeps overshooting/settling, which is movement — fall back to the
  // default tween so the value simply interpolates.
  if (softened.type === 'spring') {
    delete softened.type;
  }

  return softened;
}
