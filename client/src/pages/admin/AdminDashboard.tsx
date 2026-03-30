import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Shippments from "./shippments";
import { useEffect, useState } from "react";
import { fetchAllShip } from "@/hooks/use-shippments";

export default function AdminDashboard() {
  const [totalShipments, setTotalShipments] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the server (replace with your actual API endpoint)
        const response = await fetchAllShip();
        setTotalShipments(response.length);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="h-full overflow-y-auto p-6 custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Current Administration Status */}
        <Card className="bg-white dark:bg-stone-800 border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-stone-900 dark:text-white">
              Administration Board
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Plan Information */}
              <div className="space-y-4">
                <div className="bg-stone-50 dark:bg-stone-700/30 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-stone-900 dark:text-white mb-3">Shipments</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-normal text-stone-700 dark:text-stone-300">Total</span>
                      <Badge variant="default">
                        {totalShipments ? totalShipments : "0"  }
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Information */}
              <div className="space-y-4">
                <div className="bg-stone-50 dark:bg-stone-700/30 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-stone-900 dark:text-white mb-3">Usage</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-normal text-stone-700 dark:text-stone-300">Active</span>
                        <span className="text-sm text-stone-900 dark:text-white">
                          unlimited
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4 sm:col-span-2 lg:col-span-1">
                <div className="bg-stone-50 dark:bg-stone-700/30 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-stone-900 dark:text-white mb-3">Settings & Actions</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-normal text-stone-700 dark:text-stone-300">Auto-renewal</span>
                      777777
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipment History */}
        <Shippments />
      </div>
    </div>
  );
}