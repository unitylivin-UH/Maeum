import express from "express";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const app = express();
const port = Number(process.env.PORT || 8787);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envLocalPath = path.join(__dirname, ".env.local");
const envPath = path.join(__dirname, ".env");

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config({ path: envPath });
}

app.use(express.json());

const normalizePhoneForBrevo = (rawPhone) => {
  const cleaned = String(rawPhone ?? "").trim().replace(/[^\d+]/g, "");
  if (!cleaned) return "";
  if (cleaned.startsWith("+")) return cleaned;
  return `+${cleaned}`;
};

const mapBrevoErrorMessage = (status, brevoErrorMessage, brevoError) => {
  if (status === 401 && /unrecognised IP address/i.test(brevoErrorMessage)) {
    return "Brevo blocked this server IP. Add your current public IP to Brevo Authorized IPs.";
  }
  if (status === 400 && /sms|phone|mobile|invalid.*number|number.*invalid/i.test(brevoErrorMessage + brevoError)) {
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
};

app.post("/api/waitlist", async (req, res) => {
  const apiKey = process.env.BREVO_API_KEY;
  const rawListId = process.env.BREVO_LIST_ID;

  if (!apiKey || !rawListId) {
    return res.status(500).json({
      ok: false,
      message: "Brevo configuration missing on server.",
    });
  }

  const listId = Number(rawListId);
  if (!Number.isFinite(listId)) {
    return res.status(500).json({
      ok: false,
      message: "BREVO_LIST_ID must be a valid number.",
    });
  }

  const { name, email, phone, hasConsent } = req.body ?? {};
  const normalizedPhone = normalizePhoneForBrevo(phone);

  if (!name || !email || !normalizedPhone || !hasConsent) {
    return res.status(400).json({
      ok: false,
      message: "Name, email, phone, and consent are required.",
    });
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: name,
          SMS: normalizedPhone,
        },
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    if (!response.ok) {
      const brevoError = await response.text();
      let brevoErrorMessage = "";
      try {
        const parsed = JSON.parse(brevoError);
        brevoErrorMessage = typeof parsed?.message === "string" ? parsed.message : "";
      } catch {
        brevoErrorMessage = "";
      }

      return res.status(response.status).json({
        ok: false,
        message: mapBrevoErrorMessage(response.status, brevoErrorMessage, brevoError),
        details: brevoError,
      });
    }

    return res.status(200).json({
      ok: true,
      message: "You are on the waitlist.",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Unable to submit waitlist signup right now.",
      details: error instanceof Error ? error.message : "Unknown server error",
    });
  }
});

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
