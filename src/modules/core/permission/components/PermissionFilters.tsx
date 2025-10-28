import { TextField, FormControl, InputLabel, Select, MenuItem } from '@venturo/react-ui';
import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/shared/hooks';
import { useGetListModules } from '@/app/api/core/module/useModuleApi';

interface PermissionFiltersProps {
  search: string;
  resource: string;
  action: string;
  moduleId?: string;
  onSearchChange: (value: string) => void;
  onResourceChange: (value: string) => void;
  onActionChange: (value: string) => void;
  onModuleIdChange?: (value: string) => void;
  onReset?: () => void;
}

export const PermissionFilters: React.FC<PermissionFiltersProps> = ({
  search,
  resource,
  action,
  moduleId = '',
  onSearchChange,
  onResourceChange,
  onActionChange,
  onModuleIdChange,
}) => {
  // Fetch modules for dropdown
  const { data: modulesData } = useGetListModules({
    is_active: true,
  });
  const modules = modulesData?.data?.data || [];

  // Local state for input (immediate update for responsive UI)
  const [searchValue, setSearchValue] = useState(search);
  const [resourceValue, setResourceValue] = useState(resource);
  const [actionValue, setActionValue] = useState(action);
  const [moduleIdValue, setModuleIdValue] = useState(moduleId);

  // Track previous values to detect reset
  const prevFilters = useRef({ search, resource, action, moduleId });

  // Debounce the input values
  const debouncedSearch = useDebounce(searchValue, 500);
  const debouncedResource = useDebounce(resourceValue, 500);
  const debouncedAction = useDebounce(actionValue, 500);

  // Update input values when props change (e.g., from reset)
  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  useEffect(() => {
    setResourceValue(resource);
  }, [resource]);

  useEffect(() => {
    setActionValue(action);
  }, [action]);

  useEffect(() => {
    setModuleIdValue(moduleId);
  }, [moduleId]);

  // Detect if all filters were reset (all became empty from non-empty)
  useEffect(() => {
    const wasFiltered =
      prevFilters.current.search !== '' ||
      prevFilters.current.resource !== '' ||
      prevFilters.current.action !== '' ||
      prevFilters.current.moduleId !== '';

    const isNowEmpty = search === '' && resource === '' && action === '' && moduleId === '';

    // If this looks like a reset operation (had filters, now all empty)
    if (wasFiltered && isNowEmpty) {
      // Immediately notify all handlers to trigger API call without waiting for debounce
      onSearchChange('');
      onResourceChange('');
      onActionChange('');
      onModuleIdChange?.('');
    }

    // Update prev values
    prevFilters.current = { search, resource, action, moduleId };
  }, [search, resource, action, moduleId]);

  // Trigger filters when debounced values change
  useEffect(() => {
    if (debouncedSearch !== search) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (debouncedResource !== resource) {
      onResourceChange(debouncedResource);
    }
  }, [debouncedResource]);

  useEffect(() => {
    if (debouncedAction !== action) {
      onActionChange(debouncedAction);
    }
  }, [debouncedAction]);

  return (
    <div className="border-t border-[#ebeded] bg-white mt-4">
      <div className="flex flex-col gap-4 pt-4">
        {/* Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormControl fullWidth size="small">
            <InputLabel>Module</InputLabel>
            <Select
              value={moduleIdValue}
              label="Module"
              onChange={(e) => {
                const value = e.target.value as string;
                setModuleIdValue(value);
                onModuleIdChange?.(value);
              }}
              sx={{
                borderRadius: '9px',
                bgcolor: 'white',
                fontSize: '12px',
                height: '40px',
                '& fieldset': {
                  borderColor: '#e7e9e9',
                },
              }}
            >
              <MenuItem value="">All Modules</MenuItem>
              {modules.map((module) => (
                <MenuItem key={module.id} value={module.id}>
                  {module.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            placeholder="Search by resource or action"
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
          <TextField
            placeholder="Filter by resource"
            value={resourceValue}
            onChange={(e) => setResourceValue(e.target.value)}
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
          <TextField
            placeholder="Filter by action"
            value={actionValue}
            onChange={(e) => setActionValue(e.target.value)}
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
        </div>
      </div>
    </div>
  );
};
