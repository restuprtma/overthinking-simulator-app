import React, { useState, useMemo, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  Box,
  Typography,
  FormAutocomplete,
  Alert,
  TextField,
  Checkbox,
  Tabs,
  Tab,
} from '@venturo/react-ui';
import { IconSearch } from '@tabler/icons-react';
import type { PermissionTemplate } from '@/app/api/core/permission-template/type';
import type { ModuleGroup, Module } from '@/app/api/core/module/type';

interface ModuleTemplateSelectorProps {
  moduleGroups: ModuleGroup[];
  templates: PermissionTemplate[];
  disabled?: boolean;
  isLoadingModules?: boolean;
  isLoadingTemplates?: boolean;
}

export const ModuleTemplateSelector: React.FC<ModuleTemplateSelectorProps> = ({
  moduleGroups,
  templates,
  disabled = false,
  isLoadingModules = false,
  isLoadingTemplates = false,
}) => {
  const { control, watch, setValue, clearErrors, trigger } = useFormContext<{
    module_templates: Record<string, string>;
  }>();

  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(
    moduleGroups.length > 0 ? moduleGroups[0].module.id : null,
  );
  const [searchFilter, setSearchFilter] = useState('');

  const moduleTemplates = watch('module_templates') || {};

  // Update selected module when moduleGroups changes
  useEffect(() => {
    if (moduleGroups.length > 0 && !selectedModuleId) {
      setSelectedModuleId(moduleGroups[0].module.id);
    }
  }, [moduleGroups, selectedModuleId]);

  // Helper function to recursively build hierarchical sub-modules
  const buildHierarchicalSubModules = (
    modules: Module[],
    parentId: string | null,
    depth: number,
  ): Module[] => {
    const children = modules
      .filter((m) => m.parent_id === parentId)
      .sort((a, b) => a.sort_order - b.sort_order);

    const result: Module[] = [];
    for (const child of children) {
      result.push(child);
      // Recursively get children of this child
      const grandChildren = buildHierarchicalSubModules(modules, child.id, depth + 1);
      result.push(...grandChildren);
    }

    return result;
  };

  // Get sub-modules for the selected parent module (hierarchically sorted)
  const filteredSubModules = useMemo(() => {
    if (!selectedModuleId) return [];

    const selectedGroup = moduleGroups.find((g) => g.module.id === selectedModuleId);
    if (!selectedGroup) return [];

    // Build hierarchical structure
    let hierarchical = buildHierarchicalSubModules(selectedGroup.sub_modules, selectedModuleId, 1);

    // Apply search filter
    if (searchFilter.trim()) {
      hierarchical = hierarchical.filter(
        (sm) =>
          sm.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
          sm.code.toLowerCase().includes(searchFilter.toLowerCase()),
      );
    }

    return hierarchical;
  }, [selectedModuleId, moduleGroups, searchFilter]);

  // Handler to toggle checkbox
  const handleToggleModule = (moduleId: string, checked: boolean) => {
    if (checked) {
      // Add module with empty template
      setValue(`module_templates.${moduleId}`, '', {
        shouldValidate: false,
        shouldDirty: true,
      });
    } else {
      // Remove module
      const newTemplates = { ...moduleTemplates };
      delete newTemplates[moduleId];

      // Clear errors for this module field
      clearErrors(`module_templates.${moduleId}`);

      // Update the value without validation
      setValue('module_templates', newTemplates, {
        shouldValidate: false,
        shouldDirty: true,
      });

      // Re-validate remaining fields
      queueMicrotask(() => {
        Object.keys(newTemplates).forEach((mod) => {
          trigger(`module_templates.${mod}`);
        });
      });
    }
  };

  // Check if a module is selected (checked)
  const isModuleSelected = (moduleId: string) => {
    return moduleId in moduleTemplates;
  };

  // Get templates grouped by module (if available)
  const getTemplatesForModule = () => {
    // For now, return all active templates
    // In future, backend might support filtering templates by module
    return templates.filter((t) => !t.deleted_at);
  };

  return (
    <Box>
      {/* <Typography
        variant="subtitle2"
        sx={{
          mb: 2,
          fontWeight: 700,
          fontSize: '0.9375rem',
          color: '#212529',
          letterSpacing: '0.3px',
        }}
      >
        Permission Templates by Module
      </Typography> */}

      {isLoadingModules || isLoadingTemplates ? (
        <Alert severity="info">Loading modules and templates...</Alert>
      ) : (
        <>
          {moduleGroups.length === 0 && !isLoadingModules ? (
            <Alert severity="warning">
              No modules available. Please ensure modules are configured in the system.
            </Alert>
          ) : (
            <>
              {/* Tabs for Parent Modules */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs
                  value={selectedModuleId || false}
                  onChange={(_, newValue) => setSelectedModuleId(newValue as string)}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {moduleGroups
                    .sort((a, b) => a.module.sort_order - b.module.sort_order)
                    .map((group) => (
                      <Tab
                        key={group.module.id}
                        label={group.module.name}
                        value={group.module.id}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                        }}
                      />
                    ))}
                </Tabs>
              </Box>

              {/* Search Filter */}
              {filteredSubModules.length > 0 && (
                <Box sx={{ mb: 2, maxWidth: 400, position: 'relative' }}>
                  <IconSearch
                    size={18}
                    style={{
                      position: 'absolute',
                      left: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#6c757d',
                      pointerEvents: 'none',
                      zIndex: 1,
                    }}
                  />
                  <TextField
                    size="small"
                    placeholder="Search sub-modules..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    disabled={disabled}
                    fullWidth
                    sx={{
                      '& .MuiInputBase-input': {
                        paddingLeft: '40px',
                      },
                    }}
                  />
                </Box>
              )}

              {/* Sub-Modules List */}
              {selectedModuleId && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {filteredSubModules.length > 0 ? (
                    filteredSubModules.map((subModule) => {
                      const isChecked = isModuleSelected(subModule.id);
                      const isChild = subModule.depth > 1;

                      return (
                        <Box
                          key={subModule.id}
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: isChecked ? '1fr 1fr' : 'auto 1fr',
                            gap: 2,
                            alignItems: 'center',
                            p: 1.5,
                            bgcolor: isChecked ? '#f8f9fa' : 'transparent',
                            border: '1px solid',
                            borderColor: isChecked ? '#dee2e6' : '#e9ecef',
                            borderRadius: '8px',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: '#f8f9fa',
                              borderColor: '#dee2e6',
                            },
                          }}
                        >
                          {/* Header: Checkbox + Module Info */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Checkbox
                              checked={isChecked}
                              onChange={(e) => handleToggleModule(subModule.id, e.target.checked)}
                              disabled={disabled}
                              sx={{ padding: '4px' }}
                            />

                            {/* Module Name with hierarchy indicators */}
                            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                              {/* Indentation indicator for child modules */}
                              {isChild && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: 'text.secondary',
                                    fontSize: 14,
                                  }}
                                >
                                  {'└─'}
                                </Box>
                              )}

                              {/* Module Name and Code */}
                              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: isChild ? 500 : 600,
                                      fontSize: '0.875rem',
                                      color: isChecked ? '#212529' : '#495057',
                                      cursor: disabled ? 'default' : 'pointer',
                                    }}
                                    onClick={() => {
                                      if (!disabled) {
                                        handleToggleModule(subModule.id, !isChecked);
                                      }
                                    }}
                                  >
                                    {subModule.name}
                                  </Typography>

                                  {/* Depth Level Badge */}
                                  {/* {isChild && (
                                    <Chip
                                      label={`L${subModule.depth}`}
                                      size="small"
                                      sx={{
                                        fontSize: 10,
                                        height: 18,
                                        bgcolor: 'primary.lighter',
                                        color: 'primary.main',
                                      }}
                                    />
                                  )} */}
                                </Box>
                              </Box>
                            </Box>
                          </Box>

                          {/* Template Selection (shown when checked) */}
                          {isChecked && (
                            <Controller
                              name={`module_templates.${subModule.id}` as const}
                              control={control}
                              rules={{
                                required: `Template for ${subModule.name} is required`,
                              }}
                              render={({ field }) => (
                                // <FormAutocomplete
                                //   {...field}
                                //   label="Permission Template"
                                //   fullWidth
                                //   disabled={disabled}
                                //   options={getTemplatesForModule().map((template) => ({
                                //     value: template.id,
                                //     label: `${template.name}${
                                //       template.is_system ? ' (System)' : ''
                                //     } - ${template.actions.join(', ')}`,
                                //   }))}
                                //   placeholder="Select permission template..."
                                // />
                                <FormAutocomplete
                                  {...field}
                                  label="Permission Template"
                                  fullWidth
                                  disabled={disabled}
                                  options={getTemplatesForModule().map((template) => ({
                                    value: template.id,
                                    label: `${template.name}`,
                                  }))}
                                  placeholder="Select permission template..."
                                />
                              )}
                            />
                          )}
                        </Box>
                      );
                    })
                  ) : (
                    <Alert severity="info">
                      {searchFilter.trim()
                        ? `No sub-modules found matching "${searchFilter}". Try a different search term.`
                        : 'No sub-modules available for this module.'}
                    </Alert>
                  )}
                </Box>
              )}
            </>
          )}
        </>
      )}

      <Typography
        variant="caption"
        sx={{
          display: 'block',
          mt: 2.5,
          color: '#6c757d',
          fontSize: '0.8125rem',
          lineHeight: 1.6,
          padding: '0.75rem 1rem',
          bgcolor: '#f8f9fa',
          borderLeft: '3px solid #0d6efd',
          borderRadius: '4px',
        }}
      >
        <strong style={{ color: '#495057' }}>Tip:</strong> Each sub-module can have one permission
        template assigned. Templates define which actions (create, read, update, delete, etc.) are
        allowed for that module. Sub-modules are indented based on their hierarchy level.
      </Typography>
    </Box>
  );
};
