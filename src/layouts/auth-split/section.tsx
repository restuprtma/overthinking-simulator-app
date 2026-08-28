import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
import { CONFIG } from 'src/shared/config';

// ----------------------------------------------------------------------

export type AuthSplitSectionProps = BoxProps & {
  title?: string;
  method?: string;
  imgUrl?: string;
  subtitle?: string;
  layoutQuery?: Breakpoint;
  methods?: {
    path: string;
    icon: string;
    label: string;
  }[];
};

export function AuthSplitSection({
  sx,
  method,
  methods,
  layoutQuery = 'md',
  title,
  imgUrl = `${CONFIG.assetsDir}/assets/illustrations/illustration-dashboard.webp`,
  subtitle,
  ...other
}: AuthSplitSectionProps) {
  const { t } = useTranslate('auth');

  const brandName = title ?? t('brand.name');
  const brandTagline = subtitle ?? t('brand.tagline');

  return (
    <Box
      sx={[
        (theme) => ({
          px: 3,
          pb: 3,
          width: 1,
          maxWidth: 480,
          display: 'none',
          position: 'relative',
          pt: 'var(--layout-header-desktop-height)',
          [theme.breakpoints.up(layoutQuery)]: {
            gap: 6,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={(theme) => ({
          width: 1,
          p: 6,
          gap: 3,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          borderRadius: 4,
          color: theme.vars.palette.common.white,
          background: `linear-gradient(135deg, ${theme.vars.palette.primary.dark}, ${theme.vars.palette.primary.light})`,
          boxShadow: theme.vars.customShadows.card,
        })}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            bgcolor: 'rgba(255, 255, 255, 0.16)',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            OS
          </Typography>
        </Box>

        <Typography variant="h3" sx={{ textAlign: 'center', color: 'inherit' }}>
          {brandName}
        </Typography>

        {brandTagline && (
          <Typography
            variant="body1"
            sx={{ color: 'rgba(255, 255, 255, 0.9)', textAlign: 'center', lineHeight: 1.6 }}
          >
            {brandTagline}
          </Typography>
        )}
      </Box>

      {!!methods?.length && method && (
        <Box component="ul" sx={{ gap: 2, display: 'flex' }}>
          {methods.map((option) => {
            const selected = method === option.label.toLowerCase();

            return (
              <Box
                key={option.label}
                component="li"
                sx={{
                  ...(!selected && {
                    cursor: 'not-allowed',
                    filter: 'grayscale(1)',
                  }),
                }}
              >
                <Tooltip title={option.label} placement="top">
                  <Link
                    component={RouterLink}
                    href={option.path}
                    sx={{ ...(!selected && { pointerEvents: 'none' }) }}
                  >
                    <Box
                      component="img"
                      alt={option.label}
                      src={option.icon}
                      sx={{ width: 32, height: 32 }}
                    />
                  </Link>
                </Tooltip>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
