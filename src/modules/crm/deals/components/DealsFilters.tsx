import { TextField, Select, MenuItem } from '@venturo/react-ui';
import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/shared/hooks';

interface DealsFiltersProps {
  search: string;
  status: string;
  source: string;
  salesPerson: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onSalesPersonChange: (value: string) => void;
  onReset?: () => void;
}

export const DealsFilters: React.FC<DealsFiltersProps> = ({
  search,
  status,
  source,
  salesPerson,
  onSearchChange,
  onStatusChange,
  onSourceChange,
  onSalesPersonChange,
}) => {
  // Local state for input (immediate update for responsive UI)
  const [searchValue, setSearchValue] = useState(search);

  // Track previous values to detect reset
  const prevFilters = useRef({ search, status, source, salesPerson });

  // Debounce the search value
  const debouncedSearch = useDebounce(searchValue, 500);

  // Update input values when props change (e.g., from reset)
  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  // Detect if all filters were reset
  useEffect(() => {
    const wasFiltered =
      prevFilters.current.search !== '' ||
      prevFilters.current.status !== 'all' ||
      prevFilters.current.source !== 'all' ||
      prevFilters.current.salesPerson !== 'all';

    const isNowEmpty =
      search === '' &&
      status === 'all' &&
      source === 'all' &&
      salesPerson === 'all';

    // If this looks like a reset operation
    if (wasFiltered && isNowEmpty) {
      onSearchChange('');
      onStatusChange('all');
      onSourceChange('all');
      onSalesPersonChange('all');
    }

    // Update prev values
    prevFilters.current = { search, status, source, salesPerson };
  }, [search, status, source, salesPerson]);

  // Trigger search when debounced value changes
  useEffect(() => {
    if (debouncedSearch !== search) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <div className="border-t border-[#ebeded] bg-white mt-4">
      <div className="flex flex-col gap-4 pt-4">
        {/* Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TextField
            placeholder="Search by Client or Deal ID"
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
            value={status}
            onChange={(e) => onStatusChange(e.target.value as string)}
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
            <MenuItem value="Won">Won</MenuItem>
            <MenuItem value="Lost">Lost</MenuItem>
          </Select>

          <Select
            value={source}
            onChange={(e) => onSourceChange(e.target.value as string)}
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
            <MenuItem value="all">All Sources</MenuItem>
            <MenuItem value="WhatsApp">WhatsApp</MenuItem>
            <MenuItem value="Referral">Referral</MenuItem>
            <MenuItem value="Cold Call">Cold Call</MenuItem>
            <MenuItem value="Website">Website</MenuItem>
            <MenuItem value="Social Media">Social Media</MenuItem>
          </Select>

          <Select
            value={salesPerson}
            onChange={(e) => onSalesPersonChange(e.target.value as string)}
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
            <MenuItem value="all">All Sales</MenuItem>
            <MenuItem value="Ahmad">Ahmad</MenuItem>
            <MenuItem value="Sari">Sari</MenuItem>
            <MenuItem value="Linda">Linda</MenuItem>
            <MenuItem value="Budi">Budi</MenuItem>
            <MenuItem value="Eko">Eko</MenuItem>
          </Select>
        </div>
      </div>
    </div>
  );
};
