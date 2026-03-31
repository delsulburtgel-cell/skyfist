import { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../../src/integrations/supabase/client";

interface QPayCallback {
  object_type: string;
  object_id: string;
  invoice_id: string;
  sender_invoice_no: string;
  status: string;
  amount: number;
  currency: string;
  paid_amount: number;
  payment_date: string;
  payment_id: string;
}

/**
 * QPay Callback Webhook Handler
 * POST /api/qpay/callback
 *
 * This endpoint receives payment notifications from QPay
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const callback: QPayCallback = req.body;

    console.log("QPay callback received:", callback);

    // Validate callback payload
    if (!callback.invoice_id || !callback.payment_id) {
      return res.status(400).json({ error: "Invalid callback payload" });
    }

    // Update order status based on payment status
    if (callback.status === "PAID" || callback.status === "SUCCESS") {
      // Find order by invoice number and update status
      const { data: order, error: findError } = await supabase
        .from("orders")
        .select("id")
        .eq("id", callback.sender_invoice_no)
        .single();

      if (!findError && order) {
        await supabase
          .from("orders")
          .update({
            status: "paid",
            updated_at: new Date().toISOString(),
          })
          .eq("id", order.id);

        console.log("Order updated to paid:", order.id);
      }
    } else if (
      callback.status === "FAILED" ||
      callback.status === "CANCELLED"
    ) {
      // Update order status to failed
      const { data: order, error: findError } = await supabase
        .from("orders")
        .select("id")
        .eq("id", callback.sender_invoice_no)
        .single();

      if (!findError && order) {
        await supabase
          .from("orders")
          .update({
            status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", order.id);

        console.log("Order updated to failed:", order.id);
      }
    }

    // Always return 200 to acknowledge receipt
    return res.status(200).json({
      success: true,
      message: "Callback processed",
    });
  } catch (error) {
    console.error("Error processing QPay callback:", error);
    // Still return 200 to prevent QPay from retrying
    return res.status(200).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
