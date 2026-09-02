import type { DialogTurn } from '../types';

/**
 * The backend's DialogTurn carries no timestamp, so timestamps live on the client.
 * The dialog is append-only, which makes the index a stable identity: reuse the
 * timestamp already known for that position and only stamp genuinely new turns.
 */
export function stampTurns(turns: DialogTurn[], previous: DialogTurn[] = []): DialogTurn[] {
  const now = new Date().toISOString();
  return turns.map((turn, index) => ({
    ...turn,
    timestamp: turn.timestamp || previous[index]?.timestamp || now,
  }));
}
