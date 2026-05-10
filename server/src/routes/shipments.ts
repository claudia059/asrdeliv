import { Router, type IRouter } from "express";
import { db, shipmentsTable, trackingHistoryTable } from "../db/src";
import { eq, like, or, desc, sql, count } from "drizzle-orm";
import {
  CreateShipmentBody,
  UpdateShipmentBody,
  ListShipmentsQueryParams,
  AddTrackingHistoryBody,
} from "../api-zod/src";
import { requireAuth, generateTrackingNumber } from "../lib/auth";
import { io } from "../app";
import {
  sendShipmentRegisteredEmail,
  sendShipmentUpdatedEmail,
  type ShipmentEmailData,
} from "../lib/email";
import { generateReceiptPdf, generateInvoicePdf } from "../lib/pdf";

const router: IRouter = Router();

function formatShipment(s: any) {
  return {
    ...s,
    latitude: s.latitude ?? null,
    longitude: s.longitude ?? null,
    weight: s.weight ?? null,
    imageUrl: s.imageUrl ?? null,
    estimatedDelivery: s.estimatedDelivery ?? null,
    createdAt: s.createdAt instanceof Date ? s.createdAt.toISOString() : s.createdAt,
    updatedAt: s.updatedAt instanceof Date ? s.updatedAt.toISOString() : s.updatedAt,
  };
}

function toEmailData(s: any): ShipmentEmailData {
  return {
    trackingNumber: s.trackingNumber,
    receiverName: s.receiverName,
    receiverEmail: s.receiverEmail ?? "",
    senderName: s.senderName,
    origin: s.origin,
    destination: s.destination,
    status: s.status,
    currentLocation: s.currentLocation,
    luggageType: s.luggageType,
    weight: s.weight ?? null,
    estimatedDelivery: s.estimatedDelivery ?? null,
    description: s.description ?? null,
  };
}

// List shipments with pagination, search, and filter
router.get("/shipments", requireAuth, async (req, res): Promise<void> => {
  const params = ListShipmentsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message, issues: params.error.issues });
    return;
  }

  const { page = 1, limit = 20, search, status } = params.data;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (search) {
    conditions.push(
      or(
        like(shipmentsTable.trackingNumber, `%${search}%`),
        like(shipmentsTable.senderName, `%${search}%`),
        like(shipmentsTable.receiverName, `%${search}%`),
        like(shipmentsTable.origin, `%${search}%`),
        like(shipmentsTable.destination, `%${search}%`),
      ),
    );
  }
  if (status) {
    conditions.push(eq(shipmentsTable.status, status));
  }

  const whereClause = conditions.length > 0
    ? conditions.reduce((a, b) => sql`${a} AND ${b}`)
    : undefined;

  const [{ total }] = await db
    .select({ total: count() })
    .from(shipmentsTable)
    .where(whereClause);

  const shipments = await db
    .select()
    .from(shipmentsTable)
    .where(whereClause)
    .orderBy(desc(shipmentsTable.createdAt))
    .limit(limit)
    .offset(offset);

  res.json({
    shipments: shipments.map(formatShipment),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

// Export CSV
router.get("/shipments/export/csv", requireAuth, async (req, res): Promise<void> => {
  const shipments = await db
    .select()
    .from(shipmentsTable)
    .orderBy(desc(shipmentsTable.createdAt));

  const headers = [
    "Tracking Number", "Sender", "Receiver", "Origin", "Destination",
    "Status", "Current Location", "Weight", "Type", "ETA", "Created"
  ];

  const rows = shipments.map((s) => [
    s.trackingNumber, s.senderName, s.receiverName, s.origin, s.destination,
    s.status, s.currentLocation, s.weight ?? "", s.luggageType,
    s.estimatedDelivery ?? "", s.createdAt.toISOString()
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="shipments.csv"');
  res.send(csv);
});

// Get single shipment (with history)
router.get("/shipments/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [shipment] = await db
    .select()
    .from(shipmentsTable)
    .where(eq(shipmentsTable.id, id))
    .limit(1);

  if (!shipment) {
    res.status(404).json({ error: "Shipment not found" });
    return;
  }

  const history = await db
    .select()
    .from(trackingHistoryTable)
    .where(eq(trackingHistoryTable.shipmentId, id))
    .orderBy(trackingHistoryTable.createdAt);

  res.json({
    ...formatShipment(shipment),
    history: history.map((h) => ({
      ...h,
      latitude: h.latitude ?? null,
      longitude: h.longitude ?? null,
      createdAt: h.createdAt.toISOString(),
    })),
  });
});

// Download receipt PDF (auth protected)
router.get("/shipments/:id/receipt", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params?.id) ? req.params.id[0] : (req.params?.id || ""), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [shipment] = await db.select().from(shipmentsTable).where(eq(shipmentsTable.id, id)).limit(1);
  if (!shipment) { res.status(404).json({ error: "Shipment not found" }); return; }

  const history = await db
    .select()
    .from(trackingHistoryTable)
    .where(eq(trackingHistoryTable.shipmentId, id))
    .orderBy(trackingHistoryTable.createdAt);

  generateReceiptPdf(res, {
    ...formatShipment(shipment),
    history: history.map(h => ({
      ...h,
      createdAt: h.createdAt.toISOString(),
    })),
  });
});

// Download invoice PDF (auth protected)
router.get("/shipments/:id/invoice", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params?.id) ? req.params.id[0] : (req.params?.id || ""), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [shipment] = await db.select().from(shipmentsTable).where(eq(shipmentsTable.id, id)).limit(1);
  if (!shipment) { res.status(404).json({ error: "Shipment not found" }); return; }

  const history = await db
    .select()
    .from(trackingHistoryTable)
    .where(eq(trackingHistoryTable.shipmentId, id))
    .orderBy(trackingHistoryTable.createdAt);

  generateInvoicePdf(res, {
    ...formatShipment(shipment),
    history: history.map(h => ({
      ...h,
      createdAt: h.createdAt.toISOString(),
    })),
  });
});

