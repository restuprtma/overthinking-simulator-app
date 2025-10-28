import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Card, TextField } from '@venturo/react-ui';
import { IconPlus, IconFilter, IconFilterOff, IconSearch } from '@tabler/icons-react';
import { DealsTable } from '../components/DealsTable';
import { DealsForm } from '../components/DealsForm';
import { DealsFilters } from '../components/DealsFilters';
import { DealDetailDialog } from '../components/DealDetailDialog';
import { useTableDeals } from '../hooks/useTableDeals';
import { useBoolean, useDebounce } from '@/shared/hooks';
import type { Deal } from '../types';

/**
 * DealsPage Component
 * Main page for deal management with CRUD operations
 */
const DealsPage: React.FC = () => {
  const {
    deals,
    meta,
    isLoading,
    isDeleting,
    error,
    search,
    status,
    source,
    salesPerson,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    handleStatusFilter,
    handleSourceFilter,
    handleSalesPersonFilter,
    handleDelete,
    handleReset,
  } = useTableDeals();

  // Dialog states
  const dealDialog = useBoolean();
  const filterDrawer = useBoolean();
  const detailDialog = useBoolean();
  const [dialogState, setDialogState] = useState<{
    mode: 'create' | 'edit';
    deal: Deal | null;
  }>({
    mode: 'create',
    deal: null,
  });
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

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
    setDialogState({ mode: 'create', deal: null });
    dealDialog.setTrue();
  };

  const handleEditClick = (deal: Deal) => {
    setDialogState({ mode: 'edit', deal });
    dealDialog.setTrue();
  };

  const handleViewClick = (deal: Deal) => {
    setSelectedDeal(deal);
    detailDialog.setTrue();
  };

  const handleDialogClose = () => {
    dealDialog.setFalse();
    // Reset state after dialog animation completes
    setTimeout(() => {
      setDialogState({ mode: 'create', deal: null });
    }, 300);
  };

  const handleDetailDialogClose = () => {
    detailDialog.setFalse();
    setTimeout(() => {
      setSelectedDeal(null);
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
            An error occurred while loading deals
          </Typography>
        </Card>
      )}

      <Card sx={{ flexShrink: 0 }}>
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div className="flex flex-col">
            <Typography variant="h6">Deals Management</Typography>
            <Typography
              variant="inherit"
              fontSize={12}
              color="textSecondary"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              Sales performance summary and closed deals
            </Typography>
          </div>
          <div className="flex flex-row items-center gap-2 flex-wrap">
            {/* Search TextField - with debounce, hidden when filter drawer is open */}
            {!filterDrawer.value && (
              <TextField
                placeholder="Search Deals"
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
              <span className="hidden sm:inline">Add Deal</span>
            </Button>
          </div>
        </div>

        {/* Collapsible Filters */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            filterDrawer.value ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <DealsFilters
            search={search}
            status={status}
            source={source}
            salesPerson={salesPerson}
            onSearchChange={handleSearch}
            onStatusChange={handleStatusFilter}
            onSourceChange={handleSourceFilter}
            onSalesPersonChange={handleSalesPersonFilter}
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
        {/* Deals Table with fixed header and scrollable body */}
        <DealsTable
          deals={deals}
          isLoading={isLoading}
          isDeleting={isDeleting}
          meta={meta}
          onView={handleViewClick}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onPageChange={handlePageChange}
          onLimitChange={handlePageSizeChange}
          canEdit={true}
          canDelete={true}
        />
      </Card>

      {/* Deal Dialog (Create/Edit) */}
      <DealsForm
        open={dealDialog.value}
        mode={dialogState.mode}
        deal={dialogState.deal}
        onClose={handleDialogClose}
        onSuccess={handleSuccess}
      />

      {/* Deal Detail Dialog */}
      <DealDetailDialog
        open={detailDialog.value}
        deal={selectedDeal}
        onClose={handleDetailDialogClose}
      />
    </Box>
  );
};

export default DealsPage;
