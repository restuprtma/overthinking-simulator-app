import type { SessionSnapshot } from '../data/mock';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import { computeSummary, generateSession, buildOrderbookAt, upperBoundByTime } from '../data/mock';

// ----------------------------------------------------------------------

export type PlaybackSpeed = 1 | 10 | 25 | 50 | 100 | 150 | 200;

export const PLAYBACK_SPEEDS: PlaybackSpeed[] = [1, 10, 25, 50, 100, 150, 200];

const TICK_INTERVAL_MS = 120;
const TRADE_WINDOW_SEC = 1800;
const TRADE_VISIBLE = 200;
const ALERT_VISIBLE = 250;

// ----------------------------------------------------------------------

export type PlaybackEngine = ReturnType<typeof usePlaybackEngine>;

export function usePlaybackEngine(initialCode: string, initialDate: string) {
  const [code, setCode] = useState(initialCode);
  const [date, setDate] = useState(initialDate);
  const session = useMemo<SessionSnapshot>(() => generateSession(code, date), [code, date]);

  const [currentTime, setCurrentTime] = useState(session.sessionStart);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(50);

  const lastFrameRef = useRef<number>(0);

  // Reset playback when session changes
  useEffect(() => {
    setCurrentTime(session.sessionStart);
    setIsPlaying(false);
  }, [session]);

  // Time loop
  useEffect(() => {
    if (!isPlaying) return undefined;
    lastFrameRef.current = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      const dt = (now - lastFrameRef.current) / 1000;
      lastFrameRef.current = now;
      setCurrentTime((prev) => {
        let next = prev + dt * speed;
        // Skip lunch break
        if (prev < session.breakStart && next >= session.breakStart && next < session.breakEnd) {
          next = session.breakEnd + (next - session.breakStart);
        }
        if (next >= session.sessionEnd) {
          setIsPlaying(false);
          return session.sessionEnd;
        }
        return next;
      });
    }, TICK_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [isPlaying, speed, session.breakStart, session.breakEnd, session.sessionEnd]);

  // Derived snapshot
  const visibleCandles = useMemo(
    () => session.candles.filter((c) => c.time <= currentTime),
    [session, currentTime]
  );

  const summary = useMemo(() => computeSummary(session, currentTime), [session, currentTime]);

  const orderbook = useMemo(
    () => buildOrderbookAt(session, currentTime, summary.last),
    [session, currentTime, summary.last]
  );

  const runningTrades = useMemo(() => {
    const upper = upperBoundByTime(session.trades, currentTime);
    const from = Math.max(0, upper - TRADE_VISIBLE);
    const cutoff = currentTime - TRADE_WINDOW_SEC;
    const slice = [];
    for (let i = upper - 1; i >= from; i--) {
      const tr = session.trades[i];
      if (tr.time < cutoff) break;
      slice.push(tr);
    }
    return slice;
  }, [session, currentTime]);

  const visibleAlerts = useMemo(() => {
    const upper = upperBoundByTime(session.alerts, currentTime);
    const from = Math.max(0, upper - ALERT_VISIBLE);
    const out = [];
    for (let i = upper - 1; i >= from; i--) {
      out.push(session.alerts[i]);
    }
    return out;
  }, [session, currentTime]);

  // Controls
  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const toggle = useCallback(() => setIsPlaying((p) => !p), []);
  const seek = useCallback(
    (t: number) => {
      const clamped = Math.max(session.sessionStart, Math.min(session.sessionEnd, t));
      setCurrentTime(clamped);
    },
    [session.sessionStart, session.sessionEnd]
  );
  const stepSeconds = useCallback(
    (sec: number) => {
      setCurrentTime((prev) =>
        Math.max(session.sessionStart, Math.min(session.sessionEnd, prev + sec))
      );
    },
    [session.sessionStart, session.sessionEnd]
  );
  const restart = useCallback(() => {
    setCurrentTime(session.sessionStart);
    setIsPlaying(false);
  }, [session.sessionStart]);

  return {
    code,
    date,
    session,
    currentTime,
    isPlaying,
    speed,
    summary,
    visibleCandles,
    orderbook,
    runningTrades,
    visibleAlerts,
    setCode,
    setDate,
    setSpeed,
    play,
    pause,
    toggle,
    seek,
    stepSeconds,
    restart,
  };
}
