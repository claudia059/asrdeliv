import bcrypt from "bcrypt";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../db/src/schema";
import { eq } from "drizzle-orm";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function seed() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  const existing = await db
    .select()
    .from(schema.adminUsersTable)
    .where(eq(schema.adminUsersTable.role, "superadmin"))
    .limit(1);

  if (existing.length > 0){
    console.log("Admin user exists");
    return;
    
  } else {
    await db.insert(schema.adminUsersTable).values({
      name: "Admin User",
      email: "admin@asrlogistics.com",
      passwordHash,
      role: "superadmin",
    });
    console.log("Admin user created");
  }
}

export default seed;


// else {
//   await db
//     .update(schema.adminUsersTable)
//     .set({ passwordHash })
//     .where(eq(schema.adminUsersTable.email, "admin@asrlogistics.com"));
//   console.log("Admin user password updated");
// }

// seed().catch(console.error);
