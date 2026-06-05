import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/shared/ui/iconify';

// ----------------------------------------------------------------------

export type SubTabKey =
  | 'chart'
  | 'ownership'
  | 'broker'
  | 'broker-tracker'
  | 'inventory'
  | 'liquidity'
  | 'financial'
  | 'announcements'
  | 'metadata'
  | 'relation-map';

const TABS: { key: SubTabKey; label: string }[] = [
  { key: 'chart', label: 'Chart' },
  { key: 'ownership', label: 'Ownership' },
  { key: 'broker', label: 'Broker' },
  { key: 'broker-tracker', label: 'Broker Tracker' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'liquidity', label: 'Liquidity' },
  { key: 'financial', label: 'Financial' },
  { key: 'announcements', label: 'Announcements' },
  { key: 'metadata', label: 'Metadata' },
  { key: 'relation-map', label: 'Relation Map' },
];

type Props = {
  value: SubTabKey;
  onChange: (key: SubTabKey) => void;
};

export function SubTabs({ value, onChange }: Props) {
  return (
    <Stack
      direction="row"
      sx={{
        px: 1,
        py: 0.5,
        gap: 0.25,
        alignItems: 'center',
        borderBottom: (t) => `1px solid ${t.palette.divider}`,
      }}
    >
      <Stack direction="row" sx={{ flex: 1, overflow: 'auto', gap: 0.25 }}>
        {TABS.map((tab) => {
          const active = tab.key === value;
          return (
            <Box
              key={tab.key}
              role="button"
              tabIndex={0}
              onClick={() => onChange(tab.key)}
              sx={{
                px: 1.5,
                py: 0.65,
                fontSize: 12,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                borderRadius: 0.75,
                cursor: 'pointer',
                userSelect: 'none',
                color: active ? 'text.primary' : 'text.secondary',
                bgcolor: (t) => (active ? t.palette.action.selected : 'transparent'),
                transition: (t) => t.transitions.create(['background-color', 'color']),
                '&:hover': { color: 'text.primary' },
              }}
            >
              {tab.label}
            </Box>
          );
        })}
      </Stack>
      <Stack direction="row" spacing={0.25}>
        <IconButton size="small" sx={{ width: 28, height: 28, color: 'text.disabled' }}>
          <Iconify icon="solar:notes-bold-duotone" width={14} />
        </IconButton>
        <IconButton size="small" sx={{ width: 28, height: 28, color: 'text.disabled' }}>
          <Iconify icon="solar:list-bold" width={14} />
        </IconButton>
        <IconButton size="small" sx={{ width: 28, height: 28, color: 'text.disabled' }}>
          <Iconify icon="solar:chart-square-outline" width={14} />
        </IconButton>
      </Stack>
    </Stack>
  );
}
