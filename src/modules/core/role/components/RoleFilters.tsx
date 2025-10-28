import { TextField, Select, MenuItem } from '@venturo/react-ui';
import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/shared/hooks';

interface RoleFiltersProps {
  search: string;
  includeSystem: boolean | undefined;
  onSearchChange: (value: string) => void;
  onIncludeSystemFilter: (value: boolean | undefined) => void;
  onReset?: () => void;
}

export const RoleFilters: React.FC<RoleFiltersProps> = ({
  search,
  includeSystem,
  onSearchChange,
  onIncludeSystemFilter,
}) => {
  // Local state for input (immediate update for responsive UI)
  const [searchValue, setSearchValue] = useState(search);

  // Track previous values to detect reset
  const prevFilters = useRef({ search, includeSystem });

  // Debounce the input values
  const debouncedSearch = useDebounce(searchValue, 500);

  // Update input values when props change (e.g., from reset)
  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  // Detect if all filters were reset (all became default from non-default)
  // If reset detected, immediately call handlers to bypass debounce delay
  useEffect(() => {
    const wasFiltered =
      prevFilters.current.search !== '' || prevFilters.current.includeSystem !== true;

    const isNowDefault = search === '' && includeSystem === true;

    // If this looks like a reset operation (had filters, now all default)
    if (wasFiltered && isNowDefault) {
      // Immediately notify all handlers to trigger API call without waiting for debounce
      onSearchChange('');
      onIncludeSystemFilter(true);
    }

    // Update prev values
    prevFilters.current = { search, includeSystem };
  }, [search, includeSystem, onSearchChange, onIncludeSystemFilter]);

  // Trigger filters when debounced values change (only if not already handled by reset)
  useEffect(() => {
    // Only trigger if the debounced value actually differs from current prop
    // This prevents double-calling after reset
    if (debouncedSearch !== search) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, search, onSearchChange]);

  return (
    <div className="border-t border-[#ebeded] bg-white mt-4">
      <div className="flex flex-col gap-4 pt-4">
        {/* Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            placeholder="Search by role name or description"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            size="small"
            className="flex-1"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '9px',
                bgcolor: 'white',
                fontSize: '12px',
                height: '40px',
                '& fieldset': {
                  borderColor: '#e7e9e9',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#8e989a',
                opacity: 1,
              },
            }}
          />
          <Select
            value={includeSystem === undefined ? 'all' : includeSystem ? 'true' : 'false'}
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'all') {
                onIncludeSystemFilter(undefined);
              } else if (value === 'true') {
                onIncludeSystemFilter(true);
              } else {
                onIncludeSystemFilter(false);
              }
            }}
            size="small"
            className="flex-1"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '9px',
                bgcolor: 'white',
                fontSize: '12px',
                height: '40px',
                '& fieldset': {
                  borderColor: '#e7e9e9',
                },
              },
            }}
          >
            <MenuItem value="all">All Roles</MenuItem>
            <MenuItem value="true">Include System Roles</MenuItem>
            <MenuItem value="false">Exclude System Roles</MenuItem>
          </Select>
        </div>
      </div>
    </div>
  );
};
