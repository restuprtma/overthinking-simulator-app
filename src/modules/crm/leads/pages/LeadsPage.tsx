import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Card, TextField } from '@venturo/react-ui';
import { IconPlus, IconFilter, IconFilterOff, IconSearch } from '@tabler/icons-react';
import { LeadsTable } from '../components/LeadsTable';
import { LeadsForm } from '../components/LeadsForm';
import { LeadsFilters } from '../components/LeadsFilters';
import { useTableLeads } from '../hooks/useTableLeads';
import { useBoolean, useDebounce } from '@/shared/hooks';
import type { Lead } from '../types';

/**
 * LeadsPage Component
 * Main page for lead management with CRUD operations
 */
const LeadsPage: React.FC = () => {
  const {
    leads,
    meta,
    isLoading,
    isDeleting,
    error,
    search,
    category,
    source,
    assignedTo,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    handleCategoryFilter,
    handleSourceFilter,
    handleAssignedToFilter,
    handleDelete,
    handleReset,
  } = useTableLeads();

  // Dialog states
  const leadDialog = useBoolean();
  const filterDrawer = useBoolean();
  const [dialogState, setDialogState] = useState<{
    mode: 'create' | 'edit';
    lead: Lead | null;
  }>({
    mode: 'create',
    lead: null,
  });

  // Local search state with debounce for header search
  const [headerSearchValue, setHeaderSearchValue] = useState(search);
  const debouncedHeaderSearch = useDebounce(headerSearchValue, 500);

  // Sync local search with global search state
  useEffect(() => {
    setHeaderSearchValue(search);
  }, [search]);

  // Trigger search when debounced value changes
  useEffect(() => {
    if (debouncedHeaderSearch !== search) {
      handleSearch(debouncedHeaderSearch);
    }
  }, [debouncedHeaderSearch]);

  // Reset header search value when filter drawer opens
  useEffect(() => {
    if (filterDrawer.value) {
      setHeaderSearchValue('');
      handleSearch(''); // Clear search immediately when drawer opens
    }
  }, [filterDrawer.value]);

  // Handlers
  const handleCreateClick = () => {
    setDialogState({ mode: 'create', lead: null });
    leadDialog.setTrue();
  };

  const handleEditClick = (lead: Lead) => {
    setDialogState({ mode: 'edit', lead });
    leadDialog.setTrue();
  };

  const handleDialogClose = () => {
    leadDialog.setFalse();
    // Reset state after dialog animation completes
    setTimeout(() => {
      setDialogState({ mode: 'create', lead: null });
    }, 300);
  };

  const handleSuccess = () => {
    // Table will auto-refresh via React Query cache invalidation (when API is integrated)
    handleDialogClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2, p: 3 }}>
      {/* Error Message */}
      {error && (
        <Card sx={{ p: 2, bgcolor: 'error.light' }}>
          <Typography color="error">
            An error occurred while loading leads
          </Typography>
        </Card>
      )}

      <Card sx={{ flexShrink: 0 }}>
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div className="flex flex-col">
            <Typography variant="h6">Lead Management</Typography>
            <Typography
              variant="inherit"
              fontSize={12}
              color="textSecondary"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              Manage and monitor leads with AI categorization
            </Typography>
          </div>
          <div className="flex flex-row items-center gap-2 flex-wrap">
            {/* Search TextField - with debounce, hidden when filter drawer is open */}
            {!filterDrawer.value && (
              <TextField
                placeholder="Search Leads"
                size="small"
                value={headerSearchValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeaderSearchValue(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: <IconSearch size={18} stroke={1.5} />,
                  },
                }}
                sx={{
                  minWidth: { xs: '100%', sm: 200, md: 250 },
                  flexGrow: { xs: 1, sm: 0 },
                }}
              />
            )}

            {/* Filter Button - changes to Reset Filters when drawer is open */}
            {!filterDrawer.value ? (
              <Button
                variant="outlined"
                color="grey"
                size="md"
                onClick={filterDrawer.setTrue}
                className="!min-w-0 !px-3"
              >
                <IconFilter size={16} />
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="error"
                size="md"
                onClick={() => {
                  filterDrawer.setFalse();
                  handleReset();
                }}
                className="flex items-center gap-2"
              >
                <IconFilterOff size={16} />
                <span className="hidden sm:inline">Reset Filters</span>
              </Button>
            )}

            <Button
              variant="solid"
              color="primary"
              size="md"
              onClick={handleCreateClick}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <IconPlus size={16} />
              <span className="hidden sm:inline">Add Lead</span>
            </Button>
          </div>
        </div>

        {/* Collapsible Filters */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            filterDrawer.value ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <LeadsFilters
            search={search}
            category={category}
            source={source}
            assignedTo={assignedTo}
            onSearchChange={handleSearch}
            onCategoryChange={handleCategoryFilter}
            onSourceChange={handleSourceFilter}
            onAssignedToChange={handleAssignedToFilter}
          />
        </div>
      </Card>

      <Card
        sx={{
          p: 0,
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        {/* Leads Table with fixed header and scrollable body */}
        <LeadsTable
          leads={leads}
          isLoading={isLoading}
          isDeleting={isDeleting}
          meta={meta}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onPageChange={handlePageChange}
          onLimitChange={handlePageSizeChange}
          canEdit={true}
          canDelete={true}
        />
      </Card>

      {/* Lead Dialog (Create/Edit) */}
      <LeadsForm
        open={leadDialog.value}
        mode={dialogState.mode}
        lead={dialogState.lead}
        onClose={handleDialogClose}
        onSuccess={handleSuccess}
      />
    </Box>
  );
};

export default LeadsPage;
