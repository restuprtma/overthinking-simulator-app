// ----------------------------------------------------------------------

/**
 * Key prefix an earlier build used to mirror the full conversation transcript
 * into `localStorage` (`overthinking_session_<reflectionId>`). Nothing ever read
 * it back, nothing removed it, and it survived sign-out — so unencrypted
 * mental-health text accumulated indefinitely, one key per reflection. The
 * dialog is already persisted server-side (`core.reflections.dialog`), so the
 * client-side copy had no purpose and the write is gone.
 */
const LEGACY_SESSION_KEY_PREFIX = 'overthinking_session_';

/**
 * Removes every leftover `overthinking_session_*` entry from `localStorage`.
 *
 * Safe to call on every mount: a no-op once the keys are gone, and it swallows
 * access errors because reading `localStorage` throws outright in Safari private
 * mode and when storage is disabled by policy.
 */
export function purgeLegacySessionSnapshots(): void {
  try {
    const staleKeys: string[] = [];

    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);

      if (key?.startsWith(LEGACY_SESSION_KEY_PREFIX)) {
        staleKeys.push(key);
      }
    }

    // Collect first, then delete — removing mid-iteration shifts the indexes.
    staleKeys.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Storage unavailable (Safari private mode, disabled by policy) — nothing to purge.
  }
}
