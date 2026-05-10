import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";


export const company_settings = pgTable("company_settings", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  companyAddress: text("company_address").notNull(),
  companyPhone: text("company_phone").notNull(),
  TrackingPrefix: text("tracking-prefix").default("TRK"),
  companyEmail: text("company_email").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const office_locations = pgTable("office_locations", {
  id: serial("id").primaryKey(),
  locationName: text("location_name").notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const delivery_personnel = pgTable("delivery_personnel", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phoneNo: text("phone_no"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const types_of_deliveries = pgTable("types_of_deliveries", {
  id: serial("id").primaryKey(),
  deliveryType: text("delivery_type").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const admin = pgTable("admin", {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  mobile: text("mobile"),
  location: text("location"),
  title: text("title"),
  bio: text("bio"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
});


// packages schema
// userId: integer("user_id")
//   .notNull()
//   .references(() => users.id, { onDelete: "cascade" }),

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),

  packageName: text("package_name").notNull(),
  packageType: text("package_type").notNull(),
  packageDescription: text("package_description").notNull(),
  weight: text("weight").notNull(),
  dimensions: text("dimensions").notNull(),
  trackingNumber: text("tracking_number").notNull().unique(),
  
  
  deliveryInstructions: text("delivery_instructions"),
  deliveryDate: timestamp("delivery_date", { withTimezone: true }),
  deliveryfee: integer("delivery_fee").notNull(),
  
  receivedAt: timestamp("received_at", { withTimezone: true })
  .defaultNow(),
  
  toBeDeliveredAt: timestamp("to_be_delivered_at", {
    withTimezone: true,
  }),
  
  location: text("location").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  
  status: text("status").notNull().default("pending"),

  senderFullName: text("sender_full_name").notNull(),
  senderEmail: text("sender_email").notNull(),
  senderPhoneNo: text("sender_phone_no"),
  senderAddress: text("sender_address").notNull(),

  receiverFullName: text("receiver_full_name").notNull(),
  receiverEmail: text("receiver_email").notNull(),
  receiverPhoneNo: text("receiver_phone_no"),
  receiverAddress: text("receiver_address").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const ShipmentFeedLogs = pgTable("ShipmentFeedLogs", {
  id: serial("id").primaryKey(),
  TrackingNumber: text("TrackingNumber").notNull(),
  Remark: text("Remark"),
  Status: text("Status").notNull(),
  Location: text("Location").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // info, success, warning, error
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});


export const insertPackageSchema = createInsertSchema(packages, {
  packageName: () => z.string().min(1, "Package name is required"),
  packageType: () => z.string().min(1, "Package type is required"),
  packageDescription: () => z.string().min(1, "Package description is required"),
  weight: () => z.string().min(1, "Weight is required"),
  dimensions: () => z.string().min(1, "Dimensions are required"),
  trackingNumber: () => z.string().min(1, "Tracking number is required"),
  deliveryInstructions: () => z.string().optional(),
  deliveryDate: () => z.date().optional(),
  deliveryfee: () => z.number().min(0, "Delivery fee must be a positive number"),
  receivedAt: () => z.date().optional(),
  toBeDeliveredAt: () => z.date().optional(),
  location: () => z.string().min(1, "Location is required"),
  status: () => z.string().min(1, "Status is required"),
  senderFullName: () => z.string().min(1, "Sender full name is required"),
  senderEmail: () => z.string().email("Invalid email address"),
  senderPhoneNo: () => z.string().optional(),
  senderAddress: () => z.string().min(1, "Sender address is required"),
  receiverFullName: () => z.string().min(1, "Receiver full name is required"),
  receiverEmail: () => z.string().email("Invalid email address"),
  receiverPhoneNo: () => z.string().optional(),
  receiverAddress: () => z.string().min(1, "Receiver address is required"),
})
.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCompanySettingsSchema = createInsertSchema(company_settings).pick({
  companyName: true,
  companyAddress: true,
  companyPhone: true,
  companyEmail: true,
});

export const insertOfficeLocationSchema = createInsertSchema(office_locations).pick({
  locationName: true,
  address: true,
});

export const insertDeliveryPersonnelSchema = createInsertSchema(delivery_personnel).pick({
  fullName: true,
  email: true,
  phoneNo: true,
});

export const insertTypesOfDeliveriesSchema = createInsertSchema(types_of_deliveries).pick({
  deliveryType: true,
  description: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
});

export const insertShipmentFeedLogsSchema = createInsertSchema(ShipmentFeedLogs).pick({
  TrackingNumber: true,
  Remark: true,
  Status: true,
  Location: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  title: true,
  message: true,
  type: true,
});

export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = typeof packages.$inferSelect;
export type InsertCompanySettings = z.infer<typeof insertCompanySettingsSchema>;
export type CompanySettings = typeof company_settings.$inferSelect;
export type InsertOfficeLocation = z.infer<typeof insertOfficeLocationSchema>;
export type OfficeLocation = typeof office_locations.$inferSelect;
export type InsertDeliveryPersonnel = z.infer<typeof insertDeliveryPersonnelSchema>;
export type DeliveryPersonnel = typeof delivery_personnel.$inferSelect;
export type InsertTypesOfDeliveries = z.infer<typeof insertTypesOfDeliveriesSchema>;
export type TypesOfDeliveries = typeof types_of_deliveries.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertShipmentFeedLogs = z.infer<typeof insertShipmentFeedLogsSchema>;
export type ShipmentFeedLogs = typeof ShipmentFeedLogs.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
