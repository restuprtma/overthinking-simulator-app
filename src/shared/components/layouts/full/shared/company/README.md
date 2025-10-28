# Company Components

Komponen untuk mengelola dan mengganti company dalam aplikasi Lakukan dengan integrasi penuh ke Auth API.

## Komponen

### 1. `ChangeCompany`

Komponen utama untuk menampilkan company yang sedang aktif dan memungkinkan user untuk mengganti company. Terintegrasi dengan **POST /auth/switch-company** untuk mendapatkan JWT token baru.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'button' \| 'icon' \| 'text'` | `'button'` | Display variant |
| `onCompanyChange` | `(company: CompanyBasic) => void` | - | Callback ketika company berhasil di-switch |
| `className` | `string` | - | Custom CSS class |

#### Variants

- **`button`** (default): Tombol lengkap dengan nama company dan detail
- **`icon`**: Hanya icon (cocok untuk mobile/compact views)
- **`text`**: Teks dengan chevron dropdown (cocok untuk header)

#### Fitur

- ✅ Membaca current company dari JWT token (`company_id` & `company_name`)
- ✅ Switch company via **POST /auth/switch-company** API
- ✅ Otomatis update JWT token dengan token baru dari backend
- ✅ Refresh user data setelah switch company
- ✅ Invalidate semua React Query cache untuk force refetch dengan company context baru
- ✅ Loading state selama proses switch
- ✅ Error handling dengan snackbar notification
- ✅ Refresh button untuk manual refresh company data

#### Contoh Penggunaan

```tsx
import { ChangeCompany } from '@/shared/components/layouts/full/shared/company';

// Variant button (default) - dengan detail lengkap
<ChangeCompany
  onCompanyChange={(company) => {
    console.log('Company changed:', company);
    // Optional: navigate atau refresh data
  }}
/>

// Variant icon - untuk mobile atau compact view
<ChangeCompany variant="icon" />

// Variant text - untuk inline di header
<ChangeCompany variant="text" />
```

### 2. `CompanySelector`

Dialog untuk memilih company dari daftar company yang user adalah member-nya. Menggunakan **GET /auth/companies** untuk mendapatkan list.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `open` | `boolean` | Dialog open state |
| `currentCompanyId` | `string \| null \| undefined` | ID company yang sedang aktif |
| `onClose` | `() => void` | Callback ketika dialog ditutup |
| `onSelectCompany` | `(company: CompanyBasic) => void` | Callback ketika company dipilih |

#### Fitur

- ✅ Hanya menampilkan companies yang user adalah **member-nya** (dari GET /auth/companies)
- ✅ Client-side search by name atau code
- ✅ Highlight current company
- ✅ Loading state
- ✅ Empty state jika user tidak punya companies
- ✅ No pagination needed (semua companies user dimuat sekaligus)

#### Contoh Penggunaan

```tsx
import { CompanySelector } from '@/shared/components/layouts/full/shared/company';

const [open, setOpen] = useState(false);
const currentCompanyId = user?.company_id;

<CompanySelector
  open={open}
  currentCompanyId={currentCompanyId}
  onClose={() => setOpen(false)}
  onSelectCompany={(company) => {
    console.log('Selected company:', company);
    // Company switching handled by ChangeCompany component
    setOpen(false);
  }}
/>
```

### 3. `useCurrentCompany` Hook

Custom hook untuk mendapatkan current company dari JWT token (via Auth Context).

#### Return Value

```typescript
{
  companyId: string | undefined;
  companyName: string | undefined;
}
```

#### Contoh Penggunaan

```tsx
import { useCurrentCompany } from '@/shared/components/layouts/full/shared/company';

const MyComponent = () => {
  const { companyId, companyName } = useCurrentCompany();

  if (!companyId) {
    return <div>Please select a company</div>;
  }

  return (
    <div>
      <h1>Current Company: {companyName}</h1>
      <p>Company ID: {companyId}</p>
    </div>
  );
};
```

## Integrasi ke Header

Untuk mengintegrasikan ke header, sudah ditambahkan di [Header.tsx](../../vertical/header/Header.tsx):

```tsx
import { ChangeCompany } from '../../shared/company';

// Di dalam komponen Header
<Navbar.Collapse className="xl:block hidden">
  <div className="flex gap-3 items-center">
    {/* ... komponen lainnya ... */}

    {/* Company Selector */}
    <ChangeCompany variant="text" />

    <Customizer />
    <Profile />
  </div>
