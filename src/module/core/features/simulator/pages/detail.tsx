import type { Reflection, DialogTurn } from '../types';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter, useParams } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { CONFIG } from 'src/shared/config';
import { fDateTime } from 'src/shared/utils';
import { Iconify } from 'src/shared/ui/iconify';
import { DashboardContent } from 'src/layouts/dashboard';

import { stampTurns } from '../utils/stamp-turns';
import { getReflection, continueReflection } from '../api';
import { InteractiveChat } from '../views/interactive-chat';

// ----------------------------------------------------------------------

export default function DetailPage() {
  const { t } = useTranslate('simulator');
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [conversationHistory, setConversationHistory] = useState<DialogTurn[]>([]);
  const [loading, setLoading] = useState(true);
  const [isContinuing, setIsContinuing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    getReflection(id)
      .then((data) => {
        if (active) {
          setReflection(data);
          setConversationHistory(stampTurns(data.dialog));
        }
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleContinue = useCallback(
    async (newMessage: string) => {
      if (!reflection || isContinuing) return;

      const userTurn: DialogTurn = {
        speaker: 'cemas',
        text: newMessage,
        timestamp: new Date().toISOString(),
      };

      const optimisticHistory = [...conversationHistory, userTurn];
      setIsContinuing(true);
      setError(null);
      setConversationHistory(optimisticHistory);

      try {
        const response = await continueReflection(reflection.id, { user_message: newMessage });

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
        setConversationHistory(conversationHistory);
        setError(err instanceof Error ? err.message : t('errorGeneric'));
      } finally {
        setIsContinuing(false);
      }
    },
    [conversationHistory, isContinuing, reflection, t]
  );

  const isCompleted =
    reflection?.conversation_state === 'final' ||
    (reflection?.total_turns ? reflection.total_turns >= 10 : false);

  const canContinue =
    conversationHistory.length > 0 &&
    !isCompleted &&
    !reflection?.safety_triggered &&
    !isContinuing;

  return (
    <>
      <title>{`${reflection ? reflection.thought.slice(0, 30) + '...' : t('title')} - ${CONFIG.appName}`}</title>

      <DashboardContent maxWidth="md">
        <Stack spacing={3}>
          {/* Header navigation bar */}
          <Stack
            direction="row"
            sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}
          >
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Iconify icon="solar:arrow-left-bold" />}
              onClick={() => router.push(paths.dashboard.simulator.history)}
              sx={{ minHeight: 44 }}
            >
              {t('backToHistory')}
            </Button>

            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="solar:pen-new-square-bold" />}
              onClick={() => router.push(paths.dashboard.simulator.root)}
              sx={{ minHeight: 44 }}
            >
              {t('newReflection')}
            </Button>
          </Stack>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : notFound || !reflection ? (
            <Card sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
              <Stack spacing={2} sx={{ alignItems: 'center' }}>
                <Iconify icon="solar:question-circle-bold" width={48} sx={{ color: 'text.disabled' }} />
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                  {t('notFound')}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => router.push(paths.dashboard.simulator.history)}
                  sx={{ minHeight: 44 }}
                >
                  {t('backToHistory')}
                </Button>
              </Stack>
            </Card>
          ) : (
            <Stack spacing={3}>
              {/* Session Meta Card */}
              <Card sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 2, bgcolor: 'background.paper' }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                      {t('yourThought')}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      {reflection.safety_triggered ? (
                        <Chip
                          size="small"
                          label={t('safetyTitle')}
                          color="warning"
                          variant="soft"
                          icon={<Iconify icon="solar:shield-warning-bold" />}
                        />
                      ) : isCompleted ? (
                        <Chip
                          size="small"
                          label={t('stateFinal')}
                          color="default"
                          variant="soft"
                          icon={<Iconify icon="solar:check-circle-bold" />}
                        />
                      ) : (
                        <Chip
                          size="small"
                          label={t('stateContinued')}
                          color="success"
                          variant="soft"
                          icon={<Iconify icon="solar:chat-line-bold" />}
                        />
                      )}
                    </Stack>
                  </Stack>

                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    &ldquo;{reflection.thought}&rdquo;
                  </Typography>

                  <Stack direction="row" spacing={2} sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
                    <span>{fDateTime(reflection.created_at)}</span>
                    <span>•</span>
                    <span>{t('turnCount', { count: reflection.total_turns || conversationHistory.length })}</span>
                  </Stack>
                </Stack>
              </Card>

              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              {/* Interactive Chat Session */}
              <InteractiveChat
                reflection={reflection}
                history={conversationHistory}
                isLoading={isContinuing}
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
