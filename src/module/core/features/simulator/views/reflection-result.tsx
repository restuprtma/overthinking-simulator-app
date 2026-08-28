import type { DialogTurn, Reflection } from '../types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

type Props = {
  reflection: Reflection;
};

export function ReflectionResult({ reflection }: Props) {
  const { t } = useTranslate('simulator');

  if (reflection.safety_triggered) {
    return (
      <Stack spacing={3}>
        <Card
          sx={{
            p: { xs: 2.5, md: 4 },
            border: (theme) => `1px solid ${theme.vars.palette.warning.main}`,
            bgcolor: 'warning.lighter',
          }}
        >
          <Stack spacing={2}>
            <Box
              sx={{
                width: 44,
                height: 44,
                display: 'flex',
                borderRadius: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'warning.main',
                color: 'warning.contrastText',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                !
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {t('safetyTitle')}
            </Typography>
            {reflection.safety_response && (
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                {reflection.safety_response}
              </Typography>
            )}
          </Stack>
        </Card>

        {reflection.actionable_suggestion && (
          <Card sx={{ p: { xs: 2.5, md: 4 } }}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                {t('suggestion')}
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                {reflection.actionable_suggestion}
              </Typography>
            </Stack>
          </Card>
        )}
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={2}>
        {reflection.dialog.map((turn: DialogTurn, index: number) => {
          const isCemas = turn.speaker === 'cemas';
          return (
            <Box
              key={`${turn.speaker}-${index}`}
              sx={{
                display: 'flex',
                justifyContent: isCemas ? 'flex-start' : 'flex-end',
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  maxWidth: { xs: '92%', md: 560 },
                  p: 2,
                  borderRadius: 2,
                  bgcolor: isCemas ? 'secondary.lighter' : 'primary.lighter',
                  border: (theme) =>
                    `1px solid ${isCemas ? theme.vars.palette.secondary.main : theme.vars.palette.primary.light}`,
                }}
              >
                <Stack spacing={1}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: isCemas ? 'secondary.darker' : 'primary.darker',
                      fontWeight: 700,
                    }}
                  >
                    {isCemas ? t('cemas') : t('realistis')}
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    {turn.text}
                  </Typography>
                </Stack>
              </Paper>
            </Box>
          );
        })}
      </Stack>

      <Card sx={{ p: { xs: 2.5, md: 4 } }}>
        <Stack spacing={1}>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            {t('suggestion')}
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
            {reflection.actionable_suggestion}
          </Typography>
        </Stack>
      </Card>
    </Stack>
  );
}
