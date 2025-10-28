# Company Components - Usage Examples

Contoh-contoh penggunaan komponen Company untuk berbagai use case.

## 1. Basic Usage - Di Header

Penggunaan paling umum adalah menambahkan company selector di header aplikasi.

```tsx
// src/shared/components/layouts/full/vertical/header/Header.tsx
import { ChangeCompany } from '../../shared/company';

const Header = () => {
  return (
    <header>
      <nav>
        {/* Variant text - cocok untuk header */}
        <ChangeCompany variant="text" />
      </nav>
    </header>
  );
};
```

## 2. Sidebar Usage - Dengan Callback

Untuk sidebar dengan detail lengkap dan callback ketika company berubah.

```tsx
import { ChangeCompany } from '@/shared/components/layouts/full/shared/company';
import { useQueryClient } from '@tanstack/react-query';

const Sidebar = () => {
  const queryClient = useQueryClient();

  const handleCompanyChange = (company) => {
    console.log('Company changed to:', company);

    // Invalidate semua queries untuk refresh data
    queryClient.invalidateQueries();

    // Atau redirect ke dashboard
    // navigate('/dashboard');
  };

  return (
    <aside>
      {/* Variant button - dengan detail lengkap */}
      <ChangeCompany
        variant="button"
        onCompanyChange={handleCompanyChange}
      />
    </aside>
  );
};
```

## 3. Mobile Header - Icon Only

Untuk mobile view atau compact header.

```tsx
import { ChangeCompany } from '@/shared/components/layouts/full/shared/company';

const MobileHeader = () => {
  return (
    <header className="mobile-header">
      {/* Variant icon - hanya icon */}
      <ChangeCompany variant="icon" />
    </header>
  );
};
```

## 4. Custom Implementation - Manual Control

Jika Anda butuh kontrol lebih, gunakan `CompanySelector` secara manual.

```tsx
import { useState } from 'react';
import { CompanySelector } from '@/shared/components/layouts/full/shared/company';
import { Button } from '@venturo/react-ui';
import { IconBuilding } from '@tabler/icons-react';

const CustomCompanyButton = () => {
  const [open, setOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const handleSelect = (company) => {
    console.log('Selected:', company);
    setSelectedCompanyId(company.id);
    setOpen(false);

    // Custom logic here...
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        startIcon={<IconBuilding size={20} />}
      >
        Change Company
      </Button>

      <CompanySelector
        open={open}
        currentCompanyId={selectedCompanyId}
        onClose={() => setOpen(false)}
        onSelectCompany={handleSelect}
      />
    </>
  );
};
```

## 5. Getting Current Company ID - Using Hook

Gunakan hook `useCurrentCompany` untuk mendapatkan current company ID di component manapun.

```tsx
import { useCurrentCompany } from '@/shared/components/layouts/full/shared/company';
import { useGetCompany } from '@/app/api/core/company';

const MyDashboard = () => {
  // Get current company ID from localStorage (with cross-tab sync)
  const currentCompanyId = useCurrentCompany();

  // Fetch company details
  const { data: companyResponse, isLoading } = useGetCompany(
    currentCompanyId || '',
    { enabled: !!currentCompanyId }
  );

  const company = companyResponse?.data?.data;

  if (!currentCompanyId) {
    return <div>Please select a company first</div>;
  }

  if (isLoading) {
    return <div>Loading company data...</div>;
  }

  return (
    <div>
      <h1>Dashboard - {company?.name}</h1>
      <p>Company Code: {company?.code}</p>
    </div>
  );
};
```

## 6. Filtering Data by Current Company

Contoh filtering data berdasarkan company yang sedang dipilih.

```tsx
import { useCurrentCompany } from '@/shared/components/layouts/full/shared/company';
import { useGetListUsers } from '@/app/api/core/user';

const UserList = () => {
  const currentCompanyId = useCurrentCompany();

  // Fetch users filtered by current company
  const { data, isLoading } = useGetListUsers(
    {
      company_id: currentCompanyId || undefined,
      page: 1,
      page_size: 10,
    },
    { enabled: !!currentCompanyId }
  );

  if (!currentCompanyId) {
    return <div>Please select a company to view users</div>;
  }

  // Render user list...
};
```

