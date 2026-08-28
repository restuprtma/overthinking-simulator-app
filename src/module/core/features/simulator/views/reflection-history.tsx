import type { ReflectionSummary } from '../types';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

import { useTranslate } from 'src/locales';
import { fDateTime } from 'src/shared/utils';
import { Iconify } from 'src/shared/ui/iconify';

import { listReflections } from '../api';

// ----------------------------------------------------------------------

type Props = {
  onSelect: (id: string) => void;
};

export function ReflectionHistory({ onSelect }: Props) {
  const { t } = useTranslate('simulator');

  const [items, setItems] = useState<ReflectionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listReflections()
      .then((res) => {
        if (active) setItems(res.data);
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

  const handleSelect = useCallback((id: string) => onSelect(id), [onSelect]);

  if (loading) {
    return (
      <Stack spacing={2}>
        {[0, 1, 2].map((n) => (
          <Card key={n} sx={{ p: 2.5 }}>
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="40%" />
          </Card>
        ))}
      </Stack>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (items.length === 0) {
    return (
      <Card sx={{ p: { xs: 4, md: 6 }, textAlign: 'center' }}>
        <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
          <Iconify icon="solar:chat-round-dots-bold" width={48} sx={{ color: 'text.disabled' }} />
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            {t('emptyHistory')}
          </Typography>
        </Stack>
      </Card>
    );
  }

  return (
    <Card>
      <Stack divider={<Divider flexItem />}>
        {items.map((item) => (
          <CardActionArea key={item.id} onClick={() => handleSelect(item.id)}>
            <Stack spacing={0.5} sx={{ px: 2.5, py: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {item.thought}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {fDateTime(item.created_at)}
                </Typography>
                {item.safety_triggered && (
                  <Box
                    component="span"
                    sx={{
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                      fontSize: 11,
                      bgcolor: 'warning.lighter',
                      color: 'warning.darker',
                    }}
                  >
                    {t('safetyTitle')}
                  </Box>
                )}
              </Stack>
            </Stack>
          </CardActionArea>
        ))}
      </Stack>
    </Card>
  );
}
