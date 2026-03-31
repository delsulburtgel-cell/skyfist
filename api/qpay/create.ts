import { VercelRequest, VercelResponse } from "@vercel/node";
import { getQPayToken, getQPayConfig } from "../../src/lib/qpay";

interface InvoiceItem {
  name: string;
  qty: number;
  price?: number;
}

interface CreateInvoiceBody {
  invoiceNumber: string;
  invoiceReceiverCode: string;
  amount: number;
  items: InvoiceItem[];
  description?: string;
}

/**
 * Create QPay invoice
 * POST /api/qpay/create
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const config = getQPayConfig();
    if (!config.merchantId || !config.invoiceCode || !config.siteUrl) {
      return res.status(500).json({ error: "Missing QPay configuration" });
    }

    const { invoiceNumber, invoiceReceiverCode, amount, items, description } =
      req.body as CreateInvoiceBody;

    // Validate required fields
    if (!invoiceNumber || !invoiceReceiverCode || !amount) {
      return res.status(400).json({
        error:
          "Missing required fields: invoiceNumber, invoiceReceiverCode, amount",
      });
    }

    const token = await getQPayToken();

    const payload = {
      invoice_code: config.invoiceCode,
      sender_invoice_no: invoiceNumber,
      invoice_receiver_code: invoiceReceiverCode,
      invoice_amount: amount,
      invoice_currency: "MNT",
      invoice_description: description || "SF Technology Invoice",
      invoice_due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      callback_url: `${config.siteUrl}/api/qpay/callback`,
      invoice_line_items: (items || []).map((item) => ({
        line_item_name: item.name,
        line_item_qty: item.qty,
        line_item_unit_price: item.price || 0,
      })),
    };

    const response = await fetch("https://merchant.qpay.mn/v2/invoice/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("QPay create invoice error:", error);
      return res.status(response.status).json({
        error: "Failed to create invoice",
        details: error,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error creating QPay invoice:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
