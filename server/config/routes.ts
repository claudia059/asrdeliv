import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { trackingPackage, getAdminByEmail, getAllPackage, trackingNumberExists, insertPackage, updatePackage, deletePackage, fetchSettings, UpdateSettings, updateSetting, patchPackage } from "./dbQuerys";
import bcrypt  from "bcrypt";
import  {accessToken, accessVerify, removeToken } from "./jwt";
import { AuthmiddleWare } from "./AuthmiddleWare";

export async function registerRoutes(app: Express): Promise<Server> {
  // Prefix all routes with /api
  const api = "/api";

  /**
   * =========================
   * Auth Routes
   * =========================
   */


  // Login
  app.post(`${api}/auth/login`, async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const user = await getAdminByEmail(email);

      if (user === null) {
        return res.status(401).json({ message: "Invalid user" });
      }
      
      const r = await bcrypt.compare(password, user.password);
      
      if (!r) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = await accessToken(user.email);
      const nd = process.env.NODE_ENV === "production" ? true : false;
      res.cookie("tooken", token, {
        httpOnly: true,
        secure: nd,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
      });

     return res.status(200).json({ message: "Login successful", userEmail: user.email });
    } catch (err) {
     return res.status(500).json({ message: "Login failed" });
    }
  });


  // logut  


  app.post(`${api}/auth/logout`, async (req: Request, res: Response) =>  {
    try {
      const token  =  req.cookies?.token;

      const nd = process.env.NODE_ENV === "production" ? true : false;
      res.clearCookie("tooken", {
        httpOnly: true,
        secure: nd,
        sameSite: "strict",
        path: '/'
      });

     return res.status(200).json({ message: "Logout successful", logout: true });
    } catch (err) {
     return res.status(500).json({ message: "Login failed" });
    }
  })

  // admin

