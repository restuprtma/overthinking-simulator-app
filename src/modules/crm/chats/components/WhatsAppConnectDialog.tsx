import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  LinearProgress,
  Alert,
  CircularProgress,
} from '@venturo/react-ui';
import {
  IconBrandWhatsapp,
  IconCheck,
  IconAlertCircle,
  IconClock,
} from '@tabler/icons-react';
import { useSalesPersonApi } from '@/app/api/crm/sales-person/useSalesPersonApi';
import { useWhatsAppPolling } from '../hooks/useWhatsAppPolling';
import type { WhatsAppConnectData } from '@/app/api/crm/sales-person/type';

interface WhatsAppConnectDialogProps {
  open: boolean;
  salesPersonId: string;
  salesPersonName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const WhatsAppConnectDialog: React.FC<WhatsAppConnectDialogProps> = ({
  open,
  salesPersonId,
  salesPersonName,
  onClose,
  onSuccess,
}) => {
  const { useConnectWhatsApp } = useSalesPersonApi();
  const connectMutation = useConnectWhatsApp();

  const [connectData, setConnectData] = useState<WhatsAppConnectData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successState, setSuccessState] = useState(false);

  // Polling hook
  const {
    isPolling,
    timeoutReached,
    startPolling,
    stopPolling,
    statusData,
    remainingTime,
  } = useWhatsAppPolling({
    salesPersonId,
    enabled: open && !!connectData,
    interval: 3000, // 3 seconds
    timeout: 90000, // 90 seconds
    onSuccess: (status) => {
      if (status === 'WORKING') {
        setSuccessState(true);
        // Auto-close after 2 seconds
        setTimeout(() => {
          onSuccess?.();
          handleClose();
        }, 2000);
      }
    },
    onTimeout: () => {
      setError('Pairing code expired. Please try again.');
    },
    onError: (err) => {
      setError(err.message || 'Failed to check connection status');
    },
  });

  // Initiate connection when dialog opens
  useEffect(() => {
    if (open && salesPersonId) {
      handleConnect();
    }
  }, [open, salesPersonId]);

  const handleConnect = async () => {
    try {
      setError(null);
      setSuccessState(false);
      const response = await connectMutation.mutateAsync(salesPersonId);
      console.log('WhatsApp Connect Response:', response);
      console.log('Connect Data:', response.data.data);
      setConnectData(response.data.data);
      // Start polling after successful connection initiation
      startPolling();
    } catch (err: any) {
      console.error('WhatsApp Connect Error:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to initiate WhatsApp connection';
      setError(errorMessage);
    }
  };

  const handleClose = () => {
    stopPolling();
    setConnectData(null);
    setError(null);
    setSuccessState(false);
    onClose();
  };

  const handleRetry = () => {
    handleConnect();
  };

  // Format pairing code: "12345678" -> "1234 5678"
  const formatPairingCode = (code: string) => {
    if (!code || code.length !== 8) return code;
    return `${code.slice(0, 4)} ${code.slice(4)}`;
  };

  // Calculate progress percentage
  const progressPercentage = ((90000 - remainingTime) / 90000) * 100;

  // Get current status from polling or connect data
  const currentStatus = statusData?.status || connectData?.status;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle onClose={handleClose}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: successState ? 'success.main' : 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
          >
            {successState ? (
              <IconCheck size={28} color="white" />
            ) : (
              <IconBrandWhatsapp size={28} color="white" />
            )}
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {successState ? 'Connected!' : 'Connect WhatsApp'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {salesPersonName}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconAlertCircle size={20} />
              <Typography variant="body2">{error}</Typography>
            </Box>
          </Alert>
        )}

        {/* Success State */}
        {successState && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600}>
              WhatsApp connected successfully!
            </Typography>
            <Typography variant="caption" color="text.secondary">
              You can now receive and send messages.
            </Typography>
          </Alert>
        )}

        {/* Loading State */}
        {connectMutation.isPending && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
            <CircularProgress size={48} />
            <Typography variant="body2" color="text.secondary">
              Initiating connection...
            </Typography>
          </Box>
        )}

        {/* Pairing Code Display */}
        {connectData && !successState && !error && (
          <Box>
            {/* Instructions */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Follow these steps:
              </Typography>
              <Box component="ol" sx={{ pl: 2.5, m: 0 }}>
                <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Open WhatsApp on your phone
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Go to <strong>Settings → Linked Devices</strong>
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Tap <strong>Link a Device</strong>
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Select <strong>Link with phone number instead</strong>
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  Enter the pairing code below
                </Typography>
              </Box>
            </Box>

            {/* Pairing Code */}
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: 'primary.lighter',
                border: '2px solid',
                borderColor: 'primary.main',
                textAlign: 'center',
                mb: 2,
              }}
            >
              <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                Pairing Code
              </Typography>
              <Typography
                variant="h2"
                fontWeight={700}
                letterSpacing={8}
                sx={{ fontFamily: 'monospace', color: 'primary.main' }}
              >
                {formatPairingCode(connectData.pairing_code)}
              </Typography>
            </Box>

            {/* Timer & Status */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconClock size={16} />
                  <Typography variant="caption" color="text.secondary">
                    {timeoutReached ? 'Expired' : `Expires in ${Math.ceil(remainingTime / 1000)}s`}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                  Status: {currentStatus?.toLowerCase()}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progressPercentage}
                sx={{
                  height: 8,
                  borderRadius: 1,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: timeoutReached ? 'error.main' : 'primary.main',
                    transition: 'transform 0.3s linear',
                  },
                }}
              />
            </Box>

            {/* Status Messages */}
            {isPolling && currentStatus === 'STARTING' && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Waiting for you to enter the pairing code...
                </Typography>
              </Alert>
            )}

            {timeoutReached && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Pairing code has expired. Please try again.
                </Typography>
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {error || timeoutReached ? (
          <>
            <Button variant="outlined" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="solid" color="primary" onClick={handleRetry}>
              Retry
            </Button>
          </>
        ) : successState ? (
          <Button variant="solid" color="success" onClick={handleClose} fullWidth>
            Done
          </Button>
        ) : (
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