// Public receipt PDF (via tracking number — no auth)
router.get("/shipments/:id/receipt/public", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [shipment] = await db.select().from(shipmentsTable).where(eq(shipmentsTable.id, id)).limit(1);
  if (!shipment) { res.status(404).json({ error: "Shipment not found" }); return; }

  const history = await db
    .select()
    .from(trackingHistoryTable)
    .where(eq(trackingHistoryTable.shipmentId, id))
    .orderBy(trackingHistoryTable.createdAt);

  generateReceiptPdf(res, {
    ...formatShipment(shipment),
    history: history.map(h => ({
      ...h,
      createdAt: h.createdAt.toISOString(),
    })),
  });
});

// Create shipment
router.post("/shipments", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateShipmentBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message, issues: parsed.error.issues });
    return;
  }


  const trackingNumber = generateTrackingNumber();
  const [shipment] = await db
    .insert(shipmentsTable)
    .values({ ...parsed.data, trackingNumber })
    .returning();

  // Auto-add initial history
  await db.insert(trackingHistoryTable).values({
    shipmentId: shipment.id,
    status: parsed.data.status,
    location: parsed.data.currentLocation || parsed.data.origin,
    description: `Shipment created and registered in the system`,
    latitude: parsed.data.latitude ?? null,
    longitude: parsed.data.longitude ?? null,
  });

  io.emit("shipment:created", formatShipment(shipment));

  // Send registration email to receiver
  sendShipmentRegisteredEmail(toEmailData(shipment));

  res.status(201).json(formatShipment(shipment));
});

// Update shipment
router.put("/shipments/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parsed = UpdateShipmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message, issues: parsed.error.issues });
    return;
  }

  // Get old shipment to detect location/status changes
  const [oldShipment] = await db.select().from(shipmentsTable).where(eq(shipmentsTable.id, id)).limit(1);

  const [shipment] = await db
    .update(shipmentsTable)
    .set(parsed.data)
    .where(eq(shipmentsTable.id, id))
    .returning();

  if (!shipment) {
    res.status(404).json({ error: "Shipment not found" });
    return;
  }

  io.emit("shipment:updated", formatShipment(shipment));

  // Send update email if status or location changed
  const statusChanged = oldShipment && parsed.data.status && parsed.data.status !== oldShipment.status;
  const locationChanged = oldShipment && parsed.data.currentLocation && parsed.data.currentLocation !== oldShipment.currentLocation;
  if ((statusChanged || locationChanged) && shipment?.receiverEmail) {
    sendShipmentUpdatedEmail(toEmailData(shipment));
  }

  res.json(formatShipment(shipment));
});

// Delete shipment
router.delete("/shipments/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [deleted] = await db
    .delete(shipmentsTable)
    .where(eq(shipmentsTable.id, id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Shipment not found" });
    return;
  }

  io.emit("shipment:deleted", { id });
  res.sendStatus(204);
});

// Add tracking history entry
router.post("/shipments/:id/history", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [shipment] = await db
    .select()
    .from(shipmentsTable)
    .where(eq(shipmentsTable.id, id))
    .limit(1);

  if (!shipment) {
    res.status(404).json({ error: "Shipment not found" });
    return;
  }

  const parsed = AddTrackingHistoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message, issues: parsed.error.issues });
    return;
  }

  const [entry] = await db
    .insert(trackingHistoryTable)
    .values({ shipmentId: id, ...parsed.data })
    .returning();

  // Also update shipment location/status
  const [updated] = await db
    .update(shipmentsTable)
    .set({
      currentLocation: parsed.data.location,
      status: parsed.data.status,
      ...(parsed.data.latitude != null ? { latitude: parsed.data.latitude } : {}),
      ...(parsed.data.longitude != null ? { longitude: parsed.data.longitude } : {}),
    })
    .where(eq(shipmentsTable.id, id))
    .returning();

  io.emit("shipment:location", {
    shipmentId: id,
    trackingNumber: shipment.trackingNumber,
    status: parsed.data.status,
    location: parsed.data.location,
    latitude: parsed.data.latitude,
    longitude: parsed.data.longitude,
  });

  // Send update email to receiver
  if (updated && shipment?.receiverEmail) {
    sendShipmentUpdatedEmail(toEmailData(updated));
  }

  res.status(201).json({
    ...entry,
    latitude: entry.latitude ?? null,
    longitude: entry.longitude ?? null,
    createdAt: entry.createdAt.toISOString(),
  });
});

export default router;
