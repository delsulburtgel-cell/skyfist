import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";

interface QPayInvoice {
  id: string;
  status: string;
  invoice_id?: string;
  paid_amount?: number;
  payment_date?: string;
}

interface QPayPaymentStatusProps {
  invoiceId: string;
  onStatusChange?: (status: string) => void;
  autoCheck?: boolean;
  checkInterval?: number;
}

export function QPayPaymentStatus({
  invoiceId,
  onStatusChange,
  autoCheck = true,
  checkInterval = 5000,
}: QPayPaymentStatusProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPaymentStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/qpay/check/${invoiceId}`);
      if (!response.ok) {
        throw new Error("Failed to check payment status");
      }

      const data: QPayInvoice = await response.json();
      setStatus(data.status);
      onStatusChange?.(data.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Auto-check status
  useEffect(() => {
    if (!autoCheck || !invoiceId) return;

    checkPaymentStatus();
    const interval = setInterval(checkPaymentStatus, checkInterval);
    return () => clearInterval(interval);
  }, [invoiceId, autoCheck, checkInterval]);

  const getStatusDisplay = () => {
    switch (status?.toUpperCase()) {
      case "PAID":
      case "SUCCESS":
        return (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="w-5 h-5" />
            <span>Payment Successful</span>
          </div>
        );
      case "FAILED":
      case "CANCELLED":
        return (
          <div className="flex items-center gap-2 text-red-600">
            <X className="w-5 h-5" />
            <span>Payment Failed</span>
          </div>
        );
      case "PENDING":
      case "PROCESSING":
        return (
          <div className="flex items-center gap-2 text-yellow-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Payment Processing</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Checking status...</span>
          </div>
        );
    }
  };

  return (
    <div className="glass-card rounded-lg p-4 space-y-3">
      <div>{getStatusDisplay()}</div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button
        onClick={checkPaymentStatus}
        variant="outline"
        size="sm"
        disabled={loading}
        className="w-full">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Checking...
          </>
        ) : (
          "Check Status"
        )}
      </Button>
    </div>
  );
}
