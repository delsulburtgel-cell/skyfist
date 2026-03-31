/**
 * Example: Using QPay in the Cart page
 * This file shows how to integrate QPay checkout into your cart
 *
 * Installation:
 * 1. Add these imports to your Cart.tsx
 * 2. Replace the checkout button logic
 * 3. Customize as needed for your flow
 */

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { QPayCheckoutDialog } from "@/components/QPayCheckoutDialog";
import { Button } from "@/components/ui/button";

function CartPageExample() {
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const { cart } = useCart();

  // Calculate total
  const cartTotal = cart.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0,
  );

  const handleCheckoutClick = () => {
    if (cart.length === 0) {
      // Show toast or alert
      console.log("Cart is empty");
      return;
    }
    setCheckoutDialogOpen(true);
  };

  const handleCheckoutSuccess = () => {
    console.log("Order completed successfully!");
    // Clear cart, redirect to success page, etc.
  };

  return (
    <div>
      {/* Cart items */}
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <span>{item.name}</span>
            <span className="text-primary font-bold">
              {(item.price || 0).toLocaleString()}₮
            </span>
          </div>
        ))}
      </div>

      {/* Total and checkout */}
      <div className="mt-8 space-y-4">
        <div className="text-right text-lg font-bold">
          Total: {cartTotal.toLocaleString()}₮
        </div>

        <Button
          onClick={handleCheckoutClick}
          disabled={cart.length === 0}
          className="w-full"
          size="lg">
          Proceed to Checkout
        </Button>
      </div>

      {/* QPay Checkout Dialog */}
      <QPayCheckoutDialog
        open={checkoutDialogOpen}
        onOpenChange={setCheckoutDialogOpen}
        cartTotal={cartTotal}
        onCheckoutSuccess={handleCheckoutSuccess}
      />
    </div>
  );
}

export default CartPageExample;
