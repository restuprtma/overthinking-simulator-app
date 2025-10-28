import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Box, Button, Typography, Card, TextField, Tooltip } from '@venturo/react-ui';
import {
  IconPlus,
  IconFilter,
  IconFilterOff,
  IconSearch,
  IconFileText,
  IconShield,
} from '@tabler/icons-react';
import { RoleTable } from '../components/RoleTable';
import { RoleForm } from '../components/RoleForm';
import { RoleFilters } from '../components/RoleFilters';
import { useTableRole } from '../hooks/useTableRole';
import { useBoolean, usePermission, useDebounce, useDialogState } from '@/shared/hooks';
import { PERMISSIONS } from '@/app/constants/permission';
import { ROUTES } from '@/app/constants/router';
import { APP_CONFIG } from '@/app/constants/app';
import type { Role } from '@/app/api/core/role/type';

/**
 * RolePage Component
 * Main page for role management with CRUD operations
 */
const RolePage: React.FC = () => {
  const {
    roles,
    meta,
    isLoading,
    isDeleting,
    isRestoring,
    error,
    search,
    includeSystem,
    showDeleted,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    handleIncludeSystemFilter,
    handleDelete,
    handleRestore,
    handleReset,
  } = useTableRole();

  // Permission checks
  const { hasPermission } = usePermission();
  const canEdit = hasPermission(PERMISSIONS.ROLE_EDIT);
  const canDelete = hasPermission(PERMISSIONS.ROLE_DELETE);

  // Dialog states
  const roleDialog = useBoolean();
  const filterDrawer = useBoolean();
  const { dialogState, openCreate, openEdit, reset: resetDialogState } = useDialogState<Role>();

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
  }, [debouncedHeaderSearch, search, handleSearch]);

  // Reset header search value when filter drawer opens
  useEffect(() => {
    if (filterDrawer.value) {
      setHeaderSearchValue('');
      handleSearch('');
    }
  }, [filterDrawer.value, handleSearch]);

  // Handlers
  const handleCreateClick = () => {
    openCreate();
    roleDialog.setTrue();
  };

  const handleEditClick = (role: Role) => {
    openEdit(role);
    roleDialog.setTrue();
  };

  const handleDialogClose = () => {
    roleDialog.setFalse();
    // Reset state after dialog animation completes
    setTimeout(() => {
      resetDialogState();
    }, APP_CONFIG.DIALOG_TRANSITION_DELAY);
  };

  const handleSuccess = () => {
    // Table will auto-refresh via React Query cache invalidation
    handleDialogClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2, p: 3 }}>
      {/* Error Message */}
      {error && (
        <Card sx={{ p: 2, bgcolor: 'error.light' }}>
          <Typography color="error">
            {error.message || 'An error occurred while loading roles'}
          </Typography>
        </Card>
      )}

      <Card sx={{ flexShrink: 0 }}>
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div className="flex flex-col">
            <Typography variant="h6">Role Management</Typography>
            <Typography
              variant="inherit"
              fontSize={12}
              color="textSecondary"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              Manage roles and permissions for access control
            </Typography>
          </div>
          <div className="flex flex-row items-center gap-2 flex-wrap">
            {/* Search TextField - with debounce, hidden when filter drawer is open */}
            {!filterDrawer.value && (
              <TextField
                placeholder="Search Roles"
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
                color="primary"
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

            <Tooltip title="Permission Templates">
              <Link to={ROUTES.CORE.PERMISSION_TEMPLATES} style={{ textDecoration: 'none' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="md"
                  className="flex items-center gap-2 !min-w-0 !px-3"
                >
                  <IconFileText size={16} />
                </Button>
              </Link>
            </Tooltip>

            <Tooltip title="Permissions">
              <Link to={ROUTES.CORE.PERMISSIONS} style={{ textDecoration: 'none' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="md"
                  className="flex items-center gap-2 !min-w-0 !px-3"
                >
                  <IconShield size={16} />
                </Button>
              </Link>
            </Tooltip>

            {/* <Button
              variant="outlined"
              color={showDeleted ? 'primary' : 'grey'}
              size="md"
              onClick={handleToggleDeleted}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <IconTrash size={16} />
              <span className="hidden sm:inline">{showDeleted ? 'Show Active' : 'Show Deleted'}</span>
            </Button> */}

            {!showDeleted && (
              <Button
                variant="solid"
                color="primary"
                size="md"
                onClick={handleCreateClick}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <IconPlus size={16} />
                <span className="hidden sm:inline">Add Role</span>
              </Button>
            )}
          </div>
        </div>

        {/* Collapsible Filters */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            filterDrawer.value ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <RoleFilters
            search={search}
            includeSystem={includeSystem}
            onSearchChange={handleSearch}
            onIncludeSystemFilter={handleIncludeSystemFilter}
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
        {/* Roles Table with fixed header and scrollable body */}
        <RoleTable
          roles={roles}
          isLoading={isLoading}
          isDeleting={isDeleting}
          isRestoring={isRestoring}
          showDeleted={showDeleted}
          meta={meta}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onRestore={handleRestore}
          onPageChange={handlePageChange}
          onLimitChange={handlePageSizeChange}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      </Card>

      {/* Role Dialog (Create/Edit) */}
      <RoleForm
        open={roleDialog.value}
        mode={dialogState.mode}
        role={dialogState.item}
        onClose={handleDialogClose}
        onSuccess={handleSuccess}
      />
    </Box>
  );
};

export default RolePage;
