import PDFDocument from "pdfkit";
import type { Response } from "express";

export interface ShipmentPdfData {
  id: number;
  trackingNumber: string;
  senderName: string;
  senderPhone?: string | null;
  senderEmail?: string | null;
  receiverName: string;
  receiverPhone?: string | null;
  receiverEmail?: string | null;
  origin: string;
  destination: string;
  currentLocation: string;
  status: string;
  luggageType: string;
  weight?: number | null;
  estimatedDelivery?: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  history: Array<{
    status: string;
    location: string;
    description: string;
    createdAt: string;
  }>;
}

function fmtDate(d: string | null | undefined): string {
  if (!d) return "N/A";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function fmtDateTime(d: string | null | undefined): string {
  if (!d) return "N/A";
  return new Date(d).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

const NAVY = "#1e293b";
const SLATE = "#64748b";
const LIGHT = "#f8fafc";
const BORDER = "#e2e8f0";
const ACCENT = "#3b82f6";
const GREEN = "#16a34a";

function drawHeader(doc: InstanceType<typeof PDFDocument>, title: string, subtitle: string) {
  // Header bar
  doc.rect(0, 0, doc.page.width, 80).fill(NAVY);
  doc.fontSize(22).font("Helvetica-Bold").fillColor("#ffffff").text("AsR Logistics", 40, 22);
  doc.fontSize(10).font("Helvetica").fillColor("#94a3b8").text("International Shipment Tracking", 40, 48);
  doc.fontSize(10).font("Helvetica").fillColor("#cbd5e1").text(title, doc.page.width - 200, 22, { width: 160, align: "right" });
  doc.fontSize(9).fillColor("#94a3b8").text(subtitle, doc.page.width - 200, 40, { width: 160, align: "right" });
  doc.fillColor(NAVY);
}

function labelValue(doc: InstanceType<typeof PDFDocument>, x: number, y: number, label: string, value: string, valueColor = NAVY) {
  doc.fontSize(9).font("Helvetica").fillColor(SLATE).text(label, x, y);
  doc.fontSize(10).font("Helvetica-Bold").fillColor(valueColor).text(value || "N/A", x, y + 13);
  return y + 34;
}

function sectionTitle(doc: InstanceType<typeof PDFDocument>, y: number, title: string): number {
  doc.rect(40, y, doc.page.width - 80, 1).fill(BORDER);
  doc.fontSize(11).font("Helvetica-Bold").fillColor(NAVY).text(title, 40, y + 8);
  return y + 26;
}

export function generateReceiptPdf(res: Response, data: ShipmentPdfData): void {
  const doc = new PDFDocument({ size: "A4", margin: 40 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="receipt-${data.trackingNumber}.pdf"`);
  doc.pipe(res);

  drawHeader(doc, "SHIPMENT RECEIPT", `Generated: ${fmtDateTime(new Date().toISOString())}`);

  let y = 100;

  // Tracking number badge
  doc.rect(40, y, doc.page.width - 80, 48).fill(LIGHT).stroke(BORDER);
  doc.fontSize(12).font("Helvetica").fillColor(SLATE).text("Tracking Number", 56, y + 8);
  doc.fontSize(16).font("Helvetica-Bold").fillColor(ACCENT).text(data.trackingNumber, 56, y + 22);
  const statusX = doc.page.width - 180;
  doc.fontSize(11).font("Helvetica-Bold").fillColor(data.status === "Delivered" ? GREEN : ACCENT).text(data.status, statusX, y + 22, { width: 120, align: "right" });
  y += 64;

  // Two-column: Sender | Receiver
  y = sectionTitle(doc, y, "Shipment Parties");
  const midX = doc.page.width / 2;

  doc.rect(40, y, midX - 50, 82).fill(LIGHT).stroke(BORDER);
  doc.fontSize(9).font("Helvetica-Bold").fillColor(SLATE).text("SENDER", 56, y + 8);
  doc.fontSize(10).font("Helvetica-Bold").fillColor(NAVY).text(data.senderName, 56, y + 20);
  doc.fontSize(9).font("Helvetica").fillColor(SLATE).text(data.senderPhone ?? "", 56, y + 34);
  doc.fontSize(9).font("Helvetica").fillColor(SLATE).text(data.senderEmail ?? "", 56, y + 46);
  doc.fontSize(9).font("Helvetica").fillColor(SLATE).text(data.origin, 56, y + 58);

  doc.rect(midX - 10, y, midX - 50, 82).fill(LIGHT).stroke(BORDER);
  doc.fontSize(9).font("Helvetica-Bold").fillColor(SLATE).text("RECEIVER", midX + 6, y + 8);
  doc.fontSize(10).font("Helvetica-Bold").fillColor(NAVY).text(data.receiverName, midX + 6, y + 20);
  doc.fontSize(9).font("Helvetica").fillColor(SLATE).text(data.receiverPhone ?? "", midX + 6, y + 34);
  doc.fontSize(9).font("Helvetica").fillColor(SLATE).text(data.receiverEmail ?? "", midX + 6, y + 46);
  doc.fontSize(9).font("Helvetica").fillColor(SLATE).text(data.destination, midX + 6, y + 58);
  y += 98;

  // Shipment details
  y = sectionTitle(doc, y, "Shipment Details");
  const colW = (doc.page.width - 80) / 3;
  labelValue(doc, 40, y, "Type", data.luggageType);
  labelValue(doc, 40 + colW, y, "Weight", data.weight ? `${data.weight} kg` : "N/A");
  labelValue(doc, 40 + colW * 2, y, "Estimated Delivery", fmtDate(data.estimatedDelivery));
  y += 44;
  labelValue(doc, 40, y, "Origin", data.origin);
  labelValue(doc, 40 + colW, y, "Destination", data.destination);
  labelValue(doc, 40 + colW * 2, y, "Current Location", data.currentLocation);
  y += 44;
  if (data.description) {
    labelValue(doc, 40, y, "Description", data.description);
    y += 44;
  }

  // Tracking history (last 5)
  y = sectionTitle(doc, y, "Tracking History");
  const recent = [...data.history].reverse().slice(0, 5);
  recent.forEach((h, i) => {
    if (y > doc.page.height - 80) { doc.addPage(); y = 40; }
    const bg = i === 0 ? "#eff6ff" : LIGHT;
    doc.rect(40, y, doc.page.width - 80, 42).fill(bg).stroke(BORDER);
    doc.fontSize(10).font("Helvetica-Bold").fillColor(i === 0 ? ACCENT : NAVY).text(h.status, 56, y + 6);
    doc.fontSize(9).font("Helvetica").fillColor(SLATE).text(h.description, 56, y + 20, { width: 300 });
    doc.fontSize(8).font("Helvetica").fillColor(SLATE).text(`${h.location} · ${fmtDateTime(h.createdAt)}`, doc.page.width - 230, y + 14, { width: 180, align: "right" });
    y += 46;
  });

  // Footer
  if (y > doc.page.height - 60) { doc.addPage(); y = 40; }
  y = Math.max(y, doc.page.height - 70);
  doc.rect(40, y, doc.page.width - 80, 1).fill(BORDER);
  doc.fontSize(8).font("Helvetica").fillColor(SLATE).text(
    `Receipt generated on ${fmtDateTime(new Date().toISOString())} · AsR Logistics · Track at: asrlogistics.replit.app/track/${data.trackingNumber}`,
    40, y + 8, { width: doc.page.width - 80, align: "center" }
  );

  doc.end();
}

export function generateInvoicePdf(res: Response, data: ShipmentPdfData): void {
  const doc = new PDFDocument({ size: "A4", margin: 40 });

  const invoiceNumber = `INV-${data.id.toString().padStart(6, "0")}`;
  const today = fmtDate(new Date().toISOString());

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="invoice-${data.trackingNumber}.pdf"`);
  doc.pipe(res);

  drawHeader(doc, "COMMERCIAL INVOICE", `Invoice #: ${invoiceNumber}`);

  let y = 100;

  // Invoice meta
  doc.rect(40, y, doc.page.width - 80, 52).fill(LIGHT).stroke(BORDER);
  const iColW = (doc.page.width - 80) / 4;
  const iMeta = [
    ["Invoice #", invoiceNumber],
    ["Invoice Date", today],
    ["Tracking #", data.trackingNumber],
    ["Status", data.status],
  ];
  iMeta.forEach(([l, v], i) => {
    doc.fontSize(8).font("Helvetica").fillColor(SLATE).text(l, 56 + i * iColW, y + 8, { width: iColW - 8 });
    doc.fontSize(10).font("Helvetica-Bold").fillColor(i === 3 && data.status === "Delivered" ? GREEN : NAVY).text(v, 56 + i * iColW, y + 22, { width: iColW - 8 });
  });
  y += 68;

  // Bill from / Bill to
  y = sectionTitle(doc, y, "Billing Parties");
  const halfW = (doc.page.width - 80) / 2 - 6;
  doc.rect(40, y, halfW, 88).fill(LIGHT).stroke(BORDER);
  doc.fontSize(9).font("Helvetica-Bold").fillColor(SLATE).text("FROM (SENDER)", 56, y + 8);
  doc.fontSize(11).font("Helvetica-Bold").fillColor(NAVY).text(data.senderName, 56, y + 22);
  doc.fontSize(9).font("Helvetica").fillColor(SLATE).text(data.senderPhone ?? "", 56, y + 38);
  doc.fontSize(9).font("Helvetica").fillColor(SLATE).text(data.senderEmail ?? "", 56, y + 52);
  doc.fontSize(9).font("Helvetica").fillColor(SLATE).text(data.origin, 56, y + 66);

  const col2X = 40 + halfW + 12;
  doc.rect(col2X, y, halfW, 88).fill(LIGHT).stroke(BORDER);
  doc.fontSize(9).font("Helvetica-Bold").fillColor(SLATE).text("TO (RECEIVER)", col2X + 16, y + 8);
  doc.fontSize(11).font("Helvetica-Bold").fillColor(NAVY).text(data.receiverName, col2X + 16, y + 22);
  doc.fontSize(9).font("Helvetica").fillColor(SLATE).text(data.receiverPhone ?? "", col2X + 16, y + 38);
  doc.fontSize(9).font("Helvetica").fillColor(SLATE).text(data.receiverEmail ?? "", col2X + 16, y + 52);
  doc.fontSize(9).font("Helvetica").fillColor(SLATE).text(data.destination, col2X + 16, y + 66);
  y += 104;

  // Line items table
  y = sectionTitle(doc, y, "Services & Charges");

  // Table header
  doc.rect(40, y, doc.page.width - 80, 24).fill(NAVY);
  doc.fontSize(9).font("Helvetica-Bold").fillColor("#fff");
  doc.text("Description", 56, y + 7, { width: 240 });
  doc.text("Type", 310, y + 7, { width: 80 });
  doc.text("Weight", 400, y + 7, { width: 60 });
  doc.text("Route", 460, y + 7, { width: 100 });
  y += 24;

  // Item row
  doc.rect(40, y, doc.page.width - 80, 30).fill(LIGHT).stroke(BORDER);
  doc.fontSize(9).font("Helvetica").fillColor(NAVY);
  doc.text(`International ${data.luggageType} Shipment`, 56, y + 10, { width: 240 });
  doc.text(data.luggageType, 310, y + 10, { width: 80 });
  doc.text(data.weight ? `${data.weight} kg` : "N/A", 400, y + 10, { width: 60 });
  doc.text(`${data.origin} → ${data.destination}`, 460, y + 10, { width: 100 });
  y += 30;

  if (data.description) {
    doc.rect(40, y, doc.page.width - 80, 24).fill("#f0f9ff").stroke(BORDER);
    doc.fontSize(8).font("Helvetica").fillColor(SLATE).text(`Note: ${data.description}`, 56, y + 7, { width: doc.page.width - 130 });
    y += 24;
  }

  y += 16;

  // Shipment info
  y = sectionTitle(doc, y, "Shipment Information");
  const siW = (doc.page.width - 80) / 3;
  labelValue(doc, 40, y, "Date of Registration", fmtDate(data.createdAt));
  labelValue(doc, 40 + siW, y, "Estimated Delivery", fmtDate(data.estimatedDelivery));
  labelValue(doc, 40 + siW * 2, y, "Current Status", data.status, data.status === "Delivered" ? GREEN : ACCENT);
  y += 44;
  labelValue(doc, 40, y, "Current Location", data.currentLocation);
  labelValue(doc, 40 + siW, y, "Origin", data.origin);
  labelValue(doc, 40 + siW * 2, y, "Destination", data.destination);
  y += 44;

  // Terms box
  if (y > doc.page.height - 120) { doc.addPage(); y = 40; }
  doc.rect(40, y, doc.page.width - 80, 56).fill(LIGHT).stroke(BORDER);
  doc.fontSize(9).font("Helvetica-Bold").fillColor(NAVY).text("Terms & Conditions", 56, y + 8);
  doc.fontSize(8).font("Helvetica").fillColor(SLATE).text(
    "This invoice is issued by AsR Logistics for the shipment described above. All charges are subject to the carrier's terms of service. AsR Logistics is not responsible for delays caused by customs authorities or force majeure events. This document serves as proof of registration and shipment.",
    56, y + 22, { width: doc.page.width - 112 }
  );
  y += 70;

  // Footer
  if (y > doc.page.height - 60) { doc.addPage(); y = 40; }
  y = Math.max(y, doc.page.height - 68);
  doc.rect(40, y, doc.page.width - 80, 1).fill(BORDER);
  doc.fontSize(8).font("Helvetica").fillColor(SLATE).text(
    `${invoiceNumber} · Generated ${today} · AsR Logistics · asrlogistics.replit.app`,
    40, y + 10, { width: doc.page.width - 80, align: "center" }
  );

  doc.end();
}
