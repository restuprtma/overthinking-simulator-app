import type { ReactNode } from 'react';

import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

type Props = {
  top: ReactNode;
  bottom: ReactNode;
  initialRatio?: number;
  minRatio?: number;
  maxRatio?: number;
  gap?: number;
  storageKey?: string;
};

function readStoredRatio(key: string, min: number, max: number): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    const n = parseFloat(raw);
    if (Number.isFinite(n) && n >= min && n <= max) return n;
  } catch {
    /* localStorage unavailable */
  }
  return null;
}

export function VerticalSplit({
  top,
  bottom,
  initialRatio = 0.4,
  minRatio = 0.15,
  maxRatio = 0.85,
  gap = 8,
  storageKey,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [ratio, setRatio] = useState(() => {
    if (storageKey) {
      const stored = readStoredRatio(storageKey, minRatio, maxRatio);
      if (stored !== null) return stored;
    }
    return initialRatio;
  });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(storageKey, ratio.toFixed(4));
    } catch {
      /* localStorage unavailable */
    }
  }, [ratio, storageKey]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setDragging(true);

      const onMove = (ev: PointerEvent) => {
        const wrap = wrapperRef.current;
        if (!wrap) return;
        const rect = wrap.getBoundingClientRect();
        const offset = ev.clientY - rect.top;
        const next = Math.max(minRatio, Math.min(maxRatio, offset / rect.height));
        setRatio(next);
      };
      const onUp = () => {
        setDragging(false);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [minRatio, maxRatio]
  );

  return (
    <Box
      ref={wrapperRef}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        userSelect: dragging ? 'none' : undefined,
      }}
    >
      <Box sx={{ flex: `0 0 calc(${ratio * 100}% - ${gap / 2}px)`, minHeight: 0 }}>{top}</Box>
      <Box
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize panels"
        tabIndex={0}
        onPointerDown={onPointerDown}
        sx={{
          flex: '0 0 auto',
          height: gap,
          cursor: 'row-resize',
          position: 'relative',
          touchAction: 'none',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 40,
            height: 3,
            borderRadius: 2,
            bgcolor: (t) => (dragging ? t.palette.primary.main : t.palette.text.disabled),
            opacity: dragging ? 0.9 : 0.35,
            transition: (t) => t.transitions.create(['opacity', 'background-color']),
          },
          '&:hover::before': {
            opacity: 0.7,
          },
        }}
      />
      <Box sx={{ flex: '1 1 0', minHeight: 0 }}>{bottom}</Box>
    </Box>
  );
}
