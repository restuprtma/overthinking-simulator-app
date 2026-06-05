import type { PlaybackSpeed, PlaybackEngine } from '../hooks/use-playback-engine';

import { useMemo } from 'react';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { Iconify } from 'src/shared/ui/iconify';

import { fmtHms } from '../data/mock';
import { PLAYBACK_SPEEDS } from '../hooks/use-playback-engine';

// ----------------------------------------------------------------------

type Props = {
  engine: PlaybackEngine;
};

export function PlaybackToolbar({ engine }: Props) {
  const {
    session,
    currentTime,
    isPlaying,
    speed,
    setSpeed,
    toggle,
    seek,
    stepSeconds,
    restart,
  } = engine;

  const sessionSpan = session.sessionEnd - session.sessionStart;
  const elapsed = currentTime - session.sessionStart;
  const elapsedPct = (elapsed / sessionSpan) * 100;

  const speedOptions = useMemo(
    () =>
      PLAYBACK_SPEEDS.map((s) => ({
        value: s,
        label: `${s}×`,
      })),
    []
  );

  return (
    <Stack
      direction="column"
      spacing={1}
      sx={{
        p: 1,
        px: 1.5,
        bgcolor: 'background.paper',
        borderRadius: 1,
        border: (t) => `1px solid ${t.palette.divider}`,
        justifyContent: 'center',
        height: '100%',
      }}
    >
      {/* Top row: controls + speed */}
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexShrink: 0 }}>
        <Stack direction="row" spacing={0.25} sx={{ flexShrink: 0 }}>
          <IconButton size="small" onClick={restart} title="Restart">
            <Iconify icon="solar:restart-bold" width={18} />
          </IconButton>
          <IconButton size="small" onClick={() => stepSeconds(-300)} title="-5m">
            <Iconify icon="eva:arrowhead-left-fill" width={18} />
          </IconButton>
          <IconButton size="small" onClick={() => stepSeconds(-60)} title="-1m">
            <Iconify icon="eva:arrow-ios-back-fill" width={18} />
          </IconButton>
          <IconButton
            size="small"
            onClick={toggle}
            sx={{
              bgcolor: isPlaying ? 'warning.main' : 'success.main',
              color: 'common.white',
              '&:hover': { bgcolor: isPlaying ? 'warning.dark' : 'success.dark' },
            }}
          >
            <Iconify icon={isPlaying ? 'carbon:pause' : 'carbon:play'} width={18} />
          </IconButton>
          <IconButton size="small" onClick={() => stepSeconds(60)} title="+1m">
            <Iconify icon="eva:arrow-ios-forward-fill" width={18} />
          </IconButton>
          <IconButton size="small" onClick={() => stepSeconds(300)} title="+5m">
            <Iconify icon="eva:arrowhead-right-fill" width={18} />
          </IconButton>
        </Stack>

        <ToggleButtonGroup
          size="small"
          exclusive
          value={speed}
          onChange={(_, v) => {
            if (v != null) setSpeed(v as PlaybackSpeed);
          }}
          sx={{
            flexShrink: 0,
            '& .MuiToggleButton-root': {
              px: 1,
              py: 0.25,
              fontSize: 12,
              fontWeight: 600,
              lineHeight: 1.4,
            },
          }}
        >
          {speedOptions.map((s) => (
            <ToggleButton key={s.value} value={s.value}>
              {s.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>

      {/* Bottom row: clock + slider + jump chips */}
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'baseline', flexShrink: 0 }}>
          <Typography variant="caption" sx={{ color: 'text.disabled', lineHeight: 1 }}>
            WIB
          </Typography>
          <Typography sx={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, lineHeight: 1 }}>
            {fmtHms(currentTime)}
          </Typography>
        </Stack>

        <Stack sx={{ flex: 1, minWidth: 160, px: 0.5 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}>
            <Typography
              variant="caption"
              sx={{ color: 'text.disabled', fontFamily: 'monospace', lineHeight: 1 }}
            >
              09:00
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', lineHeight: 1 }}>
              {elapsedPct.toFixed(1)}%
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'text.disabled', fontFamily: 'monospace', lineHeight: 1 }}
            >
              15:00
            </Typography>
          </Stack>
          <Slider
            size="small"
            value={currentTime}
            min={session.sessionStart}
            max={session.sessionEnd}
            step={30}
            onChange={(_, v) => seek(v as number)}
            sx={{ py: 0, '& .MuiSlider-thumb': { width: 12, height: 12 } }}
          />
        </Stack>

        <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
          {['10:00', '11:00', '13:30', '14:00', '14:30'].map((label) => {
            const [hh, mm] = label.split(':').map(Number);
            const target = session.sessionStart + (hh - 9) * 3600 + mm * 60;
            return (
              <Chip
                key={label}
                size="small"
                label={label}
                variant="outlined"
                onClick={() => seek(target)}
                sx={{
                  fontFamily: 'monospace',
                  fontSize: 11,
                  height: 22,
                  cursor: 'pointer',
                }}
              />
            );
          })}
        </Stack>
      </Stack>
    </Stack>
  );
}
