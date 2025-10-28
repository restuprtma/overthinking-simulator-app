import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Form,
  FormTextField,
  FormAutocomplete,
  Box,
  Checkbox,
  FormControlLabel,
  Tabs,
  Tab,
} from '@venturo/react-ui';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from '@venturo/react-ui';
import {
  usePostModules,
  usePutModules,
  useGetListModules,
} from '@/app/api/core/module/useModuleApi';
import type { Module, CreateModuleData, UpdateModuleData } from '@/app/api/core/module/type';
import type { ApiError } from '@/shared/types/api/type';

interface ModuleFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  module?: Module | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface ModuleFormData {
  code: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  sort_order: number;
  is_active: boolean;
  parent_id?: string | null;
  heading?: string | null;
  to?: string | null;
  url?: string | null;
  permission?: string | null;
  tooltip?: string | null;
  is_menu_visible: boolean;
}

export const ModuleForm: React.FC<ModuleFormProps> = ({
  open,
  mode,
  module,
  onClose,
  onSuccess,
}) => {
  const { success, error } = useSnackbar();
  const [activeTab, setActiveTab] = useState(0);

  // Fetch all modules for parent selection
  const { data: modulesData } = useGetListModules({ is_active: true });
  const allModules = modulesData?.data?.data || [];

  const form = useForm<ModuleFormData>({
    defaultValues: {
      code: module?.code || '',
      name: module?.name || '',
      description: module?.description || '',
      icon: module?.icon || '',
      color: module?.color || '#3B82F6',
      sort_order: module?.sort_order || 0,
      is_active: module?.is_active ?? true,
      parent_id: module?.parent_id || null,
      heading: module?.heading || '',
      to: module?.to || '',
      url: module?.url || '',
      permission: module?.permission || '',
      tooltip: module?.tooltip || '',
      is_menu_visible: module?.is_menu_visible ?? true,
    },
  });

  const createMutation = usePostModules();
  const updateMutation = usePutModules();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  React.useEffect(() => {
    if (open && module && mode === 'edit') {
      form.reset({
        code: module.code,
        name: module.name,
        description: module.description || '',
        icon: module.icon || '',
        color: module.color || '#3B82F6',
        sort_order: module.sort_order,
        is_active: module.is_active,
        parent_id: module.parent_id || null,
        heading: module.heading || '',
        to: module.to || '',
        url: module.url || '',
        permission: module.permission || '',
        tooltip: module.tooltip || '',
        is_menu_visible: module.is_menu_visible,
      });
    } else if (open && mode === 'create') {
      form.reset({
        code: '',
        name: '',
        description: '',
        icon: '',
        color: '#3B82F6',
        sort_order: 0,
        is_active: true,
        parent_id: null,
        heading: '',
        to: '',
        url: '',
        permission: '',
        tooltip: '',
        is_menu_visible: true,
      });
    }
  }, [open, module, mode, form]);

  const onSubmit = async (data: ModuleFormData) => {
    try {
      // Extract parent_id from value if it's an object
      const parentId = typeof data.parent_id === 'string' ? data.parent_id : null;

      // Validate circular dependency
      if (parentId && mode === 'edit' && module) {
        if (parentId === module.id) {
          error('A module cannot be its own parent');
          return;
        }
        // Check if parent is a descendant (would create circular reference)
        const isDescendant = (checkParentId: string): boolean => {
          const parent = allModules.find((m) => m.id === checkParentId);
          if (!parent) return false;
          if (parent.parent_id === module.id) return true;
          if (parent.parent_id) return isDescendant(parent.parent_id);
          return false;
        };
        if (isDescendant(parentId)) {
          error('Cannot set parent to a descendant module (circular reference detected)');
          return;
        }
      }

      if (mode === 'create') {
        const createData: CreateModuleData = {
          code: data.code,
          name: data.name,
          description: data.description || undefined,
          icon: data.icon || undefined,
          color: data.color || undefined,
          sort_order: data.sort_order,
          is_active: data.is_active,
          parent_id: parentId || undefined,
          heading: data.heading || undefined,
          to: data.to || undefined,
          url: data.url || undefined,
          permission: data.permission || undefined,
          tooltip: data.tooltip || undefined,
          is_menu_visible: data.is_menu_visible,
        };
        await createMutation.mutateAsync(createData);
        success('Module created successfully!');
      } else if (mode === 'edit' && module) {
        const updateData: UpdateModuleData = {
          code: data.code,
          name: data.name,
          description: data.description || undefined,
          icon: data.icon || undefined,
          color: data.color || undefined,
          sort_order: data.sort_order,
          is_active: data.is_active,
          parent_id: parentId || undefined,
          heading: data.heading || undefined,
          to: data.to || undefined,
          url: data.url || undefined,
          permission: data.permission || undefined,
          tooltip: data.tooltip || undefined,
          is_menu_visible: data.is_menu_visible,
        };
        await updateMutation.mutateAsync({ id: module.id, data: updateData });
        success('Module updated successfully!');
      }
      onSuccess();
      handleClose();
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage =
        apiError?.response?.data?.message || apiError?.message || 'An error occurred';
      error(errorMessage);
    }
  };

  const handleClose = () => {
    form.reset();
    setActiveTab(0);
    onClose();
  };

  // Filter out current module from parent options (prevent self-reference)
  const parentModuleOptions = allModules
    .filter((m) => m.id !== module?.id)
    .map((m) => ({
      value: m.id,
      label: `${m.name} (${m.code})`,
      data: m,
    }));

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle onClose={handleClose}>
        {mode === 'create' ? 'Create New Module' : 'Edit Module'}
      </DialogTitle>

      <DialogContent>
        <Form form={form} onSubmit={onSubmit}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
              <Tab label="Basic Info" />
              <Tab label="Hierarchy & Navigation" />
              <Tab label="Display Settings" />
            </Tabs>
          </Box>

          {/* Tab 1: Basic Info */}
          {activeTab === 0 && (
            <div className="flex flex-col gap-4">
              <FormTextField
                name="code"
                label="Module Code"
                placeholder="e.g., hr, crm.leads, finance.invoices"
                fullWidth
                required
                disabled={isSubmitting}
                rules={{
                  required: 'Module code is required',
                  minLength: {
                    value: 2,
                    message: 'Module code must be at least 2 characters',
                  },
                  maxLength: {
                    value: 50,
                    message: 'Module code must not exceed 50 characters',
                  },
                  pattern: {
                    value: /^[a-z0-9._-]+$/,
                    message:
                      'Module code must be lowercase letters, numbers, dots, hyphens, or underscores only',
                  },
                }}
              />

              <FormTextField
                name="name"
                label="Module Name"
                placeholder="e.g., Human Resources, Leads, Invoices"
                fullWidth
                required
                disabled={isSubmitting}
                rules={{
                  required: 'Module name is required',
                  minLength: {
                    value: 2,
                    message: 'Module name must be at least 2 characters',
                  },
                  maxLength: {
                    value: 100,
                    message: 'Module name must not exceed 100 characters',
                  },
                }}
              />

              <FormTextField
                name="description"
                label="Description"
                placeholder="Enter module description"
                fullWidth
                multiline
                rows={3}
                disabled={isSubmitting}
                rules={{
                  maxLength: {
                    value: 500,
                    message: 'Description must not exceed 500 characters',
                  },
                }}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <FormTextField
                  name="icon"
                  label="Icon Name"
                  placeholder="e.g., shield, users, briefcase"
                  fullWidth
                  disabled={isSubmitting}
                  rules={{
                    maxLength: {
                      value: 50,
                      message: 'Icon name must not exceed 50 characters',
                    },
                  }}
                />

                <FormTextField
                  name="color"
                  label="Color (Hex)"
                  placeholder="#3B82F6"
                  fullWidth
                  disabled={isSubmitting}
                  rules={{
                    pattern: {
                      value: /^#[0-9A-Fa-f]{6}$/,
                      message: 'Color must be a valid hex code (e.g., #3B82F6)',
                    },
                  }}
                />
              </Box>
            </div>
          )}

          {/* Tab 2: Hierarchy & Navigation */}
          {activeTab === 1 && (
            <div className="flex flex-col gap-4">
              <FormAutocomplete<ModuleFormData>
                name="parent_id"
                label="Parent Module"
                placeholder="Select parent module (leave empty for root)"
                options={parentModuleOptions}
                disabled={isSubmitting}
                fullWidth
                helperText="Select a parent module to create a hierarchical structure"
              />

              <FormTextField
                name="heading"
                label="Menu Heading"
                placeholder="e.g., Customer Relationship, Core System"
                fullWidth
                disabled={isSubmitting}
                rules={{
                  maxLength: {
                    value: 500,
                    message: 'Heading must not exceed 500 characters',
                  },
                }}
                helperText="Display heading for menu group (usually for root modules)"
              />

              <FormTextField
                name="to"
                label="Route Path"
                placeholder="e.g., /crm, /crm/leads"
                fullWidth
                disabled={isSubmitting}
                rules={{
                  maxLength: {
                    value: 255,
                    message: 'Route path must not exceed 255 characters',
                  },
                  pattern: {
                    value: /^\/[a-z0-9\-_/]*$/,
                    message:
                      'Route path must start with / and contain only lowercase letters, numbers, hyphens, underscores, or slashes',
                  },
                }}
                helperText="Internal route path for frontend navigation"
              />

              <FormTextField
                name="url"
                label="External URL"
                placeholder="e.g., https://example.com/resource"
                fullWidth
                disabled={isSubmitting}
                rules={{
                  maxLength: {
                    value: 255,
                    message: 'URL must not exceed 255 characters',
                  },
                }}
                helperText="External URL (optional, alternative to route path)"
              />

              <FormTextField
                name="permission"
                label="Permission Code"
                placeholder="e.g., crm, crm.leads, finance.invoices"
                fullWidth
                disabled={isSubmitting}
                rules={{
                  maxLength: {
                    value: 100,
                    message: 'Permission code must not exceed 100 characters',
                  },
                  pattern: {
                    value: /^[a-z0-9._-]*$/,
                    message:
                      'Permission code must be lowercase letters, numbers, dots, hyphens, or underscores only',
                  },
                }}
                helperText="Permission required to access this module"
              />
            </div>
          )}

          {/* Tab 3: Display Settings */}
          {activeTab === 2 && (
            <div className="flex flex-col gap-4">
              <FormTextField
                name="tooltip"
                label="Tooltip Text"
                placeholder="e.g., Customer Relationship Management"
                fullWidth
                disabled={isSubmitting}
                rules={{
                  maxLength: {
                    value: 255,
                    message: 'Tooltip must not exceed 255 characters',
                  },
                }}
                helperText="Tooltip shown on hover in the UI"
              />

              <FormTextField
                name="sort_order"
                label="Sort Order"
                placeholder="0"
                type="number"
                fullWidth
                disabled={isSubmitting}
                rules={{
                  min: {
                    value: 0,
                    message: 'Sort order must be 0 or greater',
                  },
                }}
                helperText="Order of display within the same level"
              />

              <Controller
                name="is_menu_visible"
                control={form.control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        disabled={isSubmitting}
                      />
                    }
                    label="Visible in Menu"
                  />
                )}
              />

              <Controller
                name="is_active"
                control={form.control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        disabled={isSubmitting}
                      />
                    }
                    label="Active Status"
                  />
                )}
              />
            </div>
          )}
        </Form>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="grey" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="solid"
          color="primary"
          disabled={isSubmitting}
          onClick={form.handleSubmit(onSubmit)}
        >
          {isSubmitting
            ? mode === 'create'
              ? 'Creating...'
              : 'Updating...'
            : mode === 'create'
            ? 'Create Module'
            : 'Update Module'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
