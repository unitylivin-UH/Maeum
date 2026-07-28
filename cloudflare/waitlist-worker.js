/**
 * Maeum waitlist API — Cloudflare Worker (Brevo). Paste into dashboard or deploy with Wrangler.
 *
 * Variables: secret BREVO_API_KEY, plain BREVO_LIST_ID. Optional: ALLOWED_ORIGINS (comma-separated).
 *
 * CORS: Access-Control-Allow-Origin must match the browser's Origin exactly — never hard-code one host.
 */

const DEFAULT_ORIGINS = [
  "https://maeum.co.uk",
  "https://www.maeum.co.uk",
  "https://steelblue-raccoon-148493.hostingersite.com",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

function getAllowedOrigins(env) {
  const extra = String(env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return [...new Set([...DEFAULT_ORIGINS, ...extra])];
}

/** @param {Request} request @param {Record<string,string>} env */
function buildCorsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = getAllowedOrigins(env);
  if (!origin || !allowed.includes(origin)) {
    return null;
  }
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function json(data, status, corsHeaders) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}

function normalizePhone(rawPhone) {
  const cleaned = String(rawPhone ?? "").trim().replace(/[^\d+]/g, "");
  if (!cleaned) return "";
  if (cleaned.startsWith("+")) return cleaned;
  return `+${cleaned}`;
}

function mapBrevoErrorMessage(status, brevoText) {
  let brevoMessage = "";
  try {
    const parsed = JSON.parse(brevoText);
    brevoMessage = typeof parsed?.message === "string" ? parsed.message : "";
  } catch {
    brevoMessage = "";
  }

  if (status === 401 && /unrecognised IP address/i.test(brevoMessage)) {
    return "Brevo blocked this server IP. Add your current public IP to Brevo Authorized IPs.";
  }

  if (status === 400 && /sms|phone|mobile|invalid.*number|number.*invalid/i.test(brevoMessage + brevoText)) {
    return "That phone number doesn’t look valid. Please check it and try again.";
  }

  const statusMessageByCode = {
    400: "Brevo rejected the payload. Check contact attributes and list setup.",
    401: "Brevo authentication failed. Please verify BREVO_API_KEY or Brevo IP allowlist settings.",
    403: "Brevo denied access for this API key.",
    404: "Brevo resource not found. Verify BREVO_LIST_ID.",
    429: "Brevo rate limit reached. Please retry shortly.",
  };

  return statusMessageByCode[status] || "Brevo rejected the contact submission.";
}

export default {
  async fetch(request, env) {
    const corsHeaders = buildCorsHeaders(request, env);

    if (request.method === "OPTIONS") {
      if (!corsHeaders) {
        return new Response(null, { status: 403 });
      }
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    if (request.method !== "POST" || url.pathname !== "/api/waitlist") {
      return json(
        { ok: false, message: "Not found." },
        404,
        corsHeaders ?? { "Content-Type": "application/json" },
      );
    }

    if (!corsHeaders) {
      return json(
        { ok: false, message: "Origin not allowed." },
        403,
        { "Content-Type": "application/json" },
      );
    }

    if (!env.BREVO_API_KEY || !env.BREVO_LIST_ID) {
      return json(
        { ok: false, message: "Brevo configuration missing." },
        500,
        corsHeaders,
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json(
        { ok: false, message: "Invalid JSON payload." },
        400,
        corsHeaders,
      );
    }

    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const phoneRaw = String(body?.phone ?? "").trim();
    const hasConsent = body?.hasConsent === true;

    const phone = normalizePhone(phoneRaw);

    if (!name || !email || !phone || !hasConsent) {
      return json(
        { ok: false, message: "Name, email, phone, and consent are required." },
        400,
        corsHeaders,
      );
    }

    const listId = Number(env.BREVO_LIST_ID);
    if (!Number.isFinite(listId)) {
      return json(
        { ok: false, message: "BREVO_LIST_ID must be a valid number." },
        500,
        corsHeaders,
      );
    }

    try {
      const brevoResponse = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          email,
          attributes: {
            FIRSTNAME: name,
            SMS: phone,
          },
          listIds: [listId],
          updateEnabled: true,
        }),
      });

      const brevoText = await brevoResponse.text();

      if (!brevoResponse.ok) {
        const message = mapBrevoErrorMessage(brevoResponse.status, brevoText);
        return json(
          { ok: false, message, details: brevoText },
          brevoResponse.status,
          corsHeaders,
        );
      }

      return json(
        { ok: true, message: "You are on the waitlist." },
        200,
        corsHeaders,
      );
    } catch (error) {
      return json(
        {
          ok: false,
          message: "Unable to submit waitlist signup right now.",
          details: error instanceof Error ? error.message : "Unknown server error",
        },
        500,
        corsHeaders,
      );
    }
  },
};
