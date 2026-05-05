import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export function HomeView() {
  const { t } = useTranslate('home');

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Stack spacing={1}>
        <Typography variant="h4">{t('title')}</Typography>
        <Typography variant="body2" color="text.secondary">
          {t('subtitle')}
        </Typography>
      </Stack>
    </Box>
  );
}
