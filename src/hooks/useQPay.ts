import { useState, useCallback } from "react";

interface UseQPayProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface QPayInvoiceResponse {
  id: string;
  invoice_id: string;
  qpay_short_url: string;
  qpay_url: string;
  status: string;
}

/**
 * Hook for managing QPay payments
 */
export function useQPay({ onSuccess, onError }: UseQPayProps = {}) {
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState<QPayInvoiceResponse | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const createInvoice = useCallback(
    async (invoiceNumber: string, amount: number, customerCode: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/qpay/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            invoiceNumber,
            invoiceReceiverCode: customerCode,
            amount: Math.round(amount),
            items: [{ name: `Invoice ${invoiceNumber}`, qty: 1 }],
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create invoice");
        }

        const data: QPayInvoiceResponse = await response.json();
        setInvoiceData(data);
        onSuccess?.();
        return data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        setError(errorMsg);
        onError?.(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, onError],
  );

  const checkStatus = useCallback(async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/qpay/check/${invoiceId}`);
      if (!response.ok) {
        throw new Error("Failed to check status");
      }
      return await response.json();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setError(errorMsg);
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setInvoiceData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    loading,
    error,
    invoiceData,
    createInvoice,
    checkStatus,
    reset,
  };
}
