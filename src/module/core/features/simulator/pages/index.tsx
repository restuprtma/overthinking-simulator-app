import type { Reflection } from '../types';

import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { CONFIG } from 'src/shared/config';
import { Iconify } from 'src/shared/ui/iconify';
import { DashboardContent } from 'src/layouts/dashboard';

import { SimulatorForm } from '../views/simulator-form';
import { ReflectionResult } from '../views/reflection-result';

// ----------------------------------------------------------------------

export default function SimulatorPage() {
  const { t } = useTranslate('simulator');

  const [reflection, setReflection] = useState<Reflection | null>(null);

  const handleCreated = useCallback((created: Reflection) => {
    setReflection(created);
  }, []);

  const handleReset = useCallback(() => {
    setReflection(null);
  }, []);

  return (
    <>
      <title>{`${t('title')} - ${CONFIG.appName}`}</title>

      <DashboardContent maxWidth="md">
        <Stack spacing={3}>
          <Stack spacing={0.5}>
            <Typography variant="h4">{t('title')}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('subtitle')}
            </Typography>
          </Stack>

          {reflection ? (
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

              <ReflectionResult reflection={reflection} />
            </Stack>
          ) : (
            <SimulatorForm onCreated={handleCreated} />
          )}
        </Stack>
      </DashboardContent>
    </>
  );
}
