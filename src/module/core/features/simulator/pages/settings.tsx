
import { useTranslate } from 'src/locales';
import { CONFIG } from 'src/shared/config';
import { DashboardContent } from 'src/layouts/dashboard';

import { CredentialsSettings } from '../views/credentials-settings';

// ----------------------------------------------------------------------

export default function SettingsPage() {
  const { t } = useTranslate('settings');

  return (
    <>
      <title>{`${t('credentialsTitle')} - ${CONFIG.appName}`}</title>

      <DashboardContent maxWidth="md">
        <CredentialsSettings />
      </DashboardContent>
    </>
  );
}
