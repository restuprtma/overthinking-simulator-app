import { Box, Button, Select, MenuItem, FormControl, InputLabel, Typography, Drawer, Divider } from '@venturo/react-ui';
import { IconX, IconCheck } from '@tabler/icons-react';
import type { RoleWithPermissions } from '@/app/api/core/role/type';
import React from 'react';

interface UserFilterDrawerProps {
  open: boolean;
  roleId: string;
  isActive: boolean | undefined;
  roles: RoleWithPermissions[];
  isLoadingRoles: boolean;
  onClose: () => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: boolean | undefined) => void;
  onApply: () => void;
}

export const UserFilterDrawer: React.FC<UserFilterDrawerProps> = ({
  open,
  roleId,
  isActive,
  roles,
  isLoadingRoles,
  onClose,
  onRoleChange,
  onStatusChange,
  onApply,
}) => {
  const handleApply = () => {
    onApply();
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: 320 },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            Filter Users
          </Typography>
          <Button
            onClick={onClose}
            color="grey"
            size="sm"
            className="!min-w-0 !p-1"
          >
            <IconX size={20} />
          </Button>
        </Box>

        <Divider />

        {/* Filter Content */}
        <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Role Filter */}
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={roleId}
              onChange={(e) => onRoleChange(e.target.value as string)}
              label="Role"
              disabled={isLoadingRoles}
            >
              <MenuItem value="">
                <em>All Roles</em>
              </MenuItem>
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Status Filter */}
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={isActive === undefined ? '' : isActive ? 'true' : 'false'}
              onChange={(e) => {
                const value = e.target.value;
                onStatusChange(value === '' ? undefined : value === 'true');
              }}
              label="Status"
            >
              <MenuItem value="">
                <em>All Status</em>
              </MenuItem>
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider />

        {/* Footer Actions */}
        <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="grey"
            fullWidth
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            color="primary"
            fullWidth
            startIcon={<IconCheck size={18} />}
            onClick={handleApply}
          >
            Apply
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};
