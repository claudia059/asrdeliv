import { Router, type IRouter } from "express";
import { db, shipmentsTable, trackingHistoryTable } from "../db/src/index.js";
import { eq, desc, and, gte, sql, count } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";
import { GetRecentActivityQueryParams } from "../api-zod/src/index.js";

const router: IRouter = Router();

router.get("/dashboard/stats", requireAuth, async (_req, res): Promise<void> => {
  const [stats] = await db
    .select({
      totalShipments: count(),
      inTransit: sql<number>`SUM(CASE WHEN status = 'In Transit' THEN 1 ELSE 0 END)::int`,
      delivered: sql<number>`SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END)::int`,
      pending: sql<number>`SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END)::int`,
      delayed: sql<number>`SUM(CASE WHEN status = 'Delayed' THEN 1 ELSE 0 END)::int`,
      outForDelivery: sql<number>`SUM(CASE WHEN status = 'Out for Delivery' THEN 1 ELSE 0 END)::int`,
    })
    .from(shipmentsTable);

  res.json({
    totalShipments: stats.totalShipments ?? 0,
    inTransit: stats.inTransit ?? 0,
    delivered: stats.delivered ?? 0,
    pending: stats.pending ?? 0,
    delayed: stats.delayed ?? 0,
    outForDelivery: stats.outForDelivery ?? 0,
  });
});

router.get("/dashboard/activity", requireAuth, async (req, res): Promise<void> => {
  const params = GetRecentActivityQueryParams.safeParse(req.query);
  const limit = params.success ? (params.data.limit ?? 10) : 10;

  const history = await db
    .select({
      id: trackingHistoryTable.id,
      status: trackingHistoryTable.status,
      location: trackingHistoryTable.location,
      description: trackingHistoryTable.description,
      createdAt: trackingHistoryTable.createdAt,
      trackingNumber: shipmentsTable.trackingNumber,
    })
    .from(trackingHistoryTable)
    .innerJoin(shipmentsTable, eq(trackingHistoryTable.shipmentId, shipmentsTable.id))
    .orderBy(desc(trackingHistoryTable.createdAt))
    .limit(limit);

  res.json(
    history.map((h: any) => ({
      id: h.id,
      trackingNumber: h.trackingNumber,
      action: "Status Update",
      status: h.status,
      location: h.location,
      description: h.description,
      createdAt: h.createdAt.toISOString(),
    })),
  );
});

router.get("/dashboard/chart", requireAuth, async (_req, res): Promise<void> => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const rows = await db
    .select({
      date: sql<string>`DATE(created_at)::text`,
      total: count(),
      delivered: sql<number>`SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END)::int`,
      inTransit: sql<number>`SUM(CASE WHEN status = 'In Transit' THEN 1 ELSE 0 END)::int`,
    })
    .from(shipmentsTable)
    .where(gte(shipmentsTable.createdAt, thirtyDaysAgo))
    .groupBy(sql`DATE(created_at)`)
    .orderBy(sql`DATE(created_at)`);

  res.json(
    rows.map((r: any) => ({
      date: r.date,
      total: r.total,
      delivered: r.delivered ?? 0,
      inTransit: r.inTransit ?? 0,
    })),
  );
});

export default router;
