import { VercelRequest, VercelResponse } from "@vercel/node";
import { getQPayToken } from "../../../src/lib/qpay";

/**
 * Check QPay invoice status
 * GET /api/qpay/check/[invoiceId]
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { invoiceId } = req.query;

    if (!invoiceId || typeof invoiceId !== "string") {
      return res.status(400).json({ error: "Missing invoiceId" });
    }

    const token = await getQPayToken();

    const response = await fetch(
      `https://merchant.qpay.mn/v2/invoice/${invoiceId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      const error = await response.text();
      console.error("QPay check invoice error:", error);
      return res.status(response.status).json({
        error: "Failed to check invoice",
        details: error,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error checking QPay invoice:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
