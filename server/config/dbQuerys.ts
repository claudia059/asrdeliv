import { admin, company_settings, packages, users } from "../shared/schema"
import { db } from "./config"
import { eq } from "drizzle-orm"


// Instead of manually rewriting all fields, use:
// typeof packages.$inferInsert

export type Admin = typeof admin.$inferSelect;

export const getAdminByEmail = async (
  email: string
) => {
  try {
    const [adminUser] = await db
      .select()
      .from(admin)
      .where(eq(admin.email, email));

    return adminUser ?? null;
  } catch (error) {
    console.error("Error fetching admin:", error);
    throw new Error("Failed to fetch admin");
  }
};

export type User = typeof users.$inferSelect;

export const getUserByUsername = async (
  username: string
): Promise<User | null> => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    return user ?? null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
};


export const getAllPackage = async () => {
  try {
    const allPackages = await db
    .select()
    .from(packages);
    
    return allPackages;
  } catch (error) {
    console.error("Error fetching package:", error);
    throw new Error("Failed to fetch package");
  }
};

// getPackageByTrackingNumber

export const getPackageByTrackingNumber = async (
  trackingNumber: string
): Promise<Package | null> => {
  try {
    const [pkg] = await db
      .select()
      .from(packages)
      .where(eq(packages.trackingNumber, trackingNumber));
      
      return pkg ;
    } catch (error) {
    console.error("Error fetching package:", error);
    throw new Error("Failed to fetch package");
  }
};

export const trackingPackage = async (trackingNumber: string): Promise<Package | null> => {
  // console.log("Tracking package with number:", trackingNumber);
  try {
    const pkg = await db.select().from(packages).where(eq(packages.trackingNumber, trackingNumber));
      
    if (pkg.length === 0) {
        return null;
      }
      return pkg[0];
  } catch (error) {
    console.error("Error tracking package:", error);
    throw new Error("Failed to track package");
  }
};

// insertPackage

export type InsertPackage = typeof packages.$inferInsert;
export type Package = typeof packages.$inferSelect;

export const insertPackage = async (
  packageData: InsertPackage
): Promise<Package> => {
  try {
    const existing = await getPackageByTrackingNumber(
      packageData.trackingNumber
    );

    if (existing) {
      return 0 as unknown as Package; // Return a default value or handle it as needed
    }

    const [newPackage] = await db.insert(packages).values(packageData).returning();

    return newPackage;
  } catch (error) {
    console.error("Error inserting package:", error);
    return 0 as unknown as Package; // Return a default value or handle it as needed
  }
};

// updatePackage

export const updatePackage  = async (  packageData: InsertPackage) => {
  try {
    const r = await db.update(packages).set(packageData).where(eq(packages.trackingNumber, packageData.trackingNumber)).returning();
    if(r.length === 0) return null;
    return r[0];
  } catch (error) {
    console.error("Error updating package:", error);
    throw new Error("Failed to update package");
  }
}


// patch package

export const patchPackage  = async (  packageData: Partial<InsertPackage> & {trackingNumber: string}) => {
  try {
    const r = await db.update(packages).set(packageData).where(eq(packages.trackingNumber, packageData.trackingNumber)).returning();  
    if(r.length === 0) return null;
    return r[0];
  } catch (error) {
    console.error("Error updating package:", error);
    throw new Error("Failed to update package");
  }
}

// deletePackage

export const deletePackage = async (deletePackage:string) => {
  try {
    const r = await db.delete(packages).where(eq(packages.trackingNumber, deletePackage)).returning();
        if (r.length === 0) {
            return null;
          }
        return true;
  } catch (error) {
    console.error("Error deleting Number :", error);
    throw new Error("Failed to deleting package");
    
  }
}

// tracking


export const trackingNumberExists = async (trackingNumber: string): Promise<Package | null> => {
  // console.log("Tracking package with number:", trackingNumber);
  try {
    const pkg = await db.select().from(packages).where(eq(packages.trackingNumber, trackingNumber));
      
    if (pkg.length === 0) {
        return null;
      }
    return pkg[0];
  } catch (error) {
    console.error("Error Tracking Number :", error);
    throw new Error("Failed to Tracking Number");
  }
};




// /auth/setting


export async function fetchSettings(){
  try {
    const r = await db.select().from(company_settings);
    if(r.length === 0) return null;
    return r;
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
}

// update settings

export async function updateSetting(setting:string, settingVal: string){
  try {
    const r = await db.update(company_settings).set({[setting]: settingVal}).returning();
    if(r.length === 0) return null;
    return r[0];
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
}

interface SettingsState {
    companyName: string;
    companyAddress: string;
    companyPhone: string;
    companyEmail: string;
    TrackingPrefix: string;
}

export async function UpdateSettings(settings: SettingsState) {
  try {
    const r = await db.update(company_settings).set(settings).returning();
    if(r.length === 0) return null;
    return r[0];
  } catch (error) {
    console.error("Error: ", error);
    return null;
  } 
}
