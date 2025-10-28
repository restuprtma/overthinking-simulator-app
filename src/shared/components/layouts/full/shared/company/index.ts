/**
 * Company Components
 *
 * Komponen untuk mengelola dan mengganti company dalam aplikasi.
 *
 * @example
 * // Menggunakan ChangeCompany dengan variant button (default)
 * import { ChangeCompany } from '@/shared/components/layouts/full/shared/company';
 *
 * <ChangeCompany onCompanyChange={(company) => console.log(company)} />
 *
 * @example
 * // Menggunakan ChangeCompany dengan variant icon (untuk mobile)
 * <ChangeCompany variant="icon" />
 *
 * @example
 * // Menggunakan ChangeCompany dengan variant text (untuk header)
 * <ChangeCompany variant="text" />
 *
 * @example
 * // Menggunakan CompanySelector secara manual
 * import { CompanySelector } from '@/shared/components/layouts/full/shared/company';
 *
 * <CompanySelector
 *   open={open}
 *   currentCompanyId={companyId}
 *   onClose={() => setOpen(false)}
 *   onSelectCompany={(company) => console.log(company)}
 * />
 *
 * @example
 * // Menggunakan hook useCurrentCompany
 * import { useCurrentCompany } from '@/shared/components/layouts/full/shared/company';
 *
 * const MyComponent = () => {
 *   const currentCompanyId = useCurrentCompany();
 *   return <div>Current Company ID: {currentCompanyId}</div>;
 * };
 */

export { CompanySelector } from './CompanySelector';
export { ChangeCompany, useCurrentCompany } from './ChangeCompany';
