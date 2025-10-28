import { TextField, Select, MenuItem } from '@venturo/react-ui';
import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/shared/hooks';

interface CompanyFiltersProps {
  search: string;
  isActive: boolean | undefined;
  onSearchChange: (value: string) => void;
  onStatusFilter: (status: boolean | undefined) => void;
}

export const CompanyFilters: React.FC<CompanyFiltersProps> = ({
  search,
  isActive,
  onSearchChange,
  onStatusFilter,
}) => {
  // Local state for input (immediate update for responsive UI)
  const [inputValue, setInputValue] = useState(search);

  // Track previous values to detect reset
  const prevFilters = useRef({ search });

  // Debounce the input value
  const debouncedSearch = useDebounce(inputValue, 500);

  // Update input value when prop changes (e.g., from reset)
  useEffect(() => {
    setInputValue(search);
  }, [search]);

  // Detect if all filters were reset (all became empty from non-empty)
  // If reset detected, immediately call handlers to bypass debounce delay
  useEffect(() => {
    const wasFiltered = prevFilters.current.search !== '';
    const isNowEmpty = search === '';

    // If this looks like a reset operation (had filters, now all empty)
    if (wasFiltered && isNowEmpty) {
      // Immediately notify handler to trigger API call without waiting for debounce
      onSearchChange('');
    }

    // Update prev values
    prevFilters.current = { search };
  }, [search, onSearchChange]);

  // Trigger filters when debounced value changes (only if not already handled by reset)
  useEffect(() => {
    // Only trigger if the debounced value actually differs from current prop
    // This prevents double-calling after reset
    if (debouncedSearch !== search) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <div className="border-t border-[#ebeded] bg-white mt-4">
      <div className="flex flex-col gap-4 pt-4">
        {/* Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            placeholder="Search by company name, code, or email"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
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
            value={isActive === undefined ? 'all' : isActive ? 'active' : 'inactive'}
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'all') {
                onStatusFilter(undefined);
              } else if (value === 'active') {
                onStatusFilter(true);
              } else {
                onStatusFilter(false);
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
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </div>
      </div>
    </div>
  );
};
