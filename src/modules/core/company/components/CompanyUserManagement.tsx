import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  VenturoTable,
  Chip,
  Typography,
  Form,
  FormAutocomplete,
  FormSelect,
  useSnackbar,
  useAlertDialog,
} from '@venturo/react-ui';
import type { VenturoTableColumn, VenturoTableAction } from '@venturo/react-ui';
import { IconEdit, IconTrash, IconUserPlus } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import {
  useGetCompanyUsers,
  useAddUserToCompany,
  useUpdateCompanyUser,
  useRemoveUserFromCompany,
  type CompanyUser,
} from '@/app/api/core/company';
import { useGetListUsers } from '@/app/api/core/user';
import { useGetListRoles } from '@/app/api/core/role';
import type { ApiError } from '@/shared/types/api/type';
import { APP_CONFIG } from '@/app/constants/app';

interface CompanyUserManagementProps {
  open: boolean;
  companyId: string;
  companyName: string;
  onClose: () => void;
}

interface AddUserFormData {
  user_id: string;
  role_id: string | null;
}

interface UpdateUserFormData {
  role_id?: string | null;
  is_active?: '1' | '0';
}

export const CompanyUserManagement: React.FC<CompanyUserManagementProps> = ({
  open,
  companyId,
  companyName,
  onClose,
}) => {
  const snackbar = useSnackbar();
  const { showAlert } = useAlertDialog();

  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<CompanyUser | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Fetch company users
  const { data: companyUsersResponse, isLoading: isLoadingUsers } = useGetCompanyUsers(
    companyId,
    { page, page_size: limit },
    { enabled: !!companyId && open },
  );

  // Fetch all users for the add user dropdown
  const { data: allUsersResponse, isLoading: isLoadingAllUsers } = useGetListUsers(
    { page: 1, page_size: 100 },
    { enabled: addUserDialogOpen },
  );

  // Fetch all roles for the role dropdown
  const { data: allRolesResponse, isLoading: isLoadingRoles } = useGetListRoles(
    { page: 1, page_size: 100 },
    { enabled: addUserDialogOpen || editUserDialogOpen },
  );

  // Mutations
  const addUserMutation = useAddUserToCompany();
  const updateUserMutation = useUpdateCompanyUser();
  const removeUserMutation = useRemoveUserFromCompany();

  // Forms
  const addUserForm = useForm<AddUserFormData>({
    defaultValues: {
      user_id: '',
      role_id: null, // null = inherit global role
    },
  });

  const editUserForm = useForm<UpdateUserFormData>();

  const companyUsers = companyUsersResponse?.data?.data || [];
  const meta = companyUsersResponse?.data?.meta?.pagination;
  const allUsers = allUsersResponse?.data?.data || [];
  const allRoles = allRolesResponse?.data?.data || [];

  // Get users that are not already in the company
  const existingUserIds = companyUsers.map((cu) => cu.user_id);
  const availableUsers = allUsers.filter((user) => !existingUserIds.includes(user.id));

  // Role options from API + special option for global role inheritance
  const roleOptions = [
    { value: '', label: 'Inherit Global Role (Recommended)' },
    ...allRoles.map((role: { id: string; name: string }) => ({
      value: role.id,
      label: role.name,
    })),
  ];

  // Columns
  const columns: VenturoTableColumn<CompanyUser>[] = [
    {
      id: 'user_info',
      header: 'User',
      render: (companyUser) => (
        <div className="flex flex-col">
          <Typography variant="body2" fontWeight={500}>
            {companyUser.user_full_name || 'N/A'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {companyUser.user_email || 'No email'}
          </Typography>
          {companyUser.user_username && (
            <Typography variant="caption" color="textSecondary">
              @{companyUser.user_username}
            </Typography>
          )}
        </div>
      ),
    },
    {
      id: 'role',
      header: 'Role',
      render: (companyUser) => {
        // Find role name from allRoles if role_id exists
        const roleName = companyUser.role_id
          ? allRoles.find((r: { id: string; name: string }) => r.id === companyUser.role_id)
              ?.name || 'Unknown Role'
          : 'Global Role';

        return (
          <div className="flex flex-col">
            <Chip
              label={roleName}
              color={companyUser.is_primary ? 'primary' : 'default'}
              size="small"
            />
          </div>
        );
      },
    },
    {
      id: 'is_primary',
      header: 'Primary',
      render: (companyUser) =>
        companyUser.is_primary ? (
          <Chip label="Primary Owner" color="primary" size="small" variant="outlined" />
        ) : (
          <Typography variant="caption" color="textSecondary">
            -
          </Typography>
        ),
    },
    {
      id: 'status',
      header: 'Status',
      render: (companyUser) => (
        <Chip
          label={companyUser.is_active ? 'Active' : 'Inactive'}
          color={companyUser.is_active ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      id: 'joined_at',
      header: 'Joined At',
      render: (companyUser) => (
        <Typography variant="body2" color="textSecondary">
          {new Date(companyUser.joined_at).toLocaleString(APP_CONFIG.DEFAULT_LOCALE, {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </Typography>
      ),
    },
  ];

  // Actions
  const getActions = (companyUser: CompanyUser): VenturoTableAction<CompanyUser>[] => {
    const actions: VenturoTableAction<CompanyUser>[] = [];

    // Cannot edit/delete primary owner
    if (!companyUser.is_primary) {
      actions.push({
        icon: <IconEdit size={18} />,
        onClick: () => handleEditUser(companyUser),
        color: 'inherit',
      });

      actions.push({
        icon: <IconTrash size={18} />,
        onClick: () => handleRemoveUser(companyUser),
        color: 'inherit',
      });
    }

    return actions;
  };

  // Handlers
  const handleEditUser = (companyUser: CompanyUser) => {
    setSelectedUser(companyUser);
    editUserForm.reset({
      role_id: companyUser.role_id || '',
      is_active: companyUser.is_active ? '1' : '0',
    });
    setEditUserDialogOpen(true);
  };

  const handleRemoveUser = (companyUser: CompanyUser) => {
    showAlert({
      title: 'Remove User',
      message: `Are you sure you want to remove this user from ${companyName}?`,
      confirmText: 'Remove',
      onConfirm: async () => {
        await removeUserMutation.mutateAsync({
          companyId,
          userId: companyUser.user_id,
        });
      },
      onSuccess: () => {
        snackbar.success('User removed successfully');
      },
      onError: (err: any) => {
        const errorMessage = err?.response?.data?.message || 'Failed to remove user';
        snackbar.error(errorMessage);
      },
    });
  };

  // UUID validation helper
  const isValidUUID = (uuid: string | null): boolean => {
    if (!uuid) return true; // null is valid (inherit global role)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  const onAddUserSubmit = async (data: AddUserFormData) => {
    try {
      // Validate UUID if role_id is provided
      const roleIdValue = data.role_id === '' ? null : data.role_id;

      if (roleIdValue && !isValidUUID(roleIdValue)) {
        snackbar.error('Invalid role ID format. Please select a valid role.');
        return;
      }

      await addUserMutation.mutateAsync({
        companyId,
        data: {
          user_id: data.user_id,
          role_id: roleIdValue,
        },
      });
      snackbar.success('User added successfully');
      setAddUserDialogOpen(false);
      addUserForm.reset();
    } catch (err) {
      const apiError = err as ApiError;
      // Improved error handling
      const errorMessage = apiError?.response?.data?.message || apiError?.message || 'Failed to add user';

      if (errorMessage.includes('invalid role_id')) {
        snackbar.error('Invalid role ID. Please select a valid role.');
      } else if (errorMessage.includes('already in company')) {
        snackbar.error('This user is already a member of this company.');
      } else if (errorMessage.includes('Maximum users limit')) {
        snackbar.error('Cannot add user: Maximum users limit reached for this company.');
      } else {
        snackbar.error(errorMessage);
      }
    }
  };

  const onEditUserSubmit = async (data: UpdateUserFormData) => {
    if (!selectedUser) return;

    try {
      // Handle empty string conversion to null (as per OpenAPI spec)
      const roleIdValue = data.role_id === '' ? null : data.role_id;

      // Validate UUID if role_id is provided and not null
      if (roleIdValue && !isValidUUID(roleIdValue)) {
        snackbar.error('Invalid role ID format. Please select a valid role.');
        return;
      }

      await updateUserMutation.mutateAsync({
        companyId,
        userId: selectedUser.user_id,
        data: {
          role_id: roleIdValue,
          is_active: data.is_active === '1',
        },
      });
      snackbar.success('User role updated successfully');
      setEditUserDialogOpen(false);
      setSelectedUser(null);
      editUserForm.reset();
    } catch (err) {
      const apiError = err as ApiError;
      // Improved error handling
      const errorMessage = apiError?.response?.data?.message || apiError?.message || 'Failed to update user';

      if (errorMessage.includes('invalid role_id')) {
        snackbar.error('Invalid role ID. Please select a valid role.');
      } else if (errorMessage.includes('primary owner')) {
        snackbar.error('Cannot modify the primary owner of the company.');
      } else {
        snackbar.error(errorMessage);
      }
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogTitle onClose={onClose}>Manage Users - {companyName}</DialogTitle>

        <DialogContent sx={{ padding: '0px' }}>
          <VenturoTable
            columns={columns}
            data={companyUsers}
            loading={isLoadingUsers}
            pagination={meta}
            onPageChange={setPage}
            onLimitChange={setLimit}
            actions={getActions}
            emptyState={{
              title: 'No users found',
              description: 'Add users to this company to get started.',
            }}
            getRowKey={(companyUser) => companyUser.id}
          />
        </DialogContent>

        <DialogActions>
          <Button
            variant="solid"
            color="primary"
            startIcon={<IconUserPlus size={18} />}
            onClick={() => setAddUserDialogOpen(true)}
          >
            Add User
          </Button>
          <Button onClick={onClose} color="grey">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog
        open={addUserDialogOpen}
        onClose={() => setAddUserDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle onClose={() => setAddUserDialogOpen(false)}>Add User to Company</DialogTitle>

        <DialogContent>
          <Form form={addUserForm} onSubmit={onAddUserSubmit}>
            <div className="flex flex-col gap-4 pt-4">
              <FormAutocomplete
                name="user_id"
                label="Select User"
                placeholder="Choose a user"
                fullWidth
                required
                disabled={addUserMutation.isPending || isLoadingAllUsers}
                options={availableUsers.map((user) => ({
                  value: user.id,
                  label: `${user.full_name} (${user.email})`,
                }))}
                rules={{
                  required: 'User is required',
                }}
              />

              <FormSelect
                name="role_id"
                label="Role"
                fullWidth
                disabled={addUserMutation.isPending || isLoadingRoles}
                options={roleOptions}
              />
            </div>
          </Form>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setAddUserDialogOpen(false)}
            color="grey"
            disabled={addUserMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="solid"
            color="primary"
            disabled={addUserMutation.isPending}
            onClick={addUserForm.handleSubmit(onAddUserSubmit)}
          >
            {addUserMutation.isPending ? 'Adding...' : 'Add User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog
        open={editUserDialogOpen}
        onClose={() => setEditUserDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle onClose={() => setEditUserDialogOpen(false)}>Edit User Role</DialogTitle>

        <DialogContent>
          <Form form={editUserForm} onSubmit={onEditUserSubmit}>
            <div className="flex flex-col gap-4 pt-4">
              <FormSelect
                name="role_id"
                label="Role"
                fullWidth
                disabled={updateUserMutation.isPending || isLoadingRoles}
                options={roleOptions}
              />

              <FormSelect
                name="is_active"
                label="Status"
                fullWidth
                disabled={updateUserMutation.isPending}
                options={[
                  { value: '1', label: 'Active' },
                  { value: '0', label: 'Inactive' },
                ]}
              />
            </div>
          </Form>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setEditUserDialogOpen(false)}
            color="grey"
            disabled={updateUserMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="solid"
            color="primary"
            disabled={updateUserMutation.isPending}
            onClick={editUserForm.handleSubmit(onEditUserSubmit)}
          >
            {updateUserMutation.isPending ? 'Updating...' : 'Update User'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
