/**
 * Auth Sub-Module Exports
 * Boundary for all authentication-related pages
 *
 * This creates a separate chunk for auth pages (login, register, forgot password, etc.)
 * All auth pages will be bundled together for optimal loading.
 */

export { default as LoginPage } from './pages/LoginPage';
export { default as RegisterPage } from './pages/RegisterPage';
export { default as ForgotPasswordPage } from './pages/ForgotPasswordPage';
export { default as ResetPasswordPage } from './pages/ResetPasswordPage';
export { default as VerifyEmailPage } from './pages/VerifyEmailPage';
export { default as TwoStepsPage } from './pages/TwoStepsPage';
export { default as MaintainancePage } from './pages/MaintainancePage';
