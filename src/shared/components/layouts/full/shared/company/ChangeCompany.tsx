import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  useSnackbar,
} from '@venturo/react-ui';
import { IconBuilding, IconChevronDown } from '@tabler/icons-react';
import { CompanySelector } from './CompanySelector';
import { useSwitchCompany, type CompanyBasic } from '@/app/api/core/auth';
import { authService } from '@/app/services/authService';
import { useAuth } from '@/app/auth/authContext';

interface ChangeCompanyProps {
  /**
   * Display variant
   * - 'button': Full button with company name (default)
   * - 'icon': Icon button only (for mobile/compact views)
   * - 'text': Text with dropdown indicator (for header)
   */
  variant?: 'button' | 'icon' | 'text';

  /**
   * Callback when company changes
   */
  onCompanyChange?: (company: CompanyBasic) => void;

  /**
   * Optional className for styling
   */
  className?: string;
}

export const ChangeCompany: React.FC<ChangeCompanyProps> = ({
  variant = 'button',
  onCompanyChange,
  className,
}) => {
  const snackbar = useSnackbar();
  const { user, refreshUser } = useAuth();
  const [selectorOpen, setSelectorOpen] = useState(false);

  // Get current company from JWT token
  const currentCompanyId = user?.company_id;
  const currentCompanyName = user?.company_name;

  // Switch company mutation
  const switchCompanyMutation = useSwitchCompany({
    onSuccess: async (response) => {
      try {
        const { access_token, company } = response.data.data;

        // Update auth token with new JWT token
        await authService.setAuthData(access_token);

        // Refresh user data from new token
        await refreshUser();

        // Trigger callback
        onCompanyChange?.(company);

        // Show success message
        snackbar.success(`Switched to ${company.name}`);
      } catch (error) {
        console.error('Error updating company:', error);
        snackbar.error('Failed to update company data');
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to switch company';
      const errorStatus = error.response?.status;

      if (errorStatus === 404) {
        snackbar.error('Switch company endpoint not available');
      } else if (errorStatus === 403) {
        snackbar.error('You are not a member of this company');
      } else if (errorStatus === 401) {
        snackbar.error('Authentication failed. Please login again');
      } else {
        snackbar.error(errorMessage);
      }
    },
  });

  const handleSelectCompany = async (company: CompanyBasic) => {
    // Don't switch if already current company
    if (company.id === currentCompanyId) {
      setSelectorOpen(false);
      return;
    }

    // Call switch company API
    switchCompanyMutation.mutate({
      company_id: company.id,
    });

    setSelectorOpen(false);
  };

  const handleOpenSelector = () => {
    setSelectorOpen(true);
  };

  // Global keyboard shortcut: Cmd+K (Mac) or Ctrl+K (Windows/Linux)
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setSelectorOpen(true);
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleGlobalKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  // Icon variant - compact icon button
  if (variant === 'icon') {
    return (
      <>
        <Tooltip title={currentCompanyName || 'Select Company'}>
          <IconButton
            onClick={handleOpenSelector}
            className={className}
            sx={{
              color: 'text.primary',
            }}
          >
            <IconBuilding size={20} />
          </IconButton>
        </Tooltip>

        <CompanySelector
          open={selectorOpen}
          currentCompanyId={currentCompanyId}
          onClose={() => setSelectorOpen(false)}
          onSelectCompany={handleSelectCompany}
        />
      </>
    );
  }

  // Text variant - for header inline display
  if (variant === 'text') {
    return (
      <>
        <Box
          onClick={handleOpenSelector}
          className={className}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <IconBuilding size={18} />
          <Typography variant="body2" fontWeight={500}>
            {currentCompanyName || 'Select Company'}
          </Typography>
          <IconChevronDown size={16} />
        </Box>

        <CompanySelector
          open={selectorOpen}
          currentCompanyId={currentCompanyId}
          onClose={() => setSelectorOpen(false)}
          onSelectCompany={handleSelectCompany}
        />
      </>
    );
  }

  // Button variant - full button with all details (default)
  return (
    <>
      <Stack spacing={1} className={className}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="outlined"
            onClick={handleOpenSelector}
            fullWidth
            startIcon={<IconBuilding size={20} />}
            endIcon={<IconChevronDown size={16} />}
            className="justify-between text-left normal-case group"
            disabled={switchCompanyMutation.isPending}
          >
            <Box flex={1}>
              {switchCompanyMutation.isPending ? (
                <Typography variant="body2" className="group-hover:text-white transition-colors">
                  Switching...
                </Typography>
              ) : currentCompanyName ? (
                <Typography
                  variant="body2"
                  fontWeight={600}
                  className="group-hover:text-white transition-colors"
                >
                  {currentCompanyName}
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  className="text-textSecondary group-hover:text-white transition-colors"
                >
                  Select Company
                </Typography>
              )}
            </Box>
          </Button>

          {/* {currentCompanyName && (
            <Tooltip title="Refresh company data">
              <IconButton
                size="small"
                onClick={handleRefresh}
                disabled={switchCompanyMutation.isPending}
              >
                <IconRefresh size={18} />
              </IconButton>
            </Tooltip>
          )} */}
        </Stack>
      </Stack>

      <CompanySelector
        open={selectorOpen}
        currentCompanyId={currentCompanyId}
        onClose={() => setSelectorOpen(false)}
        onSelectCompany={handleSelectCompany}
      />
    </>
  );
};

/**
 * Hook to get current company from JWT token
 * No longer uses localStorage - reads directly from auth context
 */
export const useCurrentCompany = () => {
  const { user } = useAuth();
  return {
    companyId: user?.company_id,
    companyName: user?.company_name,
  };
};
