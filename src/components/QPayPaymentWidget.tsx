import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QPay {
  invoice_id: string;
  qpay_short_url: string;
  qpay_url: string;
}

interface QPayPaymentWidgetProps {
  orderId: string;
  amount: number;
  customerName: string;
  customerPhone?: string;
  onPaymentSuccess?: () => void;
  disabled?: boolean;
}

export function QPayPaymentWidget({
  orderId,
  amount,
  customerName,
  customerPhone = "00000000",
  onPaymentSuccess,
  disabled = false,
}: QPayPaymentWidgetProps) {
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCreateInvoice = async () => {
    if (!orderId || !amount) {
      toast({
        title: "Error",
        description: "Missing order information",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/qpay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNumber: orderId,
          invoiceReceiverCode: customerPhone,
          amount: Math.round(amount), // Ensure integer amount
          items: [{ name: `Order ${orderId}`, qty: 1 }],
          description: `Payment for order ${orderId}`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create invoice");
      }

      const data: QPay = await response.json();

      if (data.qpay_short_url) {
        setPaymentUrl(data.qpay_short_url);
        toast({
          title: "Invoice Created",
          description: "Redirecting to payment page...",
        });
        
        // Redirect to payment page after a short delay
        setTimeout(() => {
          window.location.href = data.qpay_short_url;
        }, 1500);
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create invoice",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-lg p-4 space-y-2">
        <p className="text-sm text-muted-foreground">
          Order Total: <span className="font-bold text-foreground">{amount.toLocaleString()}₮</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Customer: {customerName}
        </p>
      </div>

      <Button
        onClick={handleCreateInvoice}
        disabled={loading || disabled}
        className="w-full"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Pay with QPay
          </>
        )}
      </Button>

      {paymentUrl && (
        <p className="text-xs text-center text-muted-foreground">
          If not redirected automatically,{" "}
          <a href={paymentUrl} className="text-primary hover:underline">
            click here to continue payment
          </a>
        </p>
      )}
    </div>
  );
}
