import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/shared/config';
import { PERM } from 'src/shared/lib/permissions';
import { DashboardLayout } from 'src/layouts/dashboard';
import { LoadingScreen } from 'src/shared/ui/loading-screen';
import { AuthGuard, PermissionGuard } from 'src/module/core/features/auth/guard';

import { usePathname } from '../hooks';

// ----------------------------------------------------------------------

const HomePage = lazy(() => import('src/module/analysis/features/stock-analysis/pages'));
const OrderbookPage = lazy(() => import('src/module/analysis/features/orderbook/pages'));
const OrderbookPlaybackPage = lazy(
  () => import('src/module/analysis/features/orderbook-playback/pages')
);
const BrokerActivityPage = lazy(
  () => import('src/module/analysis/features/broker-activity/pages')
);
const StockActivityPage = lazy(() => import('src/module/analysis/features/stock-activity/pages'));

const BranchesListPage = lazy(() => import('src/module/core/features/branches/pages/list'));
const RolesListPage = lazy(() => import('src/module/core/features/roles/pages/list'));
const UsersListPage = lazy(() => import('src/module/core/features/users/pages/list'));
const TranslationOverridePage = lazy(
  () => import('src/module/core/features/translation-override/pages/list')
);

// ----------------------------------------------------------------------

function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

const dashboardLayout = () => (
  <DashboardLayout>
    <SuspenseOutlet />
  </DashboardLayout>
);

function gated(require: string | string[], element: React.ReactElement) {
  return (
    <PermissionGuard require={require} showForbidden>
      {element}
    </PermissionGuard>
  );
}

export const dashboardRoutes: RouteObject[] = [
  {
    path: '/',
    element: CONFIG.auth.skip ? dashboardLayout() : <AuthGuard>{dashboardLayout()}</AuthGuard>,
    children: [
      { element: <HomePage />, index: true },
      { path: 'orderbook', element: <OrderbookPage /> },
      { path: 'orderbook-playback', element: <OrderbookPlaybackPage /> },
      { path: 'broker-analysis/broker-activity', element: <BrokerActivityPage /> },
      { path: 'broker-analysis/stock-activity', element: <StockActivityPage /> },
      { path: 'settings/branches', element: gated(PERM.branches.read, <BranchesListPage />) },
      { path: 'settings/roles', element: gated(PERM.roles.read, <RolesListPage />) },
      {
        path: 'settings/users',
        element: gated(PERM.userManagement.read, <UsersListPage />),
      },
      {
        path: 'settings/translation-override',
        element: gated(PERM.translationOverrides.read, <TranslationOverridePage />),
      },
    ],
  },
];
