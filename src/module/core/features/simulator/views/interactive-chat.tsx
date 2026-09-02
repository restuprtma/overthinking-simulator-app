import type { DialogTurn, Reflection } from '../types';

import { useRef, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';

import { ChatInput } from './chat-input';
import { MessageBubble } from './message-bubble';
import { purgeLegacySessionSnapshots } from '../utils/session-cleanup';

// ----------------------------------------------------------------------

type Props = {
  reflection: Reflection;
  history: DialogTurn[];
  isLoading: boolean;
  onContinue: (message: string) => void;
  canContinue: boolean;
};

export function InteractiveChat({
  reflection,
  history,
  isLoading,
  onContinue,
  canContinue,
}: Props) {
  const { t } = useTranslate('simulator');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [history, isLoading]);

  useEffect(() => {
    purgeLegacySessionSnapshots();
  }, []);

  const handleSendMessage = useCallback(
    (message: string) => {
      onContinue(message);
    },
    [onContinue]
  );

  const handleAutoContinue = useCallback(() => {
    onContinue(t('autoContinuePrompt'));
  }, [onContinue, t]);

  // Safety crisis mode handling
  if (reflection.safety_triggered) {
    return (
      <Stack spacing={3}>
        <Card
          sx={{
            p: { xs: 3, md: 4 },
            bgcolor: 'warning.lighter',
            border: (theme) => `1px solid ${theme.vars?.palette.warning.light || '#FEF08A'}`,
            borderRadius: 2,
          }}
        >
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'warning.main',
                  color: 'warning.contrastText',
                }}
              >
                <Iconify icon="solar:shield-warning-bold" width={24} />
              </Box>
              <Typography variant="h6" fontWeight={700} sx={{ color: 'warning.darker' }}>
                {t('safetyTitle')}
              </Typography>
            </Box>
            {reflection.safety_response && (
              <Typography variant="body1" sx={{ color: 'warning.darker', lineHeight: 1.7 }}>
                {reflection.safety_response}
              </Typography>
            )}
          </Stack>
        </Card>

        {reflection.actionable_suggestion && (
          <Card sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                {t('suggestion')}
              </Typography>
              <Typography variant="body1">{reflection.actionable_suggestion}</Typography>
            </Stack>
          </Card>
        )}
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      {/* Dialogue Stream */}
      <Box sx={{ pt: 1 }}>
        {history.map((turn, index) => (
          <MessageBubble key={`turn-${index}-${turn.speaker}`} turn={turn} />
        ))}
      </Box>

      {/* Loading state indicator */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
          <Card
            sx={{
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              boxShadow: (theme) => theme.customShadows?.card || 1,
            }}
          >
            <CircularProgress size={18} color="primary" />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('loading')}
            </Typography>
          </Card>
        </Box>
      )}

      {/* Actionable Suggestion from Initial Debate */}
      {reflection.actionable_suggestion && (
        <Card
          sx={{
            p: { xs: 2.5, md: 3 },
            bgcolor: 'background.neutral',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            my: 1,
          }}
        >
          <Stack spacing={0.75}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Iconify icon="solar:lightbulb-bolt-bold" width={18} sx={{ color: 'warning.main' }} />
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                {t('suggestion')}
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6 }}>
              {reflection.actionable_suggestion}
            </Typography>
          </Stack>
        </Card>
      )}

      {/* Auto-Continue Suggestion Button */}
      {!isLoading && canContinue && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', py: 0.5 }}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<Iconify icon="solar:magic-stick-2-bold" />}
            onClick={handleAutoContinue}
            sx={{ minHeight: 36, borderRadius: 1.5 }}
          >
            {t('autoContinueBtn')}
          </Button>
        </Box>
      )}

      {/* Completion status notice */}
      {!canContinue && !isLoading && (
        <Card sx={{ p: 2.5, textAlign: 'center', bgcolor: 'background.neutral', borderRadius: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('conversationEnded')}
          </Typography>
        </Card>
      )}

      {/* Input container */}
      <ChatInput
        disabled={isLoading || !canContinue}
        placeholder={canContinue ? t('chatPlaceholder') : t('chatDisabled')}
        onSubmit={handleSendMessage}
      />

      <div ref={scrollRef} />
    </Stack>
  );
}
