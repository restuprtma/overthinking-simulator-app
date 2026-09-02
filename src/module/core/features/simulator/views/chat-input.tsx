import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/shared/ui/iconify';

// ----------------------------------------------------------------------

type Props = {
  disabled: boolean;
  placeholder: string;
  onSubmit: (message: string) => void;
};

export function ChatInput({ disabled, placeholder, onSubmit }: Props) {
  const [value, setValue] = useState('');

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed && !disabled) {
      onSubmit(trimmed);
      setValue('');
    }
  }, [disabled, onSubmit, value]);

  return (
    <Box
      sx={{
        position: 'sticky',
        bottom: 16,
        zIndex: 10,
        pt: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          alignItems: 'flex-end',
          bgcolor: 'background.paper',
          boxShadow: (theme) => theme.customShadows?.dropdown || '0 8px 24px rgba(0,0,0,0.12)',
          borderRadius: 2,
          p: 1.5,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <TextField
          fullWidth
          multiline
          minRows={2}
          maxRows={6}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: {
              px: 1,
              py: 0.5,
              fontSize: '0.9375rem',
              lineHeight: 1.5,
            },
          }}
        />

        <IconButton
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            width: 44,
            height: 44,
            minWidth: 44,
            minHeight: 44,
            borderRadius: 1.5,
            '&:hover': { bgcolor: 'primary.dark' },
            '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'action.disabled' },
          }}
        >
          <Iconify icon="solar:plain-bold" width={20} />
        </IconButton>
      </Box>
    </Box>
  );
}
