import { useEffect, useState } from "react";
import api from "@/lib/queryClient";

export async function fetchAllShip() {
  try {
    const packages = await api.get("/auth/packages");
    const data = packages.data;

    if (!Array.isArray(data)) {
      return [];
    }

    return data;
  } catch (error) {
    console.log("asrerroe: " + error);
    return [];
  }
}

export async function TrackingExists(TrkNo: string) {
  try {
    const r = await api.get(`/auth/packages/${TrkNo}`);

    if (!r) {
      return null;
    }
    return r.data?.shipment;
  } catch (error) {
    console.log("asrerroe: " + error);
    return null;
  }
}

interface PackageData {
  packageName: string;
  packageType: string;
  packageDescription: string;
  weight: string;
  dimensions: string;
  trackingNumber: string;
  deliveryfee: number;
  location: string;
  status: string;
  senderFullName: string;
  senderEmail: string;
  senderAddress: string;
  receiverFullName: string;
  receiverEmail: string;
  receiverAddress: string;
  deliveryInstructions?: string | null | undefined;
  deliveryDate?: Date | null | undefined;
  receivedAt?: Date | null | undefined;
  toBeDeliveredAt?: Date | null | undefined;
  senderPhoneNo?: string | null | undefined;
  receiverPhoneNo?: string;
}

export async function useCreateShipment(packageData: PackageData) {
  try {
    const r = await api.post("/auth/add/package", packageData);
    if (!r) {
      return null;
    }
    return r.data;
  } catch (error) {
    console.log("ASRerror: " + error);
    return false;
  }
}

export type UpdatePackageData = Partial<PackageData> & {
  trackingNumber: string;
};

export async function useUpdateShipment(packageData: UpdatePackageData) {
  try {
    const r = await api.put("/auth/update/package", packageData);
    if (!r) {
      return null;
    }
    return r.data;
  } catch (error) {
    console.log("ASRerror: " + error);
    return false;
  }
}

export async function useUpdateShipmentLocation(
  trackingNumber: string,
  location: string,
  latitude: string,
  longitude: string,
  status: string
) {
  try {
    const r = await api.patch("/auth/patch/package", {
      trackingNumber,
      location,
      latitude,
      longitude,
      status,
    });
    if (!r) {
      return null;
    }
    return r.data;
  } catch (error) {
    console.log("ASRerror: " + error);
    return false;
  }
}

export async function useDeleteShipment(trackingNumber: string) {
  try {
    const r = await api.delete(`/auth/del/${trackingNumber}`);
    if (r) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(`ASRerro: ${error}`);
    return null;
  }
}

export function useServices() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchAllShip()
      .then((value) => {
        if (active) {
          setData(value);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { data, isLoading };
}

export function useCreateService() {
  return {
    mutateAsync: async (data: any) => useCreateShipment(data as any),
    isPending: false,
  };
}

export function useUpdateService() {
  return {
    mutateAsync: async (data: any) => useUpdateShipment(data as any),
    isPending: false,
  };
}

export function useDeleteService() {
  return {
    mutate: useDeleteShipment,
    isPending: false,
  };
}