</Navbar.Collapse>
```

## API Integration

### Backend Endpoints

Komponen ini terintegrasi dengan Auth API endpoints:

#### 1. **GET /auth/companies**
Mendapatkan daftar companies yang user adalah member-nya.

**Response:**
```json
{
  "data": {
    "companies": [
      {
        "id": "uuid",
        "name": "PT Venturo Pro",
        "code": "VENTURO-PRO",
        "logo_url": "https://..."
      }
    ]
  },
  "message": "User companies retrieved successfully"
}
```

#### 2. **POST /auth/switch-company**
Switch company context dan mendapatkan JWT token baru.

**Request:**
```json
{
  "company_id": "uuid"
}
```

**Response:**
```json
{
  "data": {
    "access_token": "new-jwt-token...",
    "refresh_token": "new-refresh-token...",
    "token_type": "Bearer",
    "expires_in": 86400,
    "company": {
      "id": "uuid",
      "name": "PT Venturo Pro",
      "code": "VENTURO-PRO",
      "logo_url": null
    }
  },
  "message": "Company switched successfully"
}
```

### JWT Token Structure

JWT token berisi claims:
```typescript
{
  user_id: string;
  company_id: string;        // ⭐ Current company ID
  company_name: string;      // ⭐ Current company name
  email: string;
  username: string;
  full_name: string;
  roles: string[];
  permissions: string[];
  exp: number;
  iat: number;
}
```

### React Query Hooks

Komponen menggunakan hooks dari `/src/app/api/core/auth/`:

```typescript
// Get user companies (companies user is member of)
import { useGetUserCompanies } from '@/app/api/core/auth';

const { data, isLoading } = useGetUserCompanies();
const companies = data?.data?.data?.companies || [];

// Switch company
import { useSwitchCompany } from '@/app/api/core/auth';

const switchCompanyMutation = useSwitchCompany({
  onSuccess: (response) => {
    const { access_token, company } = response.data.data;
    // Handle new token
  }
});

switchCompanyMutation.mutate({ company_id: 'uuid' });
```

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User clicks ChangeCompany component                      │
│    - Opens CompanySelector dialog                           │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. CompanySelector loads companies                          │
│    - Calls GET /auth/companies                              │
│    - Shows only companies user is member of                 │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. User selects company                                     │
│    - Calls POST /auth/switch-company                        │
│    - Backend validates user is member                       │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Backend generates NEW JWT token                          │
│    - Token includes new company_id & company_name           │
│    - Returns access_token + refresh_token                   │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Frontend updates authentication                          │
│    - Saves new token via authService.setAuthData()          │
│    - Triggers auth state refresh                            │
│    - Invalidates all React Query cache                      │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. All subsequent API calls use new token                   │
│    - Backend extracts company_id from token                 │
│    - Data automatically filtered by new company context     │
└─────────────────────────────────────────────────────────────┘
```

## Key Differences from Previous Implementation

### Before (Old Implementation)
- ❌ Used `useGetListCompanies` (all companies in system)
- ❌ Stored `current_company_id` in localStorage
- ❌ No JWT token update on switch
- ❌ Backend can't trust company context

### After (New Implementation)
- ✅ Uses `useGetUserCompanies` (only user's companies)
- ✅ Current company stored in JWT token claims
- ✅ JWT token updated on switch (from backend)
- ✅ Backend trusts company_id from token
- ✅ Automatic permission validation
- ✅ Multi-tenancy ready

## Type Safety

Semua komponen fully typed menggunakan TypeScript:

```typescript
// From @/app/api/core/auth/type.ts
interface CompanyBasic {
  id: string;
  name: string;
  code: string;
  logo_url?: string | null;
}

interface SwitchCompanyRequest {
  company_id: string;
}

interface SwitchCompanyResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  company: CompanyBasic;
}

interface GetUserCompaniesResponse {
  companies: CompanyBasic[];
}
```

## Error Handling

Komponen handle berbagai error cases:

- ✅ User bukan member dari company (403)
- ✅ Company tidak ditemukan (404)
- ✅ Network errors
- ✅ Token expired (401)
- ✅ Invalid company_id

Error ditampilkan via Snackbar notification.

## Dependencies

- `@venturo/react-ui` - UI components
- `@tabler/icons-react` - Icons
- `@/app/api/core/auth` - Auth API hooks & types
- `@/app/services/authService` - Auth service untuk token management
- `@/app/auth/authContext` - Auth context untuk user data

## Notes

- ✅ No localStorage dependency - semua dari JWT token
- ✅ Cross-tab sync otomatis via auth state management
- ✅ Automatic cache invalidation on company switch
- ✅ Backend-driven company list (security)
- ✅ Responsive dan mobile-friendly
- ✅ Dark mode support