## 7. Conditional Rendering Based on Company

Menampilkan konten berbeda berdasarkan company yang dipilih.

```tsx
import { useCurrentCompany } from '@/shared/components/layouts/full/shared/company';
import { useGetCompany } from '@/app/api/core/company';

const CompanySpecificFeature = () => {
  const currentCompanyId = useCurrentCompany();
  const { data } = useGetCompany(currentCompanyId || '', {
    enabled: !!currentCompanyId,
  });

  const company = data?.data?.data;

  // Different features based on company
  if (company?.code === 'PREMIUM') {
    return <PremiumFeatures />;
  }

  if (company?.code === 'BASIC') {
    return <BasicFeatures />;
  }

  return <DefaultFeatures />;
};
```

## 8. Synchronizing with Route

Sinkronisasi company selection dengan URL params.

```tsx
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChangeCompany, useCurrentCompany } from '@/shared/components/layouts/full/shared/company';
import { storageService } from '@/app/services/storageService';

const CompanyAwareLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCompanyId = useCurrentCompany();

  // Sync URL param with localStorage
  useEffect(() => {
    const companyIdFromUrl = searchParams.get('company_id');

    if (companyIdFromUrl && companyIdFromUrl !== currentCompanyId) {
      storageService.set('current_company_id', companyIdFromUrl);
    } else if (currentCompanyId && !companyIdFromUrl) {
      setSearchParams({ company_id: currentCompanyId });
    }
  }, [currentCompanyId, searchParams, setSearchParams]);

  return (
    <div>
      <ChangeCompany
        variant="text"
        onCompanyChange={(company) => {
          // Update URL when company changes
          setSearchParams({ company_id: company.id });
        }}
      />
      {/* Rest of layout */}
    </div>
  );
};
```

## 9. Programmatically Change Company

Mengganti company secara programmatic (tanpa user interaction).

```tsx
import { storageService } from '@/app/services/storageService';

const MyComponent = () => {
  const switchToCompany = (companyId: string) => {
    // Set to localStorage
    storageService.set('current_company_id', companyId);

    // Dispatch storage event for cross-tab sync
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'current_company_id',
        newValue: companyId,
        storageArea: localStorage,
      })
    );

    // Optional: refresh page or invalidate queries
    // window.location.reload();
  };

  return (
    <button onClick={() => switchToCompany('company-id-123')}>
      Switch to Company XYZ
    </button>
  );
};
```

## 10. Guard - Require Company Selection

Membuat guard yang memastikan user sudah memilih company.

```tsx
import { Navigate } from 'react-router-dom';
import { useCurrentCompany } from '@/shared/components/layouts/full/shared/company';

const CompanyGuard = ({ children }: { children: React.ReactNode }) => {
  const currentCompanyId = useCurrentCompany();

  if (!currentCompanyId) {
    // Redirect to company selection page
    return <Navigate to="/select-company" replace />;
  }

  return <>{children}</>;
};

// Usage in router
<Route
  path="/dashboard"
  element={
    <CompanyGuard>
      <Dashboard />
    </CompanyGuard>
  }
/>
```

## Tips & Best Practices

1. **Always check for null**: Current company ID bisa `null` jika user belum memilih company
2. **Use enabled option**: Gunakan `enabled` di React Query untuk mencegah unnecessary API calls
3. **Invalidate queries**: Invalidate queries ketika company berubah untuk refresh data
4. **Cross-tab sync**: Komponen sudah support cross-tab sync otomatis via Storage Event
5. **Type safety**: Gunakan TypeScript types dari `@/app/api/core/company/type`

## Storage Key

Current company ID disimpan di localStorage dengan key: `current_company_id`

```tsx
import { storageService } from '@/app/services/storageService';

// Get current company ID
const companyId = storageService.get<string>('current_company_id');

// Set current company ID
storageService.set('current_company_id', 'company-123');

// Remove current company ID
storageService.remove('current_company_id');
```
