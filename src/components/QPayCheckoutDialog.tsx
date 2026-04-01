import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { QPayPaymentWidget } from "./QPayPaymentWidget";
import { QPayPaymentStatus } from "./QPayPaymentStatus";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartTotal: number;
  items: Array<{ product: any; quantity: number }>;
  onCheckoutSuccess?: () => void;
  customerInfo?: {
    name: string;
    phone: string;
    email: string;
    address?: string;
  };
}

const smallFontStyle: React.CSSProperties = {
  fontFamily: "Eurostile, sans-serif",
  fontWeight: 700,
};

const bigFontStyle: React.CSSProperties = {
  fontFamily: "Bank-Gothic, sans-serif",
};

export function QPayCheckoutDialog({
  open,
  onOpenChange,
  cartTotal,
  items,
  onCheckoutSuccess,
  customerInfo: initialCustomerInfo,
}: CheckoutDialogProps) {
  const [step, setStep] = useState<"payment" | "status">("payment");
  const [customerInfo, setCustomerInfo] = useState({
    name: initialCustomerInfo?.name || "",
    phone: initialCustomerInfo?.phone || "",
    email: initialCustomerInfo?.email || "",
  });
  const [orderId, setOrderId] = useState<string>("");
  const [orderSaved, setOrderSaved] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [qpayUrl, setQpayUrl] = useState<string | null>(null);

  // Auto-generate order ID when customer info is provided
  useEffect(() => {
    if (initialCustomerInfo?.name && initialCustomerInfo?.phone && !orderId) {
      const newOrderId = `ORD-${Date.now()}`;
      setOrderId(newOrderId);
    }
  }, [initialCustomerInfo, orderId]);

  const handleInvoiceCreated = (
    qr?: string | null,
    url?: string | null,
    invoiceId?: string,
  ) => {
    if (qr) setQrImage(qr);
    if (url) setQpayUrl(url);
    if (invoiceId) setOrderId(invoiceId);
    setStep("status");
  };

  const handleClose = () => {
    // Reset state
    setStep("payment");
    setCustomerInfo({ name: "", phone: "", email: "" });
    setOrderId("");
    setOrderSaved(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" style={smallFontStyle}>
        <DialogHeader>
          <DialogTitle style={bigFontStyle}>Төлбөр хийх</DialogTitle>
          <DialogDescription style={smallFontStyle}>
            QR кодыг уншуулж QPay-ээр төлбөр хийх
          </DialogDescription>
        </DialogHeader>

        {step === "payment" && (
          <div className="py-4">
            <QPayPaymentWidget
              orderId={orderId}
              amount={cartTotal}
              customerName={customerInfo.name}
              customerPhone={customerInfo.phone}
              items={items}
              onInvoiceCreated={handleInvoiceCreated}
            />
          </div>
        )}

        {step === "status" && (
          <div className="space-y-4 py-4">
            {qrImage && (
              <div className="text-center">
                <img
                  src={`data:image/png;base64,${qrImage}`}
                  alt="QPay QR Code"
                  className="mx-auto w-56 h-56"
                />
                <p
                  className="text-xs text-muted-foreground mt-2"
                  style={smallFontStyle}>
                  QPay апп-д QR кодыг уншуулан төлбөр хийх
                </p>
              </div>
            )}
            {qpayUrl && (
              <div className="text-center">
                <a
                  href={qpayUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-3 py-2 bg-primary text-white rounded-md">
                  Open QPay payment page
                </a>
              </div>
            )}

            <QPayPaymentStatus
              invoiceId={orderId}
              autoCheck
              checkInterval={3000}
              onStatusChange={async (status) => {
                if (
                  (status === "PAID" || status === "SUCCESS") &&
                  !orderSaved
                ) {
                  try {
                    // Save order to database
                    const orderData = {
                      customer_name: customerInfo.name,
                      customer_phone: customerInfo.phone,
                      customer_email: customerInfo.email,
                      items: items.map((item) => ({
                        product_id: item.product.id,
                        product_name: item.product.name,
                        quantity: item.quantity,
                        price: item.product.price,
                      })),
                      total_price: cartTotal,
                      notes: null,
                    };
                    const response = await fetch(
                      "https://sf-qpay.vercel.app/orders/create",
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(orderData),
                      },
                    );
                    if (response.ok) {
                      setOrderSaved(true);
                      onCheckoutSuccess?.();
                      toast({
                        title: "Success",
                        description: "Order saved successfully!",
                      });
                    } else {
                      throw new Error("Failed to save order");
                    }
                  } catch (error) {
                    console.error("Error saving order:", error);
                    toast({
                      title: "Error",
                      description:
                        "Failed to save order. Please contact support.",
                      variant: "destructive",
                    });
                  }
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  // Trigger manual check by calling the status component's check function
                  // For now, just show a message
                  toast({
                    title: "Checking...",
                    description:
                      "Payment status is being checked automatically.",
                  });
                }}
                className="flex-1">
                Төлбөр Шалгах
              </Button>
              <Button onClick={handleClose} className="flex-1">
                Болих
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
