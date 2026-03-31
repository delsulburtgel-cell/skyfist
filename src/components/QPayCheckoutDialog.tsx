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
  onCheckoutSuccess?: () => void;
  customerInfo?: {
    name: string;
    phone: string;
    email: string;
    address?: string;
  };
}

export function QPayCheckoutDialog({
  open,
  onOpenChange,
  cartTotal,
  onCheckoutSuccess,
  customerInfo: initialCustomerInfo,
}: CheckoutDialogProps) {
  const [step, setStep] = useState<"info" | "payment" | "status">(
    initialCustomerInfo?.name && initialCustomerInfo?.phone
      ? "payment"
      : "info",
  );
  const [customerInfo, setCustomerInfo] = useState({
    name: initialCustomerInfo?.name || "",
    phone: initialCustomerInfo?.phone || "",
    email: initialCustomerInfo?.email || "",
  });
  const [orderId, setOrderId] = useState<string>("");
  const { toast } = useToast();

  // Auto-generate order ID when customer info is provided
  useEffect(() => {
    if (initialCustomerInfo?.name && initialCustomerInfo?.phone && !orderId) {
      const newOrderId = `ORD-${Date.now()}`;
      setOrderId(newOrderId);
    }
  }, [initialCustomerInfo, orderId]);

  const handleSubmitInfo = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Generate order ID (in real app, this comes from backend)
    const newOrderId = `ORD-${Date.now()}`;
    setOrderId(newOrderId);

    // Here you would typically create an order in your database
    // await supabase.from("orders").insert({...})

    setStep("payment");
  };

  const handlePaymentSuccess = () => {
    setStep("status");
  };

  const handleClose = () => {
    // Reset state
    setStep("info");
    setCustomerInfo({ name: "", phone: "", email: "" });
    setOrderId("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            Complete your purchase securely with QPay
          </DialogDescription>
        </DialogHeader>

        {step === "info" && (
          <div className="space-y-4 py-4">
            <div className="glass-card rounded-lg p-4 bg-primary/5">
              <p className="text-sm">
                Total:{" "}
                <span className="font-bold">{cartTotal.toLocaleString()}₮</span>
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Full Name *</label>
                <Input
                  placeholder="Your full name"
                  value={customerInfo.name}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, name: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Phone Number *</label>
                <Input
                  placeholder="70000000"
                  value={customerInfo.phone}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, phone: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={customerInfo.email}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, email: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => handleClose()}
                className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubmitInfo} className="flex-1">
                Continue to Payment
              </Button>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="py-4">
            <QPayPaymentWidget
              orderId={orderId}
              amount={cartTotal}
              customerName={customerInfo.name}
              customerPhone={customerInfo.phone}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </div>
        )}

        {step === "status" && (
          <div className="space-y-4 py-4">
            <QPayPaymentStatus invoiceId={orderId} autoCheck />
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
