import { useEffect } from 'react';

import { usePlaybackEngine } from 'src/module/analysis/features/orderbook-playback/hooks/use-playback-engine';

// ----------------------------------------------------------------------

const REALTIME_DATE = '2026-05-20';
const START_PROGRESS = 0.6;
const REALTIME_SPEED = 25;

export type OrderbookEngine = ReturnType<typeof useOrderbookEngine>;

export function useOrderbookEngine(initialCode: string) {
  const engine = usePlaybackEngine(initialCode, REALTIME_DATE);
  const { code, session, seek, setSpeed, play } = engine;

  useEffect(() => {
    const start =
      session.sessionStart + (session.sessionEnd - session.sessionStart) * START_PROGRESS;
    seek(start);
    setSpeed(REALTIME_SPEED);
    play();
  }, [code, session, seek, setSpeed, play]);

  return engine;
}
