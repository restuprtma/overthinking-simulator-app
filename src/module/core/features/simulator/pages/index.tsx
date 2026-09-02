import type { Reflection, DialogTurn } from '../types';

import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { CONFIG } from 'src/shared/config';
import { Iconify } from 'src/shared/ui/iconify';
import { DashboardContent } from 'src/layouts/dashboard';

import { continueReflection } from '../api';
import { stampTurns } from '../utils/stamp-turns';
import { SimulatorForm } from '../views/simulator-form';
import { InteractiveChat } from '../views/interactive-chat';

// ----------------------------------------------------------------------

export default function SimulatorPage() {
  const { t } = useTranslate('simulator');
  const router = useRouter();

  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [conversationHistory, setConversationHistory] = useState<DialogTurn[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreated = useCallback((created: Reflection) => {
    setConversationHistory(stampTurns(created.dialog));
    setReflection(created);
    setError(null);
  }, []);

  const handleContinue = useCallback(
    async (newMessage: string) => {
      if (!reflection || isLoading) return;

      const userTurn: DialogTurn = {
        speaker: 'cemas',
        text: newMessage,
        timestamp: new Date().toISOString(),
      };

      // Optimistic echo so the user sees their message immediately.
      const optimisticHistory = [...conversationHistory, userTurn];

      setIsLoading(true);
      setError(null);
      setConversationHistory(optimisticHistory);
      try {
        const response = await continueReflection(reflection.id, { user_message: newMessage });

        // The server persists both turns and returns the authoritative dialog,
        // so replace local state instead of splicing it.
        setConversationHistory(stampTurns(response.dialog_updated, optimisticHistory));
        setReflection((prev) =>
          prev
            ? {
                ...prev,
                dialog: response.dialog_updated,
                conversation_state: response.conversation_state,
                total_turns: response.total_turns,
              }
            : prev
        );
      } catch (err) {
        // Roll the optimistic turn back so a retry does not duplicate it.
        setConversationHistory(conversationHistory);
        setError(err instanceof Error ? err.message : t('errorGeneric'));
      } finally {
        setIsLoading(false);
      }
    },
    [conversationHistory, isLoading, reflection, t]
  );

  const handleReset = useCallback(() => {
    setReflection(null);
    setConversationHistory([]);
    setError(null);
  }, []);

  // The server owns the turn cap and reports it back as `conversation_state`.
  const canContinue =
    conversationHistory.length > 0 && reflection?.conversation_state !== 'final' && !isLoading;
  return (
    <>
      <title>{`${t('title')} - ${CONFIG.appName}`}</title>

      <DashboardContent maxWidth="md">
        <Stack spacing={3}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack spacing={0.5}>
              <Typography variant="h4">{t('title')}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t('subtitle')}
              </Typography>
            </Stack>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Iconify icon="solar:history-bold-duotone" />}
              onClick={() => router.push(paths.dashboard.simulator.history)}
              sx={{ minHeight: 44 }}
            >
              {t('viewHistory')}
            </Button>
          </Stack>

          {!reflection ? (
            <SimulatorForm onCreated={handleCreated} />
          ) : (
            <Stack spacing={3}>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<Iconify icon="solar:restart-bold" />}
                onClick={handleReset}
                sx={{ alignSelf: 'flex-start', minHeight: 44 }}
              >
                {t('newReflection')}
              </Button>

              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              <InteractiveChat
                reflection={reflection}
                history={conversationHistory}
                isLoading={isLoading}
                onContinue={handleContinue}
                canContinue={canContinue}
              />
            </Stack>
          )}
        </Stack>
      </DashboardContent>
    </>
  );
}
