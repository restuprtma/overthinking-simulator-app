import React from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@venturo/react-ui';
import { IconSearch } from '@tabler/icons-react';

interface ModuleFiltersProps {
  search: string;
  isActive?: boolean;
  isMenuVisible?: boolean;
  onSearchChange: (value: string) => void;
  onIsActiveChange: (value: boolean | undefined) => void;
  onIsMenuVisibleChange?: (value: boolean | undefined) => void;
}

export const ModuleFilters: React.FC<ModuleFiltersProps> = ({
  search,
  isActive,
  isMenuVisible,
  onSearchChange,
  onIsActiveChange,
  onIsMenuVisibleChange,
}) => {
  return (
    <Box sx={{ pt: 3, borderTop: '1px solid #e0e0e0' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search */}
        <TextField
          label="Search"
          placeholder="Search by code, name, or description"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <IconSearch size={18} stroke={1.5} />,
            },
          }}
          size="small"
          fullWidth
        />

        {/* Is Active Filter */}
        <FormControl fullWidth size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={isActive === undefined ? 'all' : isActive ? 'active' : 'inactive'}
            label="Status"
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'all') {
                onIsActiveChange(undefined);
              } else {
                onIsActiveChange(value === 'active');
              }
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        {/* Menu Visibility Filter (Optional) */}
        {onIsMenuVisibleChange && (
          <FormControl fullWidth size="small">
            <InputLabel>Menu Visibility</InputLabel>
            <Select
              value={isMenuVisible === undefined ? 'all' : isMenuVisible ? 'visible' : 'hidden'}
              label="Menu Visibility"
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'all') {
                  onIsMenuVisibleChange(undefined);
                } else {
                  onIsMenuVisibleChange(value === 'visible');
                }
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="visible">Visible</MenuItem>
              <MenuItem value="hidden">Hidden</MenuItem>
            </Select>
          </FormControl>
        )}
      </div>
    </Box>
  );
};
