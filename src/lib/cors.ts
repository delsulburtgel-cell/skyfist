import { VercelRequest, VercelResponse } from "@vercel/node";

export function withCors(
  handler: (req: VercelRequest, res: VercelResponse) => Promise<void> | void,
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    // Call the actual handler
    return handler(req, res);
  };
}
