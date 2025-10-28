import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Box, Button, Typography, Card, TextField, Tooltip } from '@venturo/react-ui';
import {
  IconPlus,
  IconFilter,
  IconFilterOff,
  IconSearch,
  IconArrowLeft,
} from '@tabler/icons-react';
import { PermissionTemplateTable } from '../components/PermissionTemplateTable';
import { PermissionTemplateForm } from '../components/PermissionTemplateForm';
import { PermissionTemplateFilters } from '../components/PermissionTemplateFilters';
import { useTablePermissionTemplate } from '../hooks/useTablePermissionTemplate';
import { useBoolean, usePermission, useDebounce, useDialogState } from '@/shared/hooks';
import { PERMISSIONS } from '@/app/constants/permission';
import { ROUTES } from '@/app/constants/router';
import { APP_CONFIG } from '@/app/constants/app';
import type { PermissionTemplate } from '@/app/api/core/permission-template/type';

/**
 * PermissionTemplatePage Component
 * Main page for permission template management with CRUD operations
 */
const PermissionTemplatePage: React.FC = () => {
  const {
    permissionTemplates,
    meta,
    isLoading,
    isDeleting,
    error,
    search,
    includeSystem,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    handleIncludeSystemFilter,
    handleDelete,
    handleReset,
  } = useTablePermissionTemplate();

  // Permission checks
  const { hasPermission } = usePermission();
  const canEdit = hasPermission(PERMISSIONS.PERMISSION_EDIT);
  const canDelete = hasPermission(PERMISSIONS.PERMISSION_DELETE);

  // Dialog states
  const templateDialog = useBoolean();
  const filterDrawer = useBoolean();
  const { dialogState, openCreate, openEdit, reset: resetDialogState } = useDialogState<PermissionTemplate>();

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
    templateDialog.setTrue();
  };

  const handleEditClick = (template: PermissionTemplate) => {
    openEdit(template);
    templateDialog.setTrue();
  };

  const handleDialogClose = () => {
    templateDialog.setFalse();
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
            {error.message || 'An error occurred while loading permission templates'}
          </Typography>
        </Card>
      )}

      <Card sx={{ flexShrink: 0 }}>
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div className="flex flex-col">
            <Typography variant="h6">Permission Template Management</Typography>
            <Typography
              variant="inherit"
              fontSize={12}
              color="textSecondary"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              Manage permission templates and action sets
            </Typography>
          </div>
          <div className="flex flex-row items-center gap-2 flex-wrap">
            {/* Search TextField - with debounce, hidden when filter drawer is open */}
            {!filterDrawer.value && (
              <TextField
                placeholder="Search Templates"
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
              <Link to={ROUTES.ROLES} style={{ textDecoration: 'none' }}>
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
              <span className="hidden sm:inline">Add Template</span>
            </Button>
          </div>
        </div>

        {/* Collapsible Filters */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            filterDrawer.value ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <PermissionTemplateFilters
            includeSystem={includeSystem}
            onIncludeSystemChange={handleIncludeSystemFilter}
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
        {/* Permission Templates Table with fixed header and scrollable body */}
        <PermissionTemplateTable
          permissionTemplates={permissionTemplates}
          isLoading={isLoading}
          isDeleting={isDeleting}
          meta={meta}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onPageChange={handlePageChange}
          onLimitChange={handlePageSizeChange}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      </Card>

      {/* Permission Template Dialog (Create/Edit) */}
      <PermissionTemplateForm
        open={templateDialog.value}
        mode={dialogState.mode}
        template={dialogState.item}
        onClose={handleDialogClose}
        onSuccess={handleSuccess}
      />
    </Box>
  );
};

export default PermissionTemplatePage;
