import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import '@/shared/styles/globals.css'
import App from './App.tsx'
import Spinner from '@/shared/components/common/Spinner'
import { CustomizerProvider, QueryClientProvider, MuiThemeProvider } from '@/app/providers'
import { AuthProvider } from '@/app/auth'
import '@/shared/utils/i18n';
import { DashboardProvider } from '@/app/providers'
import { ToastProvider } from '@/shared/contexts/ToastContext'
import { SnackbarProvider } from '@venturo/react-ui'

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider>
    <AuthProvider>
      <SnackbarProvider>
        <ToastProvider>
          <DashboardProvider>
            <CustomizerProvider>
              <MuiThemeProvider>
                <Suspense fallback={<Spinner />}>
                  <App />
                </Suspense>
              </MuiThemeProvider>
            </CustomizerProvider>
          </DashboardProvider>
        </ToastProvider>
      </SnackbarProvider>
    </AuthProvider>
  </QueryClientProvider>
)
