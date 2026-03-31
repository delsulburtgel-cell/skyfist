/**
 * QPay Helper Library
 * Token acquisition and configuration for QPay API
 */

interface QPayTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Get access token from QPay
 */
export async function getQPayToken(): Promise<string> {
  const now = Date.now();

  // Return cached token if still valid
  if (cachedToken && tokenExpiry > now) {
    return cachedToken;
  }

  const merchantId = process.env.QPAY_MERCHANT_ID;
  const secretKey = process.env.QPAY_SECRET_KEY;

  if (!merchantId || !secretKey) {
    throw new Error("Missing QPay credentials in environment variables");
  }

  try {
    const response = await fetch("https://merchant.qpay.mn/v2/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        merchant_id: merchantId,
        secret_key: secretKey,
      }),
    });

    if (!response.ok) {
      throw new Error(`QPay auth failed: ${response.statusText}`);
    }

    const data: QPayTokenResponse = await response.json();
    cachedToken = data.access_token;
    tokenExpiry = now + data.expires_in * 1000 - 60000; // Refresh 1 min before expiry

    return cachedToken;
  } catch (error) {
    console.error("Error getting QPay token:", error);
    throw error;
  }
}

/**
 * Get QPay config
 */
export function getQPayConfig() {
  return {
    merchantId: process.env.QPAY_MERCHANT_ID,
    invoiceCode: process.env.QPAY_INVOICE_CODE,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  };
}
