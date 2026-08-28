// ----------------------------------------------------------------------
// Centralized permission keys ("<resource>:<action>")
//
// Source: BE expansion of role level → actions
//   viewer  → read
//   editor  → read, create, update, delete
//   admin   → read, create, update, delete, export, import, restore
//   workflow resources also expose `:approve` (used for both Approve & Reject)
//
// Use these constants instead of inlining string literals in components,
// so renames are localized to this file.
// ----------------------------------------------------------------------

export const PERM = {
  // ---------- Core ----------
  roles: {
    read: 'roles:read',
    create: 'roles:create',
    update: 'roles:update',
    delete: 'roles:delete',
  },
  userManagement: {
    read: 'user-management:read',
    create: 'user-management:create',
    update: 'user-management:update',
    delete: 'user-management:delete',
  },
} as const;

