import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QPay {
  invoice_id: string;
  qpay_short_url: string;
  qpay_url: string;
  qr_image?: string;
}

interface QPayPaymentWidgetProps {
  orderId: string;
  amount: number;
  customerName: string;
  customerPhone?: string;
  items: Array<{ product: any; quantity: number }>;
  onInvoiceCreated?: (
    qrImage: string | null,
    qpayUrl: string | null,
    invoiceId: string,
  ) => void;
  disabled?: boolean;
}

export function QPayPaymentWidget({
  orderId,
  amount,
  customerName,
  customerPhone = "00000000",
  items,
  onPaymentSuccess,
  onInvoiceCreated,
  disabled = false,
}: QPayPaymentWidgetProps) {
  const [loading, setLoading] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const smallFontStyle: React.CSSProperties = {
    fontFamily: "Eurostile, sans-serif",
    fontWeight: 700,
  };

  const bigFontStyle: React.CSSProperties = {
    fontFamily: "Bank-Gothic, sans-serif",
  };

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
      const response = await fetch(
        "https://sf-qpay.vercel.app/api/qpay/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            invoiceNumber: orderId,
            invoiceReceiverCode: "SKYFIST_INVOICE",
            amount: Math.round(amount), // Ensure integer amount
            items: items.map((item) => ({
              name: item.product.name,
              qty: item.quantity,
            })),
            description: `Payment for order ${orderId}`,
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create invoice");
      }

      const data: QPay = await response.json();

      if (data.qr_image) {
        setQrImage(data.qr_image);
        setPaymentUrl(null);
        onInvoiceCreated?.(data.qr_image, null, data.invoice_id);
        toast({
          title: "Invoice Created",
          description: "Scan the QR code to complete payment",
        });
      } else if (data.qpay_short_url) {
        setPaymentUrl(data.qpay_short_url);
        onInvoiceCreated?.(null, data.qpay_short_url, data.invoice_id);
        toast({
          title: "Invoice Created",
          description: "Redirecting to payment page...",
        });
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
      <div
        className="glass-card rounded-lg p-4 space-y-2"
        style={smallFontStyle}>
        <p className="text-sm text-muted-foreground" style={bigFontStyle}>
          Таны захиалга:{" "}
          <span className="font-bold text-foreground">
            {amount.toLocaleString()}₮
          </span>
        </p>
        <p className="text-xs text-muted-foreground">
          Customer: {customerName}
        </p>
      </div>

      <Button
        onClick={handleCreateInvoice}
        disabled={loading || disabled}
        className="w-full"
        size="lg">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Боловсруулж байна...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            QPay-ээр төлөх
          </>
        )}
      </Button>

      {qrImage && (
        <div className="text-center space-y-2">
          <img
            src={`data:image/png;base64,${qrImage}`}
            alt="QPay QR Code"
            className="mx-auto w-48 h-48"
          />
          <p className="text-xs text-muted-foreground">
            Scan this QR code with your QPay app to complete payment
          </p>
        </div>
      )}

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
