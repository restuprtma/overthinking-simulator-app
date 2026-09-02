import type { GroqCredential } from '../types';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';

import { getGroqCredentials, updateGroqCredentials } from '../api';

// ----------------------------------------------------------------------

const emptyRow = (): GroqCredential => ({ key: '', model: '' });

export function CredentialsSettings() {
  const { t } = useTranslate('settings');

  const [rows, setRows] = useState<GroqCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const creds = await getGroqCredentials();
      setRows(creds.length > 0 ? creds : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorGeneric'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const handleChangeRow = useCallback(
    (index: number, field: keyof GroqCredential, value: string) => {
      setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
    },
    []
  );

  const handleAddRow = useCallback(() => {
    setRows((prev) => [...prev, emptyRow()]);
  }, []);

  const handleRemoveRow = useCallback((index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      await updateGroqCredentials(rows);
      setSuccessOpen(true);
      await fetchRows();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorGeneric'));
    } finally {
      setSaving(false);
    }
  }, [rows, fetchRows, t]);

  const handleCloseSuccess = useCallback(() => {
    setSuccessOpen(false);
  }, []);

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4">{t('credentialsTitle')}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('credentialsDescription')}
        </Typography>
      </Stack>

      <Card
        sx={{
          p: { xs: 2, md: 3 },
          display: 'flex',
          gap: 1.5,
          alignItems: 'flex-start',
          bgcolor: 'info.lighter',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            display: 'flex',
            borderRadius: 1.5,
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'info.main',
            color: 'info.contrastText',
          }}
        >
          <Iconify icon="solar:shield-check-bold" width={22} />
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
          {t('maskedHint')}
        </Typography>
      </Card>

      <Card sx={{ p: { xs: 2, md: 3 } }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : rows.length === 0 ? (
          <Typography variant="body1" sx={{ color: 'text.secondary', py: 3, textAlign: 'center' }}>
            {t('notSet')}
          </Typography>
        ) : (
          <Stack spacing={2}>
            {rows.map((row, index) => (
              <Stack key={index} spacing={1.5}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    #{index + 1}
                  </Typography>
                  <IconButton
                    onClick={() => handleRemoveRow(index)}
                    aria-label={t('remove')}
                    color="error"
                    sx={{ width: 44, height: 44 }}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    type="password"
                    label={t('keyLabel')}
                    placeholder={t('keyPlaceholder')}
                    value={row.key}
                    onChange={(event) => handleChangeRow(index, 'key', event.target.value)}
                    autoComplete="off"
                  />
                  <TextField
                    fullWidth
                    label={t('modelLabel')}
                    placeholder={t('modelPlaceholder')}
                    value={row.model}
                    onChange={(event) => handleChangeRow(index, 'model', event.target.value)}
                    autoComplete="off"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Iconify icon="solar:lock-password-outline" width={20} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </Stack>
            ))}
          </Stack>
        )}

        {!loading && (
          <Stack spacing={2} sx={{ mt: rows.length > 0 ? 3 : 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Iconify icon="solar:add-circle-bold" />}
              onClick={handleAddRow}
              sx={{ minHeight: 44, alignSelf: 'flex-start' }}
            >
              {t('addRow')}
            </Button>

            {error && (
              <Alert severity="error" sx={{ alignItems: 'center' }}>
                {error}
              </Alert>
            )}

            <Button
              variant="contained"
              color="primary"
              disabled={saving}
              onClick={handleSave}
              startIcon={<Iconify icon="solar:settings-bold" />}
              sx={{
                minHeight: 48,
                width: { xs: '100%', md: 'auto' },
                alignSelf: { md: 'flex-end' },
              }}
            >
              {saving ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  {t('save')}
                </>
              ) : (
                t('save')
              )}
            </Button>
          </Stack>
        )}
      </Card>

      <Snackbar
        open={successOpen}
        autoHideDuration={4000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
          onClose={handleCloseSuccess}
        >
          {t('saved')}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
