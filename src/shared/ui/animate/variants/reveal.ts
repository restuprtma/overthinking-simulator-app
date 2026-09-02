import type { Variants, Transition } from 'framer-motion';
import type { MotionEase } from 'src/theme/core/motion';

import { toSeconds, motionTokens } from 'src/theme/core/motion';

// ----------------------------------------------------------------------
// The calm counterpart to `varFade`, which travels 120px by default. This
// project's motion density is "very low" (healthcare / mental-health content),
// so entrances move `motionTokens.distance.enter` (16px) and nothing more.
//
// Every number below is read from `motionTokens`. The only bare literals are
// the two ratios, which are relationships between tokens rather than values:
//
//   EXIT_DURATION_RATIO — motion-design rule "exits = 65-75% of entrance
//     duration"; users care about what appears, not what leaves.
//   EXIT_STAGGER_RATIO  — exits unwind roughly twice as fast as they build.
//
// framer-motion expresses time in SECONDS, motion tokens in MILLISECONDS —
// hence `toSeconds()` on every duration and delay.

const EXIT_DURATION_RATIO = 0.7;

const EXIT_STAGGER_RATIO = 0.5;

// ----------------------------------------------------------------------

export type RevealDirection = 'up' | 'left' | 'right' | 'none';

export type RevealOptions = {
  /** Travel distance in px. Defaults to `motionTokens.distance.enter`. */
  distance?: number;
  /** Delay before the entrance starts, in ms. */
  delay?: number;
  /** Entrance duration in ms. Defaults to `motionTokens.duration.standard`. */
  duration?: number;
  /** Entrance easing. Defaults to `motionTokens.easing.signature`. */
  ease?: MotionEase;
};

/**
 * Token-driven entrance variants: small travel + fade, decelerating in and
 * accelerating out.
 *
 * `none` is opacity-only and exists so a caller can opt out of movement
 * (nested reveals, dense lists) without switching component.
 */
export const varReveal = (direction: RevealDirection, options?: RevealOptions): Variants => {
  const distance = options?.distance ?? motionTokens.distance.enter;
  const duration = options?.duration ?? motionTokens.duration.standard;
  const ease = options?.ease ?? motionTokens.easing.signature;
  const delay = options?.delay ?? 0;

  const enter: Transition = {
    duration: toSeconds(duration),
    ease,
    delay: toSeconds(delay),
  };

  const exit: Transition = {
    duration: toSeconds(duration * EXIT_DURATION_RATIO),
    ease: motionTokens.easing.exit,
  };

  const variants: Record<RevealDirection, Variants> = {
    up: {
      initial: { y: distance, opacity: 0 },
      animate: { y: 0, opacity: 1, transition: enter },
      exit: { y: distance, opacity: 0, transition: exit },
    },
    left: {
      initial: { x: -distance, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: enter },
      exit: { x: -distance, opacity: 0, transition: exit },
    },
    right: {
      initial: { x: distance, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: enter },
      exit: { x: distance, opacity: 0, transition: exit },
    },
    none: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: enter },
      exit: { opacity: 0, transition: exit },
    },
  };

  return variants[direction];
};

// ----------------------------------------------------------------------

export type RevealContainerOptions = {
  /** Gap between children, in ms. Defaults to `motionTokens.stagger.standard`. */
  stagger?: number;
  /** Delay before the first child starts, in ms. */
  delayChildren?: number;
};

/**
 * Parent orchestrator for `varReveal` children.
 *
 * Exits reverse the order (`staggerDirection: -1`) and run at half the enter
 * interval — the choreography pattern "reverse: bottom-to-top for exits".
 */
export const varRevealContainer = (options?: RevealContainerOptions): Variants => {
  const stagger = options?.stagger ?? motionTokens.stagger.standard;
  const delayChildren = options?.delayChildren ?? 0;

  return {
    animate: {
      transition: {
        staggerChildren: toSeconds(stagger),
        delayChildren: toSeconds(delayChildren),
      },
    },
    exit: {
      transition: {
        staggerChildren: toSeconds(stagger * EXIT_STAGGER_RATIO),
        staggerDirection: -1,
      },
    },
  };
};
