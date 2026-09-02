import type { Reflection } from '../types';

import { useRef, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { useTranslate } from 'src/locales';

import { MessageBubble } from './message-bubble';

type Props = {
  reflection: Reflection;
};

export function ReflectionResult({ reflection }: Props) {
  const { t } = useTranslate('simulator');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [reflection.dialog]);

  if (reflection.safety_triggered) {
    return (
      <Stack spacing={3}>
        <Stack spacing={2}>
          <Stack
            sx={{
              p: { xs: 2.5, md: 4 },
              border: (theme) => `1px solid ${theme.vars.palette.warning.main}`,
              bgcolor: 'warning.lighter',
              borderRadius: 2,
            }}
          >
            <Stack spacing={2}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  display: 'flex',
                  borderRadius: '50%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'warning.main',
                  color: 'warning.contrastText',
                }}
              >
                <span style={{ fontSize: 24, fontWeight: 700 }}>!</span>
              </Box>
              <span style={{ fontSize: 20, fontWeight: 600 }}>{t('safetyTitle')}</span>
              {reflection.safety_response && (
                <span>{reflection.safety_response}</span>
              )}
            </Stack>
          </Stack>

          {reflection.actionable_suggestion && (
            <Stack
              sx={{
                p: { xs: 2.5, md: 4 },
                bgcolor: 'background.default',
                borderRadius: 2,
              }}
            >
              <span style={{ color: 'text.secondary', fontSize: 14, marginBottom: 8 }}>{t('suggestion')}</span>
              <span>{reflection.actionable_suggestion}</span>
            </Stack>
          )}
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack spacing={3} ref={scrollRef}>
      <Stack spacing={2}>
        {reflection.dialog.map((turn, index) => (
          <MessageBubble key={`${turn.speaker}-${index}`} turn={turn} />
        ))}
      </Stack>

      <Stack
        sx={{
          p: { xs: 2.5, md: 4 },
          bgcolor: 'background.default',
          borderRadius: 2,
        }}
      >
        <span style={{ color: 'text.secondary', fontSize: 14, marginBottom: 8 }}>{t('suggestion')}</span>
        <span>{reflection.actionable_suggestion}</span>
      </Stack>
    </Stack>
  );
}
