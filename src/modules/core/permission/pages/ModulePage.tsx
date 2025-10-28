import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Card, TextField, Tooltip } from '@venturo/react-ui';
import {
  IconPlus,
  IconFilter,
  IconFilterOff,
  IconSearch,
  IconArrowLeft,
} from '@tabler/icons-react';
import { ModuleTable } from '../components/ModuleTable';
import { ModuleForm } from '../components/ModuleForm';
import { ModuleFilters } from '../components/ModuleFilters';
import { ModulePermissionsModal } from '../components/ModulePermissionsModal';
import { useTableModule } from '../hooks/useTableModule';
import { useBoolean, usePermission, useDebounce, useDialogState } from '@/shared/hooks';
import { PERMISSIONS } from '@/app/constants/permission';
import { APP_CONFIG } from '@/app/constants/app';
import type { Module } from '@/app/api/core/module/type';
import { Link } from 'react-router';
import { ROUTES } from '@/app/constants';

/**
 * ModulePage Component
 * Main page for module management with CRUD operations
 */
const ModulePage: React.FC = () => {
  const {
    modules,
    isLoading,
    isDeleting,
    error,
    search,
    isActive,
    handleSearch,
    handleIsActiveFilter,
    handleDelete,
    handleRestore,
    handleReset,
  } = useTableModule();

  // Permission checks
  const { hasPermission } = usePermission();
  const canEdit = hasPermission(PERMISSIONS.PERMISSION_EDIT);
  const canDelete = hasPermission(PERMISSIONS.PERMISSION_DELETE);

  // Dialog states
  const moduleDialog = useBoolean();
  const filterDrawer = useBoolean();
  const permissionsModal = useBoolean();
  const { dialogState, openCreate, openEdit, reset: resetDialogState } = useDialogState<Module>();
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

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
    openCreate();
    moduleDialog.setTrue();
  };

  const handleEditClick = (module: Module) => {
    openEdit(module);
    moduleDialog.setTrue();
  };

  const handleDialogClose = () => {
    moduleDialog.setFalse();
    // Reset state after dialog animation completes
    setTimeout(() => {
      resetDialogState();
    }, APP_CONFIG.DIALOG_TRANSITION_DELAY);
  };

  const handleSuccess = () => {
    // Table will auto-refresh via React Query cache invalidation
    handleDialogClose();
  };

  const handleManagePermissions = (module: Module) => {
    setSelectedModule(module);
    permissionsModal.setTrue();
  };

  const handlePermissionsModalClose = () => {
    permissionsModal.setFalse();
    setTimeout(() => {
      setSelectedModule(null);
    }, APP_CONFIG.DIALOG_TRANSITION_DELAY);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2, p: 3 }}>
      {/* Error Message */}
      {error && (
        <Card sx={{ p: 2, bgcolor: 'error.light' }}>
          <Typography color="error">
            {error.message || 'An error occurred while loading modules'}
          </Typography>
        </Card>
      )}

      <Card sx={{ flexShrink: 0 }}>
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div className="flex flex-col">
            <Typography variant="h6">Permission & Module Management</Typography>
            <Typography
              variant="inherit"
              fontSize={12}
              color="textSecondary"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              Manage system modules for grouping permissions
            </Typography>
          </div>
          <div className="flex flex-row items-center gap-2 flex-wrap">
            {/* Search TextField - with debounce, hidden when filter drawer is open */}
            {!filterDrawer.value && (
              <TextField
                placeholder="Search Modules"
                size="small"
                value={headerSearchValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setHeaderSearchValue(e.target.value)
                }
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

            <Tooltip title="Back to Roles">
              <Link to={ROUTES.CORE.ROLES} style={{ textDecoration: 'none' }}>
                <Button
                  variant="outlined"
                  color="grey"
                  size="md"
                  className="flex items-center gap-2 !min-w-0 !px-3"
                >
                  <IconArrowLeft size={16} />
                </Button>
              </Link>
            </Tooltip>

            <Button
              variant="solid"
              color="primary"
              size="md"
              onClick={handleCreateClick}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <IconPlus size={16} />
              <span className="hidden sm:inline">Add Module</span>
            </Button>
          </div>
        </div>

        {/* Collapsible Filters */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            filterDrawer.value ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <ModuleFilters
            search={search}
            isActive={isActive}
            onSearchChange={handleSearch}
            onIsActiveChange={handleIsActiveFilter}
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
        {/* Modules Table with fixed header and scrollable body */}
        <ModuleTable
          modules={modules}
          isLoading={isLoading}
          isDeleting={isDeleting}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onRestore={handleRestore}
          onManagePermissions={handleManagePermissions}
          canEdit={canEdit}
          canDelete={canDelete}
          canManagePermissions={
            hasPermission(PERMISSIONS.PERMISSION_CREATE) ||
            hasPermission(PERMISSIONS.PERMISSION_EDIT)
          }
        />
      </Card>

      {/* Module Dialog (Create/Edit) */}
      <ModuleForm
        open={moduleDialog.value}
        mode={dialogState.mode}
        module={dialogState.item}
        onClose={handleDialogClose}
        onSuccess={handleSuccess}
      />

      {/* Module Permissions Modal */}
      <ModulePermissionsModal
        open={permissionsModal.value}
        module={selectedModule}
        onClose={handlePermissionsModalClose}
      />
    </Box>
  );
};

export default ModulePage;
