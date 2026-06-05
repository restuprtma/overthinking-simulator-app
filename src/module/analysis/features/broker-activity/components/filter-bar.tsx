import type { BrokerActivityEngine } from '../hooks/use-broker-activity';

import dayjs from 'dayjs';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useTranslate } from 'src/locales';

import { BROKERS } from '../data/mock';

// ----------------------------------------------------------------------

type Props = {
  engine: BrokerActivityEngine;
};

const TODAY = dayjs('2026-05-20');
const MIN_DATE = TODAY.subtract(2, 'year');
const MAX_DATE = TODAY.subtract(1, 'day');

const TYPE_LABEL: Record<'foreign' | 'domestic' | 'bumn', string> = {
  foreign: 'Foreign',
  domestic: 'Local',
  bumn: 'BUMN',
};

export function FilterBar({ engine }: Props) {
  const { t } = useTranslate('broker-activity');
  const { code, date, setCode, setDate } = engine;

  return (
    <Stack
      spacing={1.5}
      sx={{
        py: 1.5,
        px: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        height: '100%',
        justifyContent: 'center',
      }}
    >
      <Autocomplete
        size="small"
        fullWidth
        options={BROKERS}
        value={BROKERS.find((b) => b.code === code) ?? BROKERS[0]}
        onChange={(_, next) => {
          if (next) setCode(next.code);
        }}
        disableClearable
        getOptionLabel={(opt) => `${opt.code} · ${opt.name}`}
        filterOptions={(opts, state) => {
          const q = state.inputValue.trim().toUpperCase();
          if (!q) return opts;
          return opts.filter((o) => o.code.includes(q) || o.name.toUpperCase().includes(q));
        }}
        isOptionEqualToValue={(a, b) => a.code === b.code}
        renderOption={(props, opt) => {
          const { key, ...liProps } = props as typeof props & { key: React.Key };
          return (
            <li key={key} {...liProps}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 800, minWidth: 36 }}>
                  {opt.code}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                  }}
                >
                  {opt.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      opt.type === 'foreign'
                        ? 'info.main'
                        : opt.type === 'bumn'
                          ? 'warning.main'
                          : 'text.disabled',
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {TYPE_LABEL[opt.type]}
                </Typography>
              </Stack>
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t('filter.broker')}
            placeholder={t('filter.searchBroker')}
          />
        )}
      />

      <DatePicker
        label={t('filter.date')}
        value={dayjs(date)}
        onChange={(d) => {
          if (d && d.isValid()) setDate(d.format('YYYY-MM-DD'));
        }}
        minDate={MIN_DATE}
        maxDate={MAX_DATE}
        shouldDisableDate={(d) => {
          const dow = d.day();
          return dow === 0 || dow === 6;
        }}
        format="DD MMM YYYY"
        slotProps={{ textField: { size: 'small', fullWidth: true } }}
      />
    </Stack>
  );
}
