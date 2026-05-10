import nodemailer from "nodemailer";
import { logger } from "./logger";

// SMTP configuration via environment variables
// Set: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
// If not configured, emails are logged to console in dev mode

function createTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT ?? "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
}

const FROM = process.env.SMTP_FROM ?? "AsR Logistics <noreply@asrlogistics.com>";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(opts: EmailOptions): Promise<void> {
  const transport = createTransport();

  if (!transport) {
    // SMTP not configured — log email content in development
    logger.info({
      msg: "📧 [EMAIL PREVIEW — configure SMTP to send real emails]",
      to: opts.to,
      subject: opts.subject,
      body: opts.text ?? opts.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    });
    return;
  }

  try {
    await transport.sendMail({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    });
    logger.info({ msg: "Email sent", to: opts.to, subject: opts.subject });
  } catch (err) {
    logger.error({ msg: "Email send failed", to: opts.to, err });
  }
}

// ── Email templates ───────────────────────────────────────────────

function baseTemplate(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
  <style>
    body { margin:0; padding:0; background:#f4f6fa; font-family: 'Segoe UI', Arial, sans-serif; color:#1e293b; }
    .wrap { max-width:600px; margin:32px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,.08); }
    .header { background:#1e293b; padding:28px 32px; }
    .header h1 { margin:0; color:#fff; font-size:22px; font-weight:700; letter-spacing:-.3px; }
    .header p  { margin:4px 0 0; color:#94a3b8; font-size:13px; }
    .body { padding:32px; }
    .badge { display:inline-block; padding:4px 12px; border-radius:999px; font-size:12px; font-weight:600; margin-bottom:20px; }
    .badge.transit   { background:#e0e7ff; color:#3730a3; }
    .badge.delivered { background:#dcfce7; color:#166534; }
    .badge.pending   { background:#f1f5f9; color:#475569; }
    .badge.delayed   { background:#fee2e2; color:#991b1b; }
    .badge.default   { background:#f1f5f9; color:#475569; }
    .card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:18px 20px; margin:16px 0; }
    .row { display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #e2e8f0; font-size:14px; }
    .row:last-child { border-bottom:none; }
    .row .lbl { color:#64748b; }
    .row .val { font-weight:600; text-align:right; }
    .btn { display:inline-block; margin-top:20px; padding:12px 28px; background:#1e293b; color:#fff; text-decoration:none; border-radius:8px; font-weight:600; font-size:14px; }
    .footer { padding:20px 32px; background:#f8fafc; border-top:1px solid #e2e8f0; font-size:12px; color:#94a3b8; text-align:center; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>📦 AsR Logistics</h1>
      <p>International Shipment Tracking</p>
    </div>
    <div class="body">${body}</div>
    <div class="footer">
      AsR Logistics &bull; Real-time international tracking<br/>
      This is an automated email. Please do not reply.
    </div>
  </div>
</body>
</html>`;
}

function badgeClass(status: string): string {
  if (["In Transit", "Processing"].includes(status)) return "transit";
  if (status === "Delivered") return "delivered";
  if (status === "Delayed" || status === "Failed Delivery") return "delayed";
  if (status === "Pending") return "pending";
  return "default";
}

export interface ShipmentEmailData {
  trackingNumber: string;
  receiverName: string;
  receiverEmail: string;
  senderName: string;
  origin: string;
  destination: string;
  status: string;
  currentLocation: string;
  luggageType: string;
  weight?: number | null;
  estimatedDelivery?: string | null;
  description?: string | null;
}

export function sendShipmentRegisteredEmail(data: ShipmentEmailData): void {
  if (!data.receiverEmail) return;

  const eta = data.estimatedDelivery
    ? new Date(data.estimatedDelivery).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : "To be confirmed";

  const body = `
    <h2 style="margin:0 0 6px;font-size:20px;">Your shipment has been registered!</h2>
    <p style="color:#64748b;margin:0 0 16px;font-size:14px;">Dear ${data.receiverName}, a package is on its way to you.</p>
    <span class="badge ${badgeClass(data.status)}">${data.status}</span>

    <div class="card">
      <div class="row"><span class="lbl">Tracking Number</span><span class="val" style="font-family:monospace">${data.trackingNumber}</span></div>
      <div class="row"><span class="lbl">From</span><span class="val">${data.senderName} · ${data.origin}</span></div>
      <div class="row"><span class="lbl">To</span><span class="val">${data.destination}</span></div>
      <div class="row"><span class="lbl">Type</span><span class="val">${data.luggageType}${data.weight ? ` · ${data.weight} kg` : ""}</span></div>
      <div class="row"><span class="lbl">Estimated Delivery</span><span class="val">${eta}</span></div>
      ${data.description ? `<div class="row"><span class="lbl">Note</span><span class="val">${data.description}</span></div>` : ""}
    </div>

    <p style="font-size:14px;color:#475569;">Use your tracking number to follow your shipment in real time on the AsR Logistics tracking portal.</p>
    <a class="btn" href="https://asrlogistics.replit.app/track/${data.trackingNumber}">Track Your Shipment →</a>
  `;

  sendEmail({
    to: data.receiverEmail,
    subject: `Your shipment ${data.trackingNumber} has been registered — AsR Logistics`,
    html: baseTemplate("Shipment Registered", body),
    text: `Your shipment ${data.trackingNumber} has been registered.\nFrom: ${data.senderName} (${data.origin})\nTo: ${data.destination}\nStatus: ${data.status}\nETA: ${eta}`,
  });
}

export function sendShipmentUpdatedEmail(data: ShipmentEmailData): void {
  if (!data.receiverEmail) return;

  const eta = data.estimatedDelivery
    ? new Date(data.estimatedDelivery).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : "To be confirmed";

  const isDelivered = data.status === "Delivered";

  const body = `
    <h2 style="margin:0 0 6px;font-size:20px;">${isDelivered ? "Your shipment has been delivered! 🎉" : "Your shipment has been updated"}</h2>
    <p style="color:#64748b;margin:0 0 16px;font-size:14px;">Dear ${data.receiverName}, here is the latest update for your package.</p>
    <span class="badge ${badgeClass(data.status)}">${data.status}</span>

    <div class="card">
      <div class="row"><span class="lbl">Tracking Number</span><span class="val" style="font-family:monospace">${data.trackingNumber}</span></div>
      <div class="row"><span class="lbl">Current Status</span><span class="val">${data.status}</span></div>
      <div class="row"><span class="lbl">Current Location</span><span class="val">${data.currentLocation}</span></div>
      <div class="row"><span class="lbl">Destination</span><span class="val">${data.destination}</span></div>
      ${!isDelivered ? `<div class="row"><span class="lbl">Estimated Delivery</span><span class="val">${eta}</span></div>` : ""}
    </div>

    ${isDelivered
      ? `<p style="font-size:14px;color:#166534;background:#dcfce7;padding:12px 16px;border-radius:8px;">✅ Your package has been successfully delivered. Thank you for choosing AsR Logistics!</p>`
      : `<p style="font-size:14px;color:#475569;">Track your shipment in real time on our portal.</p><a class="btn" href="https://asrlogistics.replit.app/track/${data.trackingNumber}">Track Your Shipment →</a>`
    }
  `;

  const subject = isDelivered
    ? `✅ Delivered: ${data.trackingNumber} — AsR Logistics`
    : `📍 Update: ${data.trackingNumber} is now "${data.status}" — AsR Logistics`;

  sendEmail({
    to: data.receiverEmail,
    subject,
    html: baseTemplate("Shipment Update", body),
    text: `Shipment ${data.trackingNumber} update.\nStatus: ${data.status}\nLocation: ${data.currentLocation}\nETA: ${eta}`,
  });
}
