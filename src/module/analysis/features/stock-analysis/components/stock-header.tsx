import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/shared/ui/iconify';

// ----------------------------------------------------------------------

export type TopTabKey =
  | 'market'
  | 'screener'
  | 'watchlist'
  | 'notes'
  | 'ai-summary'
  | 'stock-detail';

const TABS: { key: TopTabKey; label: string; icon?: string }[] = [
  { key: 'market', label: 'Market' },
  { key: 'screener', label: 'Screener' },
  { key: 'watchlist', label: 'Watchlist' },
  { key: 'notes', label: 'Notes' },
  { key: 'ai-summary', label: 'AI Summary', icon: 'solar:double-alt-arrow-up-bold-duotone' },
  { key: 'stock-detail', label: 'Stock Detail' },
];

type Props = {
  stockCode: string;
  topTab: TopTabKey;
  onTopTabChange: (k: TopTabKey) => void;
};

export function StockHeader({ stockCode, topTab, onTopTabChange }: Props) {
  return (
    <Stack
      direction="row"
      sx={{
        px: 1,
        py: 0.85,
        alignItems: 'center',
        gap: 1.5,
        borderBottom: (t) => `1px solid ${t.palette.divider}`,
      }}
    >
      {/* Stock search */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          px: 1.25,
          py: 0.5,
          minWidth: 200,
          borderRadius: 1,
          border: (t) => `1px solid ${t.palette.divider}`,
          alignItems: 'center',
          bgcolor: 'background.paper',
        }}
      >
        <Iconify icon="eva:search-fill" width={14} sx={{ color: 'text.disabled' }} />
        <Typography variant="body2" sx={{ fontWeight: 800, flex: 1 }}>
          {stockCode}
        </Typography>
        <Chip
          size="small"
          label="ALT+S"
          sx={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 0.4,
            height: 18,
            bgcolor: (t) => t.palette.action.hover,
            color: 'text.disabled',
            border: 'none',
          }}
        />
      </Stack>

      {/* Top tabs */}
      <Stack direction="row" sx={{ flex: 1, gap: 0.25, overflow: 'auto' }}>
        {TABS.map((tab) => {
          const active = tab.key === topTab;
          return (
            <Box
              key={tab.key}
              role="button"
              tabIndex={0}
              onClick={() => onTopTabChange(tab.key)}
              sx={{
                px: 1.5,
                py: 0.65,
                fontSize: 12,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                borderRadius: 0.75,
                cursor: 'pointer',
                userSelect: 'none',
                color: active ? 'primary.main' : 'text.secondary',
                position: 'relative',
                transition: (t) => t.transitions.create(['color']),
                '&::after': active
                  ? {
                      content: '""',
                      position: 'absolute',
                      left: 12,
                      right: 12,
                      bottom: -10,
                      height: 2,
                      bgcolor: 'primary.main',
                      borderRadius: 1,
                    }
                  : undefined,
                '&:hover': { color: 'text.primary' },
              }}
            >
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                {tab.icon && (
                  <Iconify
                    icon={tab.icon as 'solar:double-alt-arrow-up-bold-duotone'}
                    width={14}
                    sx={{ color: active ? 'primary.main' : 'secondary.main' }}
                  />
                )}
                <Box component="span">{tab.label}</Box>
              </Stack>
            </Box>
          );
        })}
      </Stack>

      <IconButton size="small" sx={{ color: 'text.disabled' }}>
        <Iconify icon="solar:bell-bing-bold-duotone" width={16} />
      </IconButton>
    </Stack>
  );
}
