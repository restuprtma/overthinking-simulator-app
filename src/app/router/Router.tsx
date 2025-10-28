// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router';
import Loadable from '@/shared/components/layouts/full/shared/loadable/Loadable';
import { AuthGuard } from '@/app/guards/AuthGuard';
import { GuestGuard } from '@/app/guards/GuestGuard';
import { PermissionGuard } from '@/app/guards/PermissionGuard';
import { PERMISSIONS } from '@/app/constants/permission';
import { ROUTES } from '../constants';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('@/shared/components/layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('@/shared/components/layouts/blank/BlankLayout')));

/**
 * Module Pages - Hybrid Approach (Best Practice)
 *
 * Pattern: Import from @/modules/[domain]/[sub-feature]
 * - @/modules/core/auth   - Authentication pages (bundled together)
 * - @/modules/core/user   - User management (separate bundle)
 * - @/modules/core/role   - Role management (separate bundle)
 * - @/modules/common/errors - Error pages (separate bundle)
 *
 * Benefits:
 * ✅ Module boundaries enforced (can't bypass index.ts)
 * ✅ Balanced code splitting (by sub-feature, not per-page)
 * ✅ Reasonable chunk sizes (~50-150KB per sub-feature)
 * ✅ Easy refactoring within sub-features
 * ✅ Clear domain separation
 *
 * Bundle Strategy:
 * - Auth pages loaded together (user needs login -> likely needs register/forgot password)
 * - User/Role pages separate (accessed independently)
 * - Error pages separate (rarely accessed)
 */

// Core Module - Authentication (all auth pages in one chunk)
const Login = Loadable(
  lazy(() => import('@/modules/core/auth').then((m) => ({ default: m.LoginPage }))),
);
const Register = Loadable(
  lazy(() => import('@/modules/core/auth').then((m) => ({ default: m.RegisterPage }))),
);
const ForgotPassword = Loadable(
  lazy(() => import('@/modules/core/auth').then((m) => ({ default: m.ForgotPasswordPage }))),
);
const ResetPassword = Loadable(
  lazy(() => import('@/modules/core/auth').then((m) => ({ default: m.ResetPasswordPage }))),
);
const VerifyEmail = Loadable(
  lazy(() => import('@/modules/core/auth').then((m) => ({ default: m.VerifyEmailPage }))),
);
const TwoSteps = Loadable(
  lazy(() => import('@/modules/core/auth').then((m) => ({ default: m.TwoStepsPage }))),
);
const Maintainance = Loadable(
  lazy(() => import('@/modules/core/auth').then((m) => ({ default: m.MaintainancePage }))),
);

// Core Module - User Management (separate chunk)
const UserPage = Loadable(
  lazy(() => import('@/modules/core/user').then((m) => ({ default: m.UserPage }))),
);

// Core Module - Role Management (separate chunk)
const RolePage = Loadable(
  lazy(() => import('@/modules/core/role').then((m) => ({ default: m.RolePage }))),
);

// Core Module - Permission Management (separate chunk)
const ModulePage = Loadable(
  lazy(() => import('@/modules/core/permission').then((m) => ({ default: m.ModulePage }))),
);

// Core Module - Permission Template Management (separate chunk)
const PermissionTemplatePage = Loadable(
  lazy(() =>
    import('@/modules/core/permission-template').then((m) => ({
      default: m.PermissionTemplatePage,
    })),
  ),
);

// Core Module - Company Management (separate chunk)
const CompanyPage = Loadable(
  lazy(() => import('@/modules/core/company').then((m) => ({ default: m.CompanyPage }))),
);

// Common Module - Sample Pages (separate chunk)
const SamplePage = Loadable(
  lazy(() => import('@/modules/common/sample-page').then((m) => ({ default: m.SamplePage }))),
);

// CRM Module - Dashboard (separate chunk)
const DashboardPage = Loadable(
  lazy(() => import('@/modules/crm/dashboard').then((m) => ({ default: m.DashboardPage }))),
);

// CRM Module - Chat History (separate chunk)
const ChatHistoryPage = Loadable(
  lazy(() => import('@/modules/crm/chats').then((m) => ({ default: m.ChatHistoryPage }))),
);

// CRM Module - Leads (separate chunk)
const LeadsPage = Loadable(
  lazy(() => import('@/modules/crm/leads').then((m) => ({ default: m.LeadsPage }))),
);

// CRM Module - Deals (separate chunk)
const DealsPage = Loadable(
  lazy(() => import('@/modules/crm/deals').then((m) => ({ default: m.DealsPage }))),
);

// CRM Module - Revenue Report (separate chunk)
const RevenueReportPage = Loadable(
  lazy(() => import('@/modules/crm/reports').then((m) => ({ default: m.RevenueReportPage }))),
);

// Common Module - Error Pages (separate chunk)
const ForbiddenPage = Loadable(
  lazy(() => import('@/modules/common/errors').then((m) => ({ default: m.ForbiddenPage }))),
);
const NotFoundPage = Loadable(
  lazy(() => import('@/modules/common/errors').then((m) => ({ default: m.NotFoundPage }))),
);

const Router = [
  // Error pages - must be first to prevent wildcard catching
  {
    path: ROUTES.ERROR.FORBIDDEN,
    element: <BlankLayout />,
    children: [{ path: '', element: <ForbiddenPage /> }],
  },
  {
    path: ROUTES.ERROR.NOT_FOUND,
    element: <BlankLayout />,
    children: [{ path: '', element: <NotFoundPage /> }],
  },
  // Guest routes - must be before AuthGuard to prevent redirect loop
  {
    path: ROUTES.ROOT,
    element: (
      <GuestGuard>
        <BlankLayout />
      </GuestGuard>
    ),
    children: [
      { path: ROUTES.AUTH.LOGIN, element: <Login /> },
      { path: ROUTES.AUTH.REGISTER, element: <Register /> },
      { path: ROUTES.AUTH.FORGOT_PASSWORD, element: <ForgotPassword /> },
      { path: ROUTES.AUTH.RESET_PASSWORD, element: <ResetPassword /> },
      { path: ROUTES.AUTH.VERIFY_EMAIL, element: <VerifyEmail /> },
      { path: ROUTES.AUTH.TWO_STEPS, element: <TwoSteps /> },
      { path: ROUTES.AUTH.MAINTENANCE, element: <Maintainance /> },
    ],
  },
  // Protected routes - requires authentication
  {
    path: ROUTES.ROOT,
    element: (
      <AuthGuard>
        <FullLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <SamplePage /> },
      { path: 'sample-page', element: <SamplePage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'chats', element: <ChatHistoryPage /> },
      { path: 'leads', element: <LeadsPage /> },
      { path: 'deals', element: <DealsPage /> },
      { path: 'reports/revenue-vs-target', element: <RevenueReportPage /> },
      {
        path: 'users',
        element: (
          <PermissionGuard permission={PERMISSIONS.USER_VIEW}>
            <UserPage />
          </PermissionGuard>
        ),
      },
      {
        path: 'roles',
        element: (
          <PermissionGuard permission={PERMISSIONS.ROLE_VIEW}>
            <RolePage />
          </PermissionGuard>
        ),
      },
      {
        path: 'permissions',
        element: (
          <PermissionGuard permission={PERMISSIONS.PERMISSION_VIEW}>
            <ModulePage />
          </PermissionGuard>
        ),
      },
      {
        path: 'permission-templates',
        element: (
          <PermissionGuard permission={PERMISSIONS.PERMISSION_TEMPLATE_VIEW}>
            <PermissionTemplatePage />
          </PermissionGuard>
        ),
      },
      {
        path: 'companies',
        element: (
          <PermissionGuard permission={PERMISSIONS.COMPANY_VIEW}>
            <CompanyPage />
          </PermissionGuard>
        ),
      },
    ],
  },
  // Fallback route - catch all unmatched routes
  {
    path: '*',
    element: <Navigate to={ROUTES.ERROR.NOT_FOUND} replace />,
  },
];

const router = createBrowserRouter(Router);

export default router;
