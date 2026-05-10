import {
  pgTable,
  text,
  serial,
  timestamp,
  doublePrecision,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const shipmentsTable = pgTable("shipments", {
  id: serial("id").primaryKey(),
  trackingNumber: text("tracking_number").notNull().unique(),
  senderName: text("sender_name").notNull(),
  receiverName: text("receiver_name").notNull(),
  receiverEmail: text("receiver_email"),
  senderEmail: text("sender_email"),
  receivePhone: text("receiver_phone"),
  senderPhone: text("sender_phone"),
  senderAddress: text("sender_address").notNull(),
  receiverAddress: text("receiver_address").notNull(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  currentLocation: text("current_location").notNull().default(""),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  status: text("status").notNull().default("Pending"),
  estimatedDelivery: text("estimated_delivery"),
  weight: doublePrecision("weight"),
  luggageType: text("luggage_type").notNull().default("Package"),
  description: text("description"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertShipmentSchema = createInsertSchema(shipmentsTable).omit({
  id: true,
  trackingNumber: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertShipment = z.infer<typeof insertShipmentSchema>;
export type Shipment = typeof shipmentsTable.$inferSelect;

export const trackingHistoryTable = pgTable("tracking_history", {
  id: serial("id").primaryKey(),
  shipmentId: integer("shipment_id")
    .notNull()
    .references(() => shipmentsTable.id, { onDelete: "cascade" }),
  status: text("status").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTrackingHistorySchema = createInsertSchema(trackingHistoryTable).omit({
  id: true,
  createdAt: true,
});
export type InsertTrackingHistory = z.infer<typeof insertTrackingHistorySchema>;
export type TrackingHistory = typeof trackingHistoryTable.$inferSelect;
