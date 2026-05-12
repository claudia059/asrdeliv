import { Router, type IRouter } from "express";
import { db, shipmentsTable, trackingHistoryTable } from "../db/src/index.js";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/track/:trackingNumber", async (req, res): Promise<void> => {
  const trackingNumber = Array.isArray(req.params.trackingNumber)
    ? req.params.trackingNumber[0]
    : req.params.trackingNumber;

  const [shipment] = await db
    .select()
    .from(shipmentsTable)
    .where(eq(shipmentsTable.trackingNumber, trackingNumber))
    .limit(1);

  if (!shipment) {
    res.status(404).json({ error: "Shipment not found" });
    return;
  }

  const history = await db
    .select()
    .from(trackingHistoryTable)
    .where(eq(trackingHistoryTable.shipmentId, shipment.id))
    .orderBy(trackingHistoryTable.createdAt);

  res.json({
    ...shipment,
    latitude: shipment.latitude ?? null,
    longitude: shipment.longitude ?? null,
    weight: shipment.weight ?? null,
    imageUrl: shipment.imageUrl ?? null,
    estimatedDelivery: shipment.estimatedDelivery ?? null,
    createdAt: shipment.createdAt.toISOString(),
    updatedAt: shipment.updatedAt.toISOString(),
    history: history.map((h: any) => ({
      ...h,
      latitude: h.latitude ?? null,
      longitude: h.longitude ?? null,
      createdAt: h.createdAt.toISOString(),
    })),
  });
});

export default router;
