import api from "@/lib/queryClient";

export async function fetchAllShip() {
  try {
    const packages = await api.get("/auth/packages");
    const data = await packages.data;

    if (!Array.isArray(data)) {
      return [];
    }

    return data;
  } catch (error) {
    console.log("asrerroe: " + error);
    return [];
  }
}

// export function useService(id: number) {
  export async function TrackingExists(TrkNo:string) {
    try {
       const r = await api.get(`/auth/packages/${TrkNo}`);
       
       if(!r){
        return null;
      }
      return r.data?.shipment;
    } catch (error) {
      console.log("asrerroe: " + error);
      return null;
   }
}

// export function useCreateService()

interface PackageData {
    packageName: string,
    packageType: string,
    packageDescription: string,
    weight: string,
    dimensions: string,
    trackingNumber: string,
    deliveryfee: number,
    location: string,
    status: string,
    senderFullName: string,
    senderEmail: string,
    senderAddress: string,
    receiverFullName: string,
    receiverEmail: string,
    receiverAddress: string,
    deliveryInstructions?: string | null | undefined,
    deliveryDate?: Date | null | undefined,
    receivedAt?: Date | null | undefined,
    toBeDeliveredAt?: Date | null | undefined,
    senderPhoneNo?: string | null | undefined,
    receiverPhoneNo?: string 
}

export async function useCreateShipment(packageData: PackageData){
      try {
        const r =  await api.post("/auth/add/package", packageData);
        if(!r){
          return null;
        }
        return r.data;
      } catch (error) {
        console.log("ASRerror: "+error);
        return false;
      }
}

export type UpdatePackageData = Partial<PackageData> & {
  trackingNumber: string;
};

// useUpdateShipment

export async function useUpdateShipment(packageData: UpdatePackageData){
      try {
        const r =  await api.put("/auth/update/package", packageData);
        if(!r){
          return null;
        }
        return r.data;
      } catch (error) {
        console.log("ASRerror: "+error);
        return false;
      }
}

// useUpdateShipmentLocation

export async function useUpdateShipmentLocation(trackingNumber:string, location:string, latitude:string, longitude:string, status:string){
      try {
        const r =  await api.patch("/auth/patch/package", {trackingNumber, location, latitude, longitude, status}); 
        if(!r){
          return null;
        }
        return r.data;
      } catch (error) {
        console.log("ASRerror: "+error);
        return false;
      }
}

// useDeleteShipment

export async function useDeleteShipment(trackingNumber:string) {
  try {
    const r = await api.delete(`/auth/del/${trackingNumber}`);
    if(r ){
      return true;
    }
    return false;
  } catch (error) {
    console.log(`ASRerro: ${error}`);
    return null;
  }
}

// export function useCreateService() {
//   const queryClient = useQueryClient();
//   const { toast } = useToast();
  
//   return useMutation({
//     mutationFn: async (data: InsertService) => {
//       const validated = api.services.create.input.parse(data);
//       const res = await authFetch(api.services.create.path, {
//         method: api.services.create.method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(validated),
//       });
//       if (!res.ok) throw new Error("Failed to create service");
//       return api.services.create.responses[201].parse(await res.json());
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: [api.services.list.path] });
//       toast({ title: "Success", description: "Service created successfully" });
//     },
//     onError: (err) => {
//       toast({ title: "Error", description: err.message, variant: "destructive" });
//     }
//   });
// }

// export function useUpdateService() {
//   const queryClient = useQueryClient();
//   const { toast } = useToast();

//   return useMutation({
//     mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertService>) => {
//       const validated = api.services.update.input.parse(updates);
//       const url = buildUrl(api.services.update.path, { id });
//       const res = await authFetch(url, {
//         method: api.services.update.method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(validated),
//       });
//       if (!res.ok) throw new Error("Failed to update service");
//       return api.services.update.responses[200].parse(await res.json());
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: [api.services.list.path] });
//       toast({ title: "Success", description: "Service updated successfully" });
//     },
//     onError: (err) => {
//       toast({ title: "Error", description: err.message, variant: "destructive" });
//     }
//   });
// }

// export function useDeleteService() {
//   const queryClient = useQueryClient();
//   const { toast } = useToast();

//   return useMutation({
//     mutationFn: async (id: number) => {
//       const url = buildUrl(api.services.delete.path, { id });
//       const res = await authFetch(url, { 
//         method: api.services.delete.method,
//       });
//       if (!res.ok) throw new Error("Failed to delete service");
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: [api.services.list.path] });
//       toast({ title: "Success", description: "Service deleted successfully" });
//     },
//     onError: (err) => {
//       toast({ title: "Error", description: err.message, variant: "destructive" });
//     }
//   });
// }
