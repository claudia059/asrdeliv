import { db } from "../config/config";
import { admin, company_settings, office_locations, packages, types_of_deliveries } from "../shared/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

export default async function bootstrap() {
//   if(process.env.NODE_ENV === "development") return;
     if(process.env.BOOTSTRAP_ADMIN !== "true") {
    // console.log("BOOTSTRAP_ADMIN is not set to true. Skipping admin user creation.");   
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "adminpassword", 10) ;

  if (!adminEmail || !adminPassword) {  
    console.warn("Admin credentials not provided. Skipping admin user creation.");
    return;
  }


 const existingAdmin = await db.select().from(admin).where(eq(admin.email, adminEmail));

  if (existingAdmin.length > 0) {
    console.log("Admin user already exists. Skipping creation.");
    return;
  }

   const success = await db.insert(admin).values({
      name: "Admin",
      email: adminEmail,
      password: adminPassword
    });

    if (success) {
        console.log("Admin user created successfully.");
    } else {
        console.error("Failed to create admin user.");
    }

    // compnay info

    await db.insert(company_settings).values({
      companyName: "ASR Delivery",
      companyAddress: "123 Main St, Cityville",
      companyPhone: "555-1234",
      TrackingPrefix: "TRK",
      companyEmail: "admin@asrdelivery.com",
    });

    await db.insert(office_locations).values({
      locationName: "Main Office",
      address: "123 Main St, Cityville",
    });

    await db.insert(types_of_deliveries).values({
      deliveryType: "Air Freight",
      description: "Standard delivery service",
    });

    const newPackage = await db.insert(packages).values({
      packageName: "Electronics",
      packageType: "Express",
      packageDescription: "Fragile electronic items",
      weight: "2kg",
      dimensions: "10x10x5",
      trackingNumber: "TRK123",
      deliveryInstructions: "Leave at door",
      deliveryDate: new Date(),
      deliveryfee: 25,
      receivedAt: new Date(),
      toBeDeliveredAt: new Date(),
      location: "Warehouse A",
      latitude: "40.7128",
      longitude: "-74.0060",
      status: "Pending",
      senderFullName: "John",
      senderEmail: "john@example.com",
      senderPhoneNo: "123456789",
      senderAddress: "NY",
      receiverFullName: "Jane",
      receiverEmail: "jane@example.com",
      receiverPhoneNo: "987654321",
      receiverAddress: "LA",
    });

//   console.log("Bootstrapping the database with initial data...");
}
