import type { Reflection } from '../types';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useTranslate } from 'src/locales';

import { createReflection } from '../api';

// ----------------------------------------------------------------------

type Props = {
  onCreated: (reflection: Reflection) => void;
};

export function SimulatorForm({ onCreated }: Props) {
  const { t } = useTranslate('simulator');

  const [thought, setThought] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = thought.trim();
  const disabled = trimmed.length === 0 || submitting;

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (disabled) return;

      setSubmitting(true);
      setError(null);

      try {
        const reflection = await createReflection({ thought: trimmed });
        onCreated(reflection);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('errorGeneric'));
      } finally {
        setSubmitting(false);
      }
    },
    [disabled, onCreated, t, trimmed]
  );

  return (
    <Stack spacing={3}>
      <Card sx={{ p: { xs: 2, md: 3 }, display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            display: 'flex',
            borderRadius: 1.5,
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'info.lighter',
            color: 'info.main',
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            i
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
          {t('disclaimer')}
        </Typography>
      </Card>

      <Card sx={{ p: { xs: 2, md: 3 } }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              multiline
              minRows={4}
              maxRows={8}
              label={t('thoughtLabel')}
              placeholder={t('thoughtPlaceholder')}
              value={thought}
              onChange={(event) => setThought(event.target.value)}
            />

            {error && (
              <Alert severity="error" sx={{ alignItems: 'center' }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={disabled}
              sx={{ minHeight: 48, width: { xs: '100%', md: 'auto' }, alignSelf: { md: 'flex-end' } }}
            >
              {submitting ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  {t('submitting')}
                </>
              ) : (
                t('submit')
              )}
            </Button>
          </Stack>
        </form>
      </Card>
    </Stack>
  );
}
