import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSalesPersonApi, SALES_PERSON_QUERY_KEY } from '@/app/api/crm/sales-person/useSalesPersonApi';
import type { WhatsAppSessionStatus } from '@/app/api/crm/sales-person/type';

interface UseWhatsAppPollingOptions {
  salesPersonId: string;
  enabled: boolean;
  interval?: number; // milliseconds
  timeout?: number; // milliseconds
  onSuccess?: (status: WhatsAppSessionStatus) => void;
  onTimeout?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Custom hook for polling WhatsApp connection status
 * Auto-stops when status is WORKING or FAILED, or when timeout is reached
 */
export const useWhatsAppPolling = ({
  salesPersonId,
  enabled,
  interval = 3000, // 3 seconds default
  timeout = 90000, // 90 seconds default
  onSuccess,
  onTimeout,
  onError,
}: UseWhatsAppPollingOptions) => {
  const queryClient = useQueryClient();
  const { useGetWhatsAppStatus } = useSalesPersonApi();
  const [isPolling, setIsPolling] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Get WhatsApp status query
  const { data: statusResponse, error } = useGetWhatsAppStatus(salesPersonId, enabled);

  // Start polling
  const startPolling = () => {
    setIsPolling(true);
    setTimeoutReached(false);
    startTimeRef.current = Date.now();

    // Set up polling interval
    pollingIntervalRef.current = setInterval(() => {
      queryClient.invalidateQueries({
        queryKey: [SALES_PERSON_QUERY_KEY, 'whatsapp-status', salesPersonId],
      });
    }, interval);

    // Set up timeout timer
    timeoutTimerRef.current = setTimeout(() => {
      stopPolling();
      setTimeoutReached(true);
      onTimeout?.();
    }, timeout);
  };

  // Stop polling
  const stopPolling = () => {
    setIsPolling(false);
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (timeoutTimerRef.current) {
      clearTimeout(timeoutTimerRef.current);
      timeoutTimerRef.current = null;
    }
    startTimeRef.current = null;
  };

  // Auto-stop polling based on status
  useEffect(() => {
    if (!enabled || !isPolling) return;

    const status = statusResponse?.data?.data?.status;

    // Stop polling on terminal states
    if (status === 'WORKING') {
      stopPolling();
      onSuccess?.(status);
    } else if (status === 'FAILED') {
      stopPolling();
      onError?.(new Error('WhatsApp connection failed'));
    }
  }, [statusResponse, enabled, isPolling]);

  // Handle errors
  useEffect(() => {
    if (error && isPolling) {
      stopPolling();
      onError?.(error as Error);
    }
  }, [error, isPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  // Calculate remaining time
  const getRemainingTime = () => {
    if (!startTimeRef.current) return timeout;
    const elapsed = Date.now() - startTimeRef.current;
    return Math.max(0, timeout - elapsed);
  };

  return {
    isPolling,
    timeoutReached,
    startPolling,
    stopPolling,
    statusData: statusResponse?.data?.data,
    remainingTime: getRemainingTime(),
  };
};
