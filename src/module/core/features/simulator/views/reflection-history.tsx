import type { ReflectionSummary } from '../types';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import CardActionArea from '@mui/material/CardActionArea';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { fDateTime } from 'src/shared/utils';
import { Iconify } from 'src/shared/ui/iconify';

import { listReflections } from '../api';

// ----------------------------------------------------------------------

const PAGE_LIMIT = 10;

type Props = {
  onSelect: (id: string) => void;
};

export function ReflectionHistory({ onSelect }: Props) {
  const { t } = useTranslate('simulator');
  const router = useRouter();

  const [items, setItems] = useState<ReflectionSummary[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback((pageNum: number) => {
    let active = true;
    setLoading(true);
    setError(null);

    listReflections({ page: pageNum, limit: PAGE_LIMIT })
      .then((res) => {
        if (active) {
          setItems(res.data);
          setTotalPages(res.meta.total_pages || 1);
        }
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : t('errorGeneric'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [t]);

  useEffect(() => {
    const cleanup = fetchItems(page);
    return cleanup;
  }, [fetchItems, page]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSelect = useCallback((id: string) => onSelect(id), [onSelect]);

  if (loading) {
    return (
      <Stack spacing={2}>
        {[0, 1, 2, 3].map((n) => (
          <Card key={n} sx={{ p: 2.5, borderRadius: 2 }}>
            <Skeleton variant="text" width="80%" height={28} />
            <Skeleton variant="text" width="45%" height={20} />
          </Card>
        ))}
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => fetchItems(page)}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  if (items.length === 0) {
    return (
      <Card sx={{ p: { xs: 4, md: 6 }, textAlign: 'center', borderRadius: 2 }}>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'primary.lighter',
              color: 'primary.main',
            }}
          >
            <Iconify icon="solar:chat-round-dots-bold" width={36} />
          </Box>
          <Stack spacing={0.5}>
            <Typography variant="h6">{t('emptyHistory')}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('emptyHistorySub')}
            </Typography>
          </Stack>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="solar:pen-new-square-bold" />}
            onClick={() => router.push(paths.dashboard.simulator.root)}
            sx={{ minHeight: 44 }}
          >
            {t('startFirstReflection')}
          </Button>
        </Stack>
      </Card>
    );
  }

  return (
    <Stack spacing={2.5}>
      <Card sx={{ borderRadius: 2, boxShadow: (theme) => theme.customShadows?.card || 1 }}>
        <Stack divider={<Divider flexItem />}>
          {items.map((item) => {
            const isCompleted = item.conversation_state === 'final' || item.total_turns >= 10;
            const isContinuable = !isCompleted && !item.safety_triggered;

            return (
              <CardActionArea
                key={item.id}
                onClick={() => handleSelect(item.id)}
                sx={{
                  transition: 'all 200ms ease',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Stack spacing={1.5} sx={{ px: { xs: 2, md: 3 }, py: 2.5 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      color: 'text.primary',
                    }}
                  >
                    {item.thought}
                  </Typography>

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 1, sm: 2 }}
                    sx={{ alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between' }}
                  >
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <Iconify icon="solar:calendar-date-bold" width={16} sx={{ color: 'text.disabled' }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {fDateTime(item.created_at)}
                      </Typography>
                      {item.total_turns > 0 && (
                        <>
                          <Typography variant="caption" sx={{ color: 'text.disabled' }}>•</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                            {t('turnCount', { count: item.total_turns })}
                          </Typography>
                        </>
                      )}
                    </Stack>

                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      {item.safety_triggered ? (
                        <Chip
                          size="small"
                          label={t('safetyTitle')}
                          color="warning"
                          variant="soft"
                          icon={<Iconify icon="solar:shield-warning-bold" />}
                        />
                      ) : isContinuable ? (
                        <Chip
                          size="small"
                          label={t('stateContinued')}
                          color="success"
                          variant="soft"
                          icon={<Iconify icon="solar:chat-line-bold" />}
                        />
                      ) : (
                        <Chip
                          size="small"
                          label={t('stateFinal')}
                          color="default"
                          variant="soft"
                          icon={<Iconify icon="solar:check-circle-bold" />}
                        />
                      )}
                    </Stack>
                  </Stack>
                </Stack>
              </CardActionArea>
            );
          })}
        </Stack>
      </Card>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Stack>
  );
}
