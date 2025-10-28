import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Stack,
  Typography,
  TextField,
  CircularProgress,
} from '@venturo/react-ui';
import { IconBuilding, IconCheck, IconSearch } from '@tabler/icons-react';
import { useGetUserCompanies, type CompanyBasic } from '@/app/api/core/auth';

interface CompanySelectorProps {
  open: boolean;
  currentCompanyId?: string | null;
  onClose: () => void;
  onSelectCompany: (company: CompanyBasic) => void;
}

export const CompanySelector: React.FC<CompanySelectorProps> = ({
  open,
  currentCompanyId,
  onClose,
  onSelectCompany,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Fetch user companies (only companies user is member of)
  const {
    data: companiesResponse,
    isLoading,
    error,
  } = useGetUserCompanies({
    enabled: open,
  });

  const allCompanies = companiesResponse?.data?.data?.companies || [];

  // Client-side filtering for search
  const companies = useMemo(() => {
    if (!searchQuery) return allCompanies;

    const query = searchQuery.toLowerCase();
    return allCompanies.filter(
      (company) =>
        company.name.toLowerCase().includes(query) || company.code.toLowerCase().includes(query),
    );
  }, [allCompanies, searchQuery]);

  // Auto-focus to current company on open
  useEffect(() => {
    if (open && companies.length > 0) {
      const currentIndex = companies.findIndex((c) => c.id === currentCompanyId);
      if (currentIndex !== -1) {
        setSelectedIndex(currentIndex);
      } else {
        setSelectedIndex(0);
      }

      // Focus search input - important for keyboard navigation
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 200);
    }

    // Reset search when closing
    if (!open) {
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [open, companies, currentCompanyId]);

  // Scroll selected item into view
  useEffect(() => {
    if (open && listContainerRef.current) {
      const selectedElement = listContainerRef.current.querySelector(
        `[data-index="${selectedIndex}"]`,
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex, open]);

  const handleSelectCompany = (company: CompanyBasic) => {
    onSelectCompany(company);
    onClose();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setSelectedIndex(0); // Reset to first item when searching
  };

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!companies.length) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % companies.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + companies.length) % companies.length);
        break;
      case 'Enter':
        event.preventDefault();
        if (companies[selectedIndex]) {
          handleSelectCompany(companies[selectedIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        onClose();
        break;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth onKeyDown={handleKeyDown}>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1} paddingRight={1}>
            <IconBuilding size={24} />
            <Typography variant="h6">Select Company</Typography>
          </Stack>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            <kbd
              style={{
                padding: '2px 6px',
                background: '#f5f5f5',
                borderRadius: 3,
                border: '1px solid #ddd',
                fontSize: '11px',
                fontFamily: 'monospace',
              }}
            >
              {navigator.platform.toUpperCase().includes('MAC') ? '⌘ + K' : 'Ctrl+K'}
            </kbd>
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ mt: 3 }}>
        <Stack spacing={2}>
          {/* Search Bar */}
          <TextField
            ref={searchInputRef}
            fullWidth
            placeholder="Search companies..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <IconSearch size={20} style={{ marginRight: 8 }} />,
            }}
            autoComplete="off"
            autoFocus
          />

          {/* Company List */}
          <Box ref={listContainerRef} sx={{ minHeight: 300, maxHeight: 400, overflowY: 'auto' }}>
            {isLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight={200}
              >
                <IconBuilding size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                  Failed to load companies
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  The endpoint GET /auth/companies may not be implemented yet.
                </Typography>
              </Box>
            ) : companies.length === 0 ? (
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight={200}
              >
                <IconBuilding size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                <Typography variant="body2" color="textSecondary">
                  {searchQuery ? 'No companies found' : 'No companies available'}
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                  Please check if GET /auth/companies endpoint is implemented.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={1}>
                {companies.map((company, index) => (
                  <Box
                    key={company.id}
                    data-index={index}
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor:
                        selectedIndex === index
                          ? 'primary.main'
                          : currentCompanyId === company.id
                          ? 'primary.light'
                          : 'divider',
                      borderRadius: 1,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'action.selected',
                      },
                    }}
                    onClick={() => handleSelectCompany(company)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Stack spacing={0.5} flex={1}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {company.name}
                          </Typography>
                        </Stack>
                      </Stack>

                      {currentCompanyId === company.id && <IconCheck size={24} color="green" />}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>

          {/* Keyboard hints */}
          {companies.length > 0 && (
            <Box
              sx={{
                p: 1.5,
                backgroundColor: 'action.hover',
                borderRadius: 1,
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <kbd
                  style={{
                    padding: '4px 8px',
                    background: '#fff',
                    borderRadius: 4,
                    border: '1px solid #ddd',
                    fontFamily: 'monospace',
                  }}
                >
                  ↑
                </kbd>
                <kbd
                  style={{
                    padding: '4px 8px',
                    background: '#fff',
                    borderRadius: 4,
                    border: '1px solid #ddd',
                    fontFamily: 'monospace',
                  }}
                >
                  ↓
                </kbd>
                <span>to navigate</span>
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <kbd
                  style={{
                    padding: '4px 8px',
                    background: '#fff',
                    borderRadius: 4,
                    border: '1px solid #ddd',
                    fontFamily: 'monospace',
                  }}
                >
                  Enter
                </kbd>
                <span>to select</span>
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <kbd
                  style={{
                    padding: '4px 8px',
                    background: '#fff',
                    borderRadius: 4,
                    border: '1px solid #ddd',
                    fontFamily: 'monospace',
                  }}
                >
                  Esc
                </kbd>
                <span>to close</span>
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
