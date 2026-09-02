import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { CONFIG } from 'src/shared/config';
import { Iconify } from 'src/shared/ui/iconify';
import { DashboardContent } from 'src/layouts/dashboard';

import { ReflectionHistory } from '../views/reflection-history';

// ----------------------------------------------------------------------

export default function HistoryPage() {
  const { t } = useTranslate('simulator');
  const router = useRouter();

  const handleSelect = useCallback(
    (id: string) => {
      router.push(paths.dashboard.simulator.detail(id));
    },
    [router]
  );

  return (
    <>
      <title>{`${t('historyTitle')} - ${CONFIG.appName}`}</title>

      <DashboardContent maxWidth="md">
        <Stack spacing={3}>
          <Stack
            direction="row"
            sx={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Stack spacing={0.5}>
              <Typography variant="h4">{t('historyTitle')}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t('historySubtitle')}
              </Typography>
            </Stack>

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

          <ReflectionHistory onSelect={handleSelect} />
        </Stack>
      </DashboardContent>
    </>
  );
}
