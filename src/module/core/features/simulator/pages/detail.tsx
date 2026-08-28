import type { Reflection } from '../types';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter , useParams } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { CONFIG } from 'src/shared/config';
import { Iconify } from 'src/shared/ui/iconify';
import { DashboardContent } from 'src/layouts/dashboard';

import { getReflection } from '../api';
import { ReflectionResult } from '../views/reflection-result';

// ----------------------------------------------------------------------

export default function DetailPage() {
  const { t } = useTranslate('simulator');
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    getReflection(id)
      .then((data) => {
        if (active) setReflection(data);
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

  return (
    <>
      <title>{`${t('title')} - ${CONFIG.appName}`}</title>

      <DashboardContent maxWidth="md">
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
              onClick={() => router.push(paths.dashboard.simulator.history)}
              sx={{ minHeight: 44 }}
            >
              {t('backToHistory')}
            </Button>
          </Stack>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : notFound || !reflection ? (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                {t('notFound')}
              </Typography>
            </Card>
          ) : (
            <ReflectionResult reflection={reflection} />
          )}
        </Stack>
      </DashboardContent>
    </>
  );
}
