import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import WorldLogisticsMap from "./WorldLogisticsMap";
import MapLeaflet from "@/components/ui/mapleaflet";

interface PackageInfo {
  packageName: string;
  packageType: string;
  packageDescription: string;
  weight: string;
  dimensions: string;
  trackingNumber: string;
  deliveryInstructions?: string;
  deliveryDate?: string;
  deliveryfee: number;
  receivedAt?: string;
  toBeDeliveredAt?: string;
  location: string;
  latitude: string;
  longitude: string;
  status: string;
  senderFullName: string;
  senderEmail: string;
  senderPhoneNo?: string;
  senderAddress: string;
  receiverFullName: string;
  receiverEmail: string;
  receiverPhoneNo?: string;
  receiverAddress: string;
}


/* ---------------- SAMPLE LIVE ROUTES ---------------- */
const liveRoutes = [
  { id: 1, from: "USA", to: "Germany", status: "In Transit" },
  { id: 2, from: "Brazil", to: "UK", status: "In Transit" },
  { id: 3, from: "India", to: "USA", status: "Delayed" },
];



export default function Track() {
  const { id } = useParams<{ id: string}>();
  const navigate = useNavigate();
  const [info, setInfo] = useState<PackageInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      // call API to fetch status
      fetch(`http://localhost:3000/api/track/${id?.toUpperCase()}`)
        .then((r) => {
          if (!r.ok) {
            // backend should return 404 for missing tracking number
            setError("Package not found");
            return;
          }
          return r.json();
        })
        .then((data) => {
          setInfo(data);
        })
        .catch((err) => {
          setError(err.message || "Unable to fetch package information");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

    return (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-5xl mx-auto px-6 py-8">
      
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-600 hover:text-black"
      >
        ← Back
      </Button>

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Tracking Details
        </h1>
        <p className="text-gray-500 mt-1">
          View shipment and delivery information
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-center">
          {error}
        </div>
      )}

      {info && (
        <Card className="shadow-lg border-0 rounded-2xl">
          <CardContent className="p-8 space-y-10">

            {/* Tracking Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Tracking Number</p>
                <h2 className="text-xl font-semibold">
                  #{info.trackingNumber}
                </h2>
              </div>

              {/* Status Badge */}
              <span
                className={`px-4 py-1 text-sm font-medium rounded-full ${
                  info.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : info.status === "In Transit"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {info.status}
              </span>
            </div>

            {/* Section Divider */}
            <div className="border-t pt-8 space-y-8">

              {/* Package + Logistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Package Details */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Package Details
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium text-gray-800">Name:</span> {info.packageName}</p>
                    <p><span className="font-medium text-gray-800">Type:</span> {info.packageType}</p>
                    <p><span className="font-medium text-gray-800">Description:</span> {info.packageDescription}</p>
                    <p><span className="font-medium text-gray-800">Weight:</span> {info.weight}</p>
                    <p><span className="font-medium text-gray-800">Dimensions:</span> {info.dimensions}</p>
                    {info.deliveryInstructions && (
                      <p><span className="font-medium text-gray-800">Instructions:</span> {info.deliveryInstructions}</p>
                    )}
                    <p className="pt-2 text-base font-semibold text-gray-900">
                      Delivery Fee: ${info.deliveryfee}
                    </p>
                  </div>
                </div>

                {/* Logistics Info */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Logistics Information
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium text-gray-800">Current Location:</span> {info.location}</p>
                    {info.receivedAt && (
                      <p><span className="font-medium text-gray-800">Received:</span> {new Date(info.receivedAt).toLocaleString()}</p>
                    )}
                    {info.toBeDeliveredAt && (
                      <p><span className="font-medium text-gray-800">Expected Delivery:</span> {new Date(info.toBeDeliveredAt).toLocaleString()}</p>
                    )}
                    {info.deliveryDate && (
                      <p><span className="font-medium text-gray-800">Scheduled Date:</span> {new Date(info.deliveryDate).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sender + Receiver */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Sender */}
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Sender Information
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium text-gray-800">Name:</span> {info.senderFullName}</p>
                    <p><span className="font-medium text-gray-800">Email:</span> {info.senderEmail}</p>
                    {info.senderPhoneNo && (
                      <p><span className="font-medium text-gray-800">Phone:</span> {info.senderPhoneNo}</p>
                    )}
                    <p><span className="font-medium text-gray-800">Address:</span> {info.senderAddress}</p>
                  </div>
                </div>

                {/* Receiver */}
                <div className="bg-white border rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Receiver Information
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium text-gray-800">Name:</span> {info.receiverFullName}</p>
                    <p><span className="font-medium text-gray-800">Email:</span> {info.receiverEmail}</p>
                    {info.receiverPhoneNo && (
                      <p><span className="font-medium text-gray-800">Phone:</span> {info.receiverPhoneNo}</p>
                    )}
                    <p><span className="font-medium text-gray-800">Address:</span> {info.receiverAddress}</p>
                  </div>
                </div>

              </div>
            </div>

                  {/* ================= LIVE FEED ================= */}
                  <div className="mt-12 p-6 rounded-xl border border-slate-200">
                    <h3 className="text-xl font-semibold mb-6 text-gray-800">Live Shipment Feed</h3>

                    {/* <WorldLogisticsMap /> */}
                    <MapLeaflet latitude={Number(info?.latitude)} longitude={Number(info?.longitude)} location={info?.location} />
                    <div className="space-y-4 py-6">
                      {liveRoutes.map(route => (
                        <div
                          key={route.id}
                          className="flex justify-between items-center bg-slate-800 p-4 rounded-lg"
                        >
                          <span className="text-white">
                            {route.from} → {route.to}
                          </span>
                          <span className="text-white">Remark</span>
                          <span
                            className={`text-sm font-medium ${
                              route.status === "Delayed"
                                ? "text-yellow-400"
                                : "text-blue-400"
                            }`}
                          >
                            {route.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
          </CardContent>
        </Card>
      )}

    </div>
  </div>
);
}
