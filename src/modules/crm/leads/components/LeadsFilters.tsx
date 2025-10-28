import { TextField, Select, MenuItem } from '@venturo/react-ui';
import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/shared/hooks';

interface LeadsFiltersProps {
  search: string;
  category: string;
  source: string;
  assignedTo: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onAssignedToChange: (value: string) => void;
  onReset?: () => void;
}

export const LeadsFilters: React.FC<LeadsFiltersProps> = ({
  search,
  category,
  source,
  assignedTo,
  onSearchChange,
  onCategoryChange,
  onSourceChange,
  onAssignedToChange,
}) => {
  // Local state for input (immediate update for responsive UI)
  const [searchValue, setSearchValue] = useState(search);

  // Track previous values to detect reset
  const prevFilters = useRef({ search, category, source, assignedTo });

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
      prevFilters.current.category !== 'all' ||
      prevFilters.current.source !== 'all' ||
      prevFilters.current.assignedTo !== 'all';

    const isNowEmpty =
      search === '' &&
      category === 'all' &&
      source === 'all' &&
      assignedTo === 'all';

    // If this looks like a reset operation
    if (wasFiltered && isNowEmpty) {
      onSearchChange('');
      onCategoryChange('all');
      onSourceChange('all');
      onAssignedToChange('all');
    }

    // Update prev values
    prevFilters.current = { search, category, source, assignedTo };
  }, [search, category, source, assignedTo]);

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
            placeholder="Search by Company or Contact"
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
            value={category}
            onChange={(e) => onCategoryChange(e.target.value as string)}
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
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="hot">🔥 Hot</MenuItem>
            <MenuItem value="warm">🌤 Warm</MenuItem>
            <MenuItem value="cold">❄️ Cold</MenuItem>
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
            <MenuItem value="Website Form">Website Form</MenuItem>
            <MenuItem value="Cold Call">Cold Call</MenuItem>
            <MenuItem value="Referral">Referral</MenuItem>
            <MenuItem value="Social Media">Social Media</MenuItem>
          </Select>

          <Select
            value={assignedTo}
            onChange={(e) => onAssignedToChange(e.target.value as string)}
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
            <MenuItem value="Budi">Budi</MenuItem>
            <MenuItem value="Linda">Linda</MenuItem>
            <MenuItem value="Eko">Eko</MenuItem>
          </Select>
        </div>
      </div>
    </div>
  );
};