app.get(`${api}/auth/admin`, AuthmiddleWare, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user?.email) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const admin = await getAdminByEmail(user.email);

    return res.status(200).json({
      name: admin.name,
      email: admin.email
    });
  } catch (err) {
    console.log("AsrErr: " + err);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
});
  
  // all package
  
  app.get( `${api}/auth/packages`, async (req: Request, res: Response) => {
    try {

      const packages = await getAllPackage();
      if(!packages){
        return res.status(401).json({message: "No package found"});
      }
      return res.status(200).json(packages);
    } catch (error) {
      console.log("AsrErr: " + error);
     return res.status(500).json({ message: "Failed to fetch packages" });
      
    }
  })

  // newPackage

  app.post(`${api}/auth/add/package`, async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const packages = {
        ...body,
        deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : undefined,
        receivedAt: body.receivedAt ? new Date(body.receivedAt) : undefined,
        toBeDeliveredAt: body.toBeDeliveredAt ? new Date(body.toBeDeliveredAt) : undefined,
        createdAt: body.createdAt ? new Date(body.createdAt) : undefined,
        updatedAt: body.updatedAt ? new Date(body.updatedAt) : undefined,
        deliveryfee: body.deliveryfee !== undefined ? Number(body.deliveryfee) : undefined,
      };

      const r = await insertPackage(packages);

          if(!r){
            return res.status(401).json({message: "error creating package"});
          }
        return res.status(200).json({message: " package created"});
      } catch (error) {
        console.log("AsrErr: " + error);
      return res.status(500).json({ message: "Failed to creating package" });
        
      }
  })

  // updatePackage
 
  app.put(`${api}/auth/update/package`, async (req: Request, res: Response) =>{
    try {
      const body = req.body;
      const packages = {
        ...body,
        deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : undefined,
        receivedAt: body.receivedAt ? new Date(body.receivedAt) : undefined,
        toBeDeliveredAt: body.toBeDeliveredAt ? new Date(body.toBeDeliveredAt) : undefined,
        createdAt: body.createdAt ? new Date(body.createdAt) : undefined,
        updatedAt: body.updatedAt ? new Date(body.updatedAt) : undefined,
        deliveryfee: body.deliveryfee !== undefined ? Number(body.deliveryfee) : undefined,
      };

      const r = await updatePackage(packages);
        if(!r){
            return res.status(401).json({message: "error updating package"});
          }
        return res.status(200).json({message: " package updated"});

      } catch (error) {
        console.log("AsrErr: " + error);
        return res.status(500).json({ message: "Failed to updating package" });
        
      }
  })

  app.patch(`${api}/auth/patch/package`, async (req: Request, res: Response) =>{
    try {
      const body = req.body;
      const packages = {
        ...body,
        deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : undefined,
        receivedAt: body.receivedAt ? new Date(body.receivedAt) : undefined,
        toBeDeliveredAt: body.toBeDeliveredAt ? new Date(body.toBeDeliveredAt) : undefined,
        createdAt: body.createdAt ? new Date(body.createdAt) : undefined,
        updatedAt: body.updatedAt ? new Date(body.updatedAt) : undefined,
        deliveryfee: body.deliveryfee !== undefined ? Number(body.deliveryfee) : undefined,
      };

      const r = await patchPackage(packages);
        if(!r){
            return res.status(401).json({message: "error updating package"});
          }
        return res.status(200).json({message: " package updated"});

      } catch (error) {
        console.log("AsrErr: " + error);
        return res.status(500).json({ message: "Failed to updating package" });
        
      }
  })
  
  
  // delete package
  
  app.delete(`${api}/auth/del/:trackingNumber`, async (req: Request, res: Response) =>{
    try {
      
      const trackingNumber = req.params.trackingNumber;
      const r = await deletePackage(trackingNumber);

        if(!r){
            return res.status(401).json({message: "error deleting package"});
          }
        return res.status(200).json({message: " package deleted"});

      } catch (error) {
        console.log("AsrErr: " + error);
        return res.status(500).json({ message: "Failed to deleting package" });
        
      }
  })


  // trackingNumber
  
  app.get( `${api}/auth/packages/:trackingNumber`, async (req: Request, res: Response) => {
    try {
      const trackingNumber = req.params.trackingNumber;
      if(!trackingNumber) return res.status(402).json({message: "No Tracking Number provided"});

      const packages = await trackingNumberExists(trackingNumber);

      if(!packages){
        return res.status(401).json({message: "No Tracking Number found"});
      }
      return res.status(200).json({shipment: packages, message: "Tracking Number  exists"});
    } catch (error) {
      console.log("AsrErr: " + error);
     return res.status(500).json({ message: "Failed to fetch Tracking Number" });
      
    }
  })

  app.get(`${api}/track/:id`, async (req: Request, res: Response) => {
    try {
      const  id  = req.params.id;
      const pkg = await trackingPackage(id);
     
      if (!pkg) {
        return res.status(404).json({ message: "Package not found" });
      }

      res.json(pkg);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch package information" });
    }
  });

  /**
   * =========================
   * User CRUD Routes
   * =========================
   */

  // Get all settings


  app.get(`${api}/auth/settings`, async (req:Request, res:Response) => {
    try {
      const r = await fetchSettings();
      if(!r) return res.status(401).json({message: "No settings found"});
      return res.status(200).json({settings: r});
    } catch (error) {
      console.error("Error: " + error);
      return res.status(501).json({message: "server error occured"})
    }
  })

  // update settings

  app.patch(`${api}/auth/patch/settings`, async (req:Request, res:Response) => {
    try {
      const {setting, settingVal} = req.body;
      if(!setting || !settingVal) return res.status(402).json({message: "Invalid setting or value"});
      const r = await updateSetting(setting, settingVal);
      if(!r) return res.status(401).json({message: "error updating settings"});
      return res.status(200).json({message: "settings updated"});
    } catch (error) {
      console.error("Error: " + error);
      return res.status(501).json({message: "server error occured"})
    }
  }
  )

  // UpdateSettings

  app.put(`${api}/auth/update/settings`, async (req:Request, res:Response) => {
    try {
      const body = req.body;
      const settings = {
        ...body,
        createdAt: body.createdAt ? new Date(body.createdAt) : undefined,
        updatedAt: body.updatedAt ? new Date(body.updatedAt) : undefined,
      };
      if(!settings) return res.status(402).json({message: "Invalid settings data"});
      const r = await UpdateSettings(settings);
      if(!r) return res.status(401).json({message: "error updating settings"});
      return res.status(200).json({message: "settings updated"});
    } catch (error) {
      console.error("Error: " + error);
      return res.status(501).json({message: "server error occured"})
    }
  }
  ) 
















  // app.get(`${api}/users`, async (_req: Request, res: Response) => {
  //   try {
  //     const users = await storage.getUsers();
  //     res.json(users);
  //   } catch {
  //     res.status(500).json({ message: "Failed to fetch users" });
  //   }
  // });

  // // Get user by ID
  // app.get(`${api}/users/:id`, async (req: Request, res: Response) => {
  //   try {
  //     const user = await storage.getUser(Number(req.params.id));

  //     if (!user) {
  //       return res.status(404).json({ message: "User not found" });
  //     }

  //     res.json(user);
  //   } catch {
  //     res.status(500).json({ message: "Failed to fetch user" });
  //   }
  // });

  // Update user
  // app.put(`${api}/users/:id`, async (req: Request, res: Response) => {
  //   try {
  //     const updated = await storage.updateUser(
  //       Number(req.params.id),
  //       req.body
  //     );

  //     if (!updated) {
  //       return res.status(404).json({ message: "User not found" });
  //     }

  //     res.json(updated);
  //   } catch {
  //     res.status(500).json({ message: "Failed to update user" });
  //   }
  // });

  // // Delete user
  // app.delete(`${api}/users/:id`, async (req: Request, res: Response) => {
  //   try {
  //     const deleted = await storage.deleteUser(Number(req.params.id));

  //     if (!deleted) {
  //       return res.status(404).json({ message: "User not found" });
  //     }

  //     res.status(204).send();
  //   } catch {
  //     res.status(500).json({ message: "Failed to delete user" });
  //   }
  // });


  const httpServer = createServer(app);
  return httpServer;
}