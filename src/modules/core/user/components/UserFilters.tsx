import { TextField, Select, MenuItem } from '@venturo/react-ui';
import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/shared/hooks';

interface UserFiltersProps {
  search: string;
  fullName: string;
  username: string;
  email: string;
  isActive: boolean | undefined;
  onSearchChange: (value: string) => void;
  onFullNameChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onStatusFilter: (status: boolean | undefined) => void;
  onReset?: () => void; // Optional callback when filters are reset
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  search,
  fullName,
  username,
  email,
  isActive,
  onSearchChange,
  onFullNameChange,
  onUsernameChange,
  onEmailChange,
  onStatusFilter,
}) => {
  // Local state for input (immediate update for responsive UI)
  const [inputValue, setInputValue] = useState(search);
  const [fullNameValue, setFullNameValue] = useState(fullName);
  const [usernameValue, setUsernameValue] = useState(username);
  const [emailValue, setEmailValue] = useState(email);

  // Track previous values to detect reset
  const prevFilters = useRef({ search, fullName, username, email });

  // Debounce the input values
  const debouncedSearch = useDebounce(inputValue, 500);
  const debouncedFullName = useDebounce(fullNameValue, 500);
  const debouncedUsername = useDebounce(usernameValue, 500);
  const debouncedEmail = useDebounce(emailValue, 500);

  // Update input values when props change (e.g., from reset)
  useEffect(() => {
    setInputValue(search);
  }, [search]);

  useEffect(() => {
    setFullNameValue(fullName);
  }, [fullName]);

  useEffect(() => {
    setUsernameValue(username);
  }, [username]);

  useEffect(() => {
    setEmailValue(email);
  }, [email]);

  // Detect if all filters were reset (all became empty from non-empty)
  // If reset detected, immediately call handlers to bypass debounce delay
  useEffect(() => {
    const wasFiltered =
      prevFilters.current.search !== '' ||
      prevFilters.current.fullName !== '' ||
      prevFilters.current.username !== '' ||
      prevFilters.current.email !== '';

    const isNowEmpty =
      search === '' &&
      fullName === '' &&
      username === '' &&
      email === '';

    // If this looks like a reset operation (had filters, now all empty)
    if (wasFiltered && isNowEmpty) {
      // Immediately notify all handlers to trigger API call without waiting for debounce
      onSearchChange('');
      onFullNameChange('');
      onUsernameChange('');
      onEmailChange('');
    }

    // Update prev values
    prevFilters.current = { search, fullName, username, email };
  }, [search, fullName, username, email]);

  // Trigger filters when debounced values change (only if not already handled by reset)
  useEffect(() => {
    // Only trigger if the debounced value actually differs from current prop
    // This prevents double-calling after reset
    if (debouncedSearch !== search) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (debouncedFullName !== fullName) {
      onFullNameChange(debouncedFullName);
    }
  }, [debouncedFullName]);

  useEffect(() => {
    if (debouncedUsername !== username) {
      onUsernameChange(debouncedUsername);
    }
  }, [debouncedUsername]);

  useEffect(() => {
    if (debouncedEmail !== email) {
      onEmailChange(debouncedEmail);
    }
  }, [debouncedEmail]);

  return (
    <div className="border-t border-[#ebeded] bg-white mt-4">
      <div className="flex flex-col gap-4 pt-4">
        {/* Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TextField
            placeholder="Search by Full Name"
            value={fullNameValue}
            onChange={(e) => setFullNameValue(e.target.value)}
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
            placeholder="Search by Email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
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
            placeholder="Search by Username"
            value={usernameValue}
            onChange={(e) => setUsernameValue(e.target.value)}
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
