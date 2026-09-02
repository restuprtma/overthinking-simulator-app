import type { DialogTurn } from '../types';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';

// ----------------------------------------------------------------------

type Props = {
  turn: DialogTurn;
};

export function MessageBubble({ turn }: Props) {
  const { t } = useTranslate('simulator');

  const isCemas = turn.speaker === 'cemas';
  const speakerName = isCemas ? t('cemas') : t('realistis');

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isCemas ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: { xs: '90%', md: '80%' },
          p: 2.5,
          borderRadius: 2,
          bgcolor: isCemas ? 'primary.lighter' : 'background.paper',
          border: '1px solid',
          borderColor: isCemas ? 'primary.light' : 'divider',
          boxShadow: () =>
            isCemas
              ? '0 2px 8px rgba(139, 92, 246, 0.12)'
              : '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.75 }}>
          <Iconify
            icon={isCemas ? 'solar:user-bold' : 'solar:magic-stick-3-bold'}
            width={16}
            sx={{ color: isCemas ? 'primary.dark' : 'success.main' }}
          />
          <Typography
            variant="subtitle2"
            sx={{
              color: isCemas ? 'primary.darker' : 'text.primary',
              fontWeight: 700,
              fontSize: '0.8125rem',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            {speakerName}
          </Typography>
        </Stack>

        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.65,
            color: isCemas ? 'primary.darker' : 'text.primary',
            fontSize: '0.9375rem',
          }}
        >
          {turn.text}
        </Typography>

        {turn.timestamp && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: isCemas ? 'right' : 'left',
              color: 'text.secondary',
              fontSize: '0.7rem',
              mt: 1,
            }}
          >
            {new Date(turn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
