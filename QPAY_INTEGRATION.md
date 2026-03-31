# QPay Integration Guide

QPay integration has been added to the SF Technology project. Follow the steps below to set up and use the payment system.

## Prerequisites

- QPay merchant account
- Merchant ID and Secret Key from QPay
- Invoice Code from QPay
- Node.js 18+

## Setup

### 1. Environment Variables

Copy the example environment file and fill in your QPay credentials:

```bash
# Windows (cmd)
copy .env.local.example .env.local

# Unix/macOS
cp .env.local.example .env.local
```

Edit `.env.local` and set:

```env
QPAY_MERCHANT_ID=your_merchant_id
QPAY_SECRET_KEY=your_secret_key
QPAY_INVOICE_CODE=your_invoice_code
NEXT_PUBLIC_SITE_URL=https://yourdomain.com  # For production
```

### 2. Install Dependencies

The project already has the required dependencies. Just install:

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

## API Endpoints

### Create Invoice

**Endpoint:** `POST /api/qpay/create`

**Request Body:**

```json
{
  "invoiceNumber": "INV-001",
  "invoiceReceiverCode": "70000000",
  "amount": 50000,
  "items": [{ "name": "Item A", "qty": 1 }],
  "description": "Order payment"
}
```

**Response:**

```json
{
  "id": "61a3f6d4e4b0c1a2b3c4d5e6",
  "invoice_id": "INVOICE_ID",
  "qpay_short_url": "https://qpay.mn/code/...",
  "qpay_url": "https://merchant.qpay.mn/invoice/...",
  "status": "CREATED"
}
```

**Example with fetch:**

```javascript
const response = await fetch("/api/qpay/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    invoiceNumber: "INV-001",
    invoiceReceiverCode: "70000000",
    amount: 50000,
    items: [{ name: "Product", qty: 1 }],
  }),
});
const data = await response.json();
window.location.href = data.qpay_short_url; // Redirect to payment
```

### Check Invoice Status

**Endpoint:** `GET /api/qpay/check/:invoiceId`

**Response:**

```json
{
  "id": "INVOICE_ID",
  "status": "PAID",
  "paid_amount": 50000,
  "payment_date": "2024-03-21T10:30:00Z"
}
```

**Example with fetch:**

```javascript
const response = await fetch("/api/qpay/check/INVOICE_ID");
const data = await response.json();
console.log(data.status); // "PAID", "PENDING", "FAILED", etc.
```

### Webhook Callback

**Endpoint:** `POST /api/qpay/callback`

QPay will POST payment notifications to this endpoint automatically. The callback handler:

- Updates order status to "paid" for successful payments
- Updates order status to "failed" for failed payments
- Stores payment information in the database

## React Components

### 1. QPayPaymentWidget

Simple payment button component:

```typescript
import { QPayPaymentWidget } from "@/components/QPayPaymentWidget";

function MyComponent() {
  return (
    <QPayPaymentWidget
      orderId="ORD-123"
      amount={50000}
      customerName="Батаа"
      customerPhone="70000000"
      onPaymentSuccess={() => console.log("Payment initiated")}
    />
  );
}
```

**Props:**

- `orderId: string` - Unique order identifier
- `amount: number` - Amount to charge in MNT
- `customerName: string` - Customer name
- `customerPhone?: string` - Customer phone (default: "00000000")
- `onPaymentSuccess?: () => void` - Callback after invoice creation
- `disabled?: boolean` - Disable button

### 2. QPayPaymentStatus

Check and display payment status:

```typescript
import { QPayPaymentStatus } from "@/components/QPayPaymentStatus";

function StatusChecker() {
  return (
    <QPayPaymentStatus
      invoiceId="INVOICE_ID"
      onStatusChange={(status) => console.log("Status:", status)}
      autoCheck={true}
      checkInterval={5000}
    />
  );
}
```

**Props:**

- `invoiceId: string` - Invoice ID to check
- `onStatusChange?: (status: string) => void` - Callback when status changes
- `autoCheck?: boolean` - Auto-check status (default: true)
- `checkInterval?: number` - Check interval in ms (default: 5000)

### 3. QPayCheckoutDialog

Complete checkout flow dialog:

```typescript
import { QPayCheckoutDialog } from "@/components/QPayCheckoutDialog";
import { useState } from "react";

function Cart() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const cartTotal = 50000;

  return (
    <>
      <button onClick={() => setCheckoutOpen(true)}>
        Proceed to Checkout
      </button>

      <QPayCheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        cartTotal={cartTotal}
        onCheckoutSuccess={() => {
          console.log("Order completed");
          setCheckoutOpen(false);
        }}
      />
    </>
  );
}
```

## Custom Hook

Use the `useQPay` hook for fine-grained control:

```typescript
import { useQPay } from "@/hooks/useQPay";

function CheckoutPage() {
  const {
    loading,
    error,
    invoiceData,
    createInvoice,
    checkStatus,
    reset,
  } = useQPay({
    onSuccess: () => console.log("Invoice created"),
    onError: (err) => console.error(err),
  });

  const handlePay = async () => {
    const invoice = await createInvoice("INV-001", 50000, "70000000");
    if (invoice) {
      window.location.href = invoice.qpay_short_url;
    }
  };

  return (
    <div>
      {error && <p className="text-red-600">{error}</p>}
      <button onClick={handlePay} disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}
```

## Integration with Orders

The QPay callback automatically updates order status:

```typescript
// After successful payment, order status becomes "paid"
const { data: order } = await supabase
  .from("orders")
  .select("*")
  .eq("id", orderId)
  .single();

console.log(order.status); // "paid" or "pending" or "failed"
```

## Production Deployment

### Vercel

1. Set environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add all `QPAY_*` variables and `NEXT_PUBLIC_SITE_URL`

2. Deploy:

```bash
git push origin main
```

### Docker / Self-hosted

1. Build the project:

```bash
npm run build
```

2. Set environment variables on your server
3. Start the server:

```bash
npm start
```

## Testing

### Test Invoice Creation

```bash
curl -X POST http://localhost:5173/api/qpay/create \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceNumber": "TEST-001",
    "invoiceReceiverCode": "99000000",
    "amount": 1000,
    "items": [{"name": "Test Item", "qty": 1}]
  }'
```

### Test Status Check

```bash
curl http://localhost:5173/api/qpay/check/INVOICE_ID
```

## Troubleshooting

### "Missing QPay credentials"

- Check `.env.local` has all required variables
- Verify credentials are correct in QPay merchant dashboard
- Restart dev server after changing env vars

### "Failed to create invoice"

- Check merchant account has sufficient permissions
- Verify invoice code is correct
- Check QPay API status

### Payments not updating in database

- Verify callback URL is correct in production
- Check that order exists with matching invoice number
- Check Supabase permissions on orders table

## Additional Resources

- [QPay Merchant API Documentation](https://merchant.qpay.mn/docs)
- [QPay Webhook Documentation](https://merchant.qpay.mn/docs/webhooks)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
