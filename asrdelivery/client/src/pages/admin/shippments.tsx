import {useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Shipment } from "@/lib/types";
import { fetchAllShip, useDeleteShipment, useUpdateShipmentLocation } from "@/hooks/use-shippments";
import { Edit, Plus, Receipt, StampIcon, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import LocationUpdateModal from "./LocationUpdateModal";
const logoUrl = "https://img.freepik.com/premium-vector/frieght-forwarding-logistics-company-brand-logo_1152716-1403.jpg?semt=ais_hybrid&w=740&q=80";


export default function Shippments() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [locationInput, setLocationInput] = useState("");
  const [latitudeInput, setLatitudeInput] = useState("");
  const [longitudeInput, setLongitudeInput] = useState("");
  const [statusInput, setStatusInput] = useState("");
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptShipment, setReceiptShipment] = useState<Shipment | null>(null);
  const navigation = useNavigate();


  const DeleteShipment = async (track:string = "") => {
      if(!track) return;
      if(!confirm(`Are you sure, you want to delete this shipment: ${track}`)) return;
      try {

        const r = await useDeleteShipment(track);
        if(r){
          toast({
            title: "Shipment Deleted",
            description: `Shipment ${track} have been deleted successfully`,
            variant: "default"
          });

          return;
        }else{
          toast({
            title: "Unable To Delete",
            description: `unable to delete Shipment ${track} `,
            variant: "destructive"
          })
        }
        return;
      } catch (error) {
        console.log(error);
        return;
      }
    }

  const openLocationModal = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setLocationInput(shipment.location ?? "");
    setLatitudeInput(shipment.latitude ?? "");
    setLongitudeInput(shipment.longitude ?? "");
    setStatusInput(shipment.status ?? "");
    setIsLocationModalOpen(true);
  };

  const closeLocationModal = () => {
    setIsLocationModalOpen(false);
    setSelectedShipment(null);
    setLocationInput("");
    setLatitudeInput("");
    setLongitudeInput("");
    setStatusInput("");
  };

  const handleUpdateLocation = async () => {
    if (!selectedShipment?.trackingNumber) return;
        const trackingNumber = selectedShipment.trackingNumber;
        const locationInputs = locationInput;
        const latitudeInputs = latitudeInput;
        const longitudeInputs = longitudeInput;
        const statusInputs = statusInput;

    const r = await useUpdateShipmentLocation(trackingNumber,locationInputs,latitudeInputs,longitudeInputs,statusInputs);

    if (r?.message) {
      toast({
        title: "Updated",
        description: "Shipment location updated successfully",
        variant: "default",
      });

      // refresh list
      const packages = await fetchAllShip();
      setShipments(packages || []);
    } else {
      toast({
        title: "Update Failed",
        description: "Unable to update shipment location",
        variant: "destructive",
      });
    }

    closeLocationModal();
  };

  const newShipment = () => {
    return navigation("/admin/new-shipment")
  }
  const editShipment = (track:string = '') => {
    if(!track) return;
    navigation(`/admin/edit-shipment/${track}`);
  }

  useEffect(() => {
    const fetchPkg = async () => {
      try {
        const packages = await fetchAllShip();
        setShipments(packages || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load shipments");
      } finally {
        setLoading(false);
      }
    };

    fetchPkg();
  }, []);

  if (loading) {
    return <div className="p-6">Loading shipments...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  const openReceipt = (shipment: Shipment) => {
    setReceiptShipment(shipment);
    setIsReceiptOpen(true);
  };

  const closeReceipt = () => {
    setIsReceiptOpen(false);
    setReceiptShipment(null);
  };

  const ShipmentReceipt = () => {
    if (!isReceiptOpen || !receiptShipment) return null;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      receiptShipment.trackingNumber || ""
    )}&size=150x150`;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 print:bg-white print:block">
        <div
          className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6
                    print:shadow-none print:border-none print:px-0 print:py-0
                    print:max-w-none print:w-full print:text-black"
        >
          {/* HEADER */}
          <div className="flex items-start justify-between border-b border-gray-200 pb-4 rounded-t-xl p-4" style={{ backgroundColor: "rgb(77, 128, 129)" }}>
            <div>
              {/* Optional Logo */}
              <div className="flex items-start justify-center">
                <img src={logoUrl} alt="Company Logo" className="h-20 mb-2 w-40" />
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-white">
                Shipment Receipt
              </h2>

              <p className="text-sm text-white/80 mt-1">
                Tracking No:
                <span className="font-medium text-white ml-1">
                  {receiptShipment.trackingNumber}
                </span>
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-white/70">
                Scan to track
              </span>

              <a href={`/track/${receiptShipment.trackingNumber}`}>
                <img
                  src={qrUrl}
                  alt="Tracking QR"
                  className="w-20 h-20 -md border border-gray-200 shadow-sm"
                />
              </a>
            </div>
          </div>

          {/* BODY */}
          <div className="mt-6 grid grid-cols-1 gap-4 text-sm print:text-xs">

            {/* Shipment + Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{background: " rgba(200, 199, 201, 0.46)"}}>

              <div className="space-y-1  p-3">
                <div className="font-medium text-sm" style={{color: " rgb(77, 128, 129)"}}>Shipment</div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>
                    <span className="font-medium">Tracking:</span> {receiptShipment.trackingNumber || "-"}
                  </div>
                  <div>
                    <span className="font-medium">Package:</span> {receiptShipment.packageName || "-"}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-700">
                      {receiptShipment.status || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Location:</span> {receiptShipment.location || "-"}
                  </div>
                </div>
              </div>

              <div className="space-y-1  p-3">
                <div className="font-medium text-sm"  style={{color: " rgb(77, 128, 129)"}}>Dates & Fees</div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>
                    <span className="font-medium">Created:</span>{" "}
                    {receiptShipment.createdAt
                      ? new Date(receiptShipment.createdAt).toLocaleString()
                      : "-"}
                  </div>
                  <div>
                    <span className="font-medium">Delivery Date:</span>{" "}
                    {receiptShipment.deliveryDate
                      ? new Date(receiptShipment.deliveryDate).toLocaleDateString()
                      : "-"}
                  </div>
                  <div>
                    <span className="font-medium">Fee:</span>{" "}
                    {receiptShipment.deliveryfee != null
                      ? `$${Number(receiptShipment.deliveryfee).toLocaleString()}`
                      : "-"}
                  </div>
                </div>
              </div>

            </div>

            {/* Sender + Receiver */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{background: " rgba(200, 199, 201, 0.46)"}}>

              <div className="space-y-1 p-3">
                <div className="font-medium text-sm" style={{color: " rgb(77, 128, 129)"}}>Sender</div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div><span className="font-medium">Name:</span> {receiptShipment.senderFullName || "-"}</div>
                  <div><span className="font-medium">Email:</span> {receiptShipment.senderEmail || "-"}</div>
                  <div><span className="sfont-medium">Phone:</span> {receiptShipment.senderPhoneNo || "-"}</div>
                  <div><span className="font-medium">Address:</span> {receiptShipment.senderAddress || "-"}</div>
                </div>
              </div>

              <div className="space-y-1  p-3">
                <div className="font-medium text-sm" style={{color: " rgb(77, 128, 129)"}}>Receiver</div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div><span className="font-medium">Name:</span> {receiptShipment.receiverFullName || "-"}</div>
                  <div><span className="font-medium">Email:</span> {receiptShipment.receiverEmail || "-"}</div>
                  <div><span className="font-medium">Phone:</span> {receiptShipment.receiverPhoneNo || "-"}</div>
                  <div><span className="font-medium">Address:</span> {receiptShipment.receiverAddress || "-"}</div>
                </div>
              </div>

            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-8 border-t pt-4 text-xs text-gray-500 flex justify-between">
            <span>
              Generated on {new Date().toLocaleString()}
            </span>
            <span className="text-right">
              Powered by Your Company
            </span>
          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex justify-end gap-3 print:hidden">
            <Button variant="outline" onClick={closeReceipt}>
              Close
            </Button>
            <Button onClick={() => window.print()}>
              Print
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="pt-6 px-3 lg:px-6 pb-4">
        <h1 className="text-xl font-semibold text-stone-900 mb-1">Shipments </h1>
        <div className="flex items-center justify-between">
            <p className="text-sm text-stone-600">Manage your shipments</p>
            <div className="flex space-x-3">
                <Button onClick={newShipment} variant="secondary" className="bg-black text-white hover:bg-black/90 hover:text-white border-0">
                  <Plus className="mr-2 w-4 h-4" />
                  New shipment
                </Button>
            </div>
        </div>
        <div className="border-b border-stone-200 mt-4"></div>
      </div>
      <div className="h-full overflow-y-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>All Shipments</CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {shipments.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No shipments found
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs">No</th>
                    <th className="px-6 py-3 text-left text-xs">Tracking</th>
                    <th className="px-6 py-3 text-left text-xs">Status</th>
                    <th className="px-6 py-3 text-left text-xs">Created</th>
                    <th className="px-6 py-3 text-left text-xs">Update/Receipt</th>
                    <th className="px-6 py-3 text-left text-xs">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {shipments.map((shipment) => (
                    <tr key={shipment.id} className="border-t">
                      <td className="px-6 py-4">
                            {shipment?.id}
                      </td>

                      <td className="px-6 py-4">
                        {shipment.trackingNumber || "-"}
                      </td>

                      <td className="px-6 py-4">{shipment.status || "-"}</td>

                      <td className="px-6 py-4">
                        {shipment.createdAt
                          ? new Date(shipment.createdAt).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-6 py-4">
                        <Button onClick={() => openLocationModal(shipment)} size="sm" className="mx-2" variant="secondary">
                          <StampIcon color="green"/>
                        </Button>
                        <Button size="sm" className="mx-2" variant="secondary" onClick={() => openReceipt(shipment)}>
                          <Receipt color="purple"/>
                        </Button>
                      </td>
                      <td className="px-6 py-4">
                        <Button onClick={() => editShipment(shipment?.trackingNumber)} size="sm" className="mx-2" variant="secondary">
                          <Edit color="blue"/>
                        </Button>
                        <Button onClick={() => DeleteShipment(shipment?.trackingNumber)} size="sm" variant="secondary">
                          <Trash color="red"/>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* modal box for location update */}
        <LocationUpdateModal
          open={isLocationModalOpen}
          initialLocation={locationInput}
          initialLatitude={latitudeInput}
          initialLongitude={longitudeInput}
          initialStatus={statusInput}
          onClose={closeLocationModal}
          onUpdate={handleUpdateLocation}
          setLocation={setLocationInput}
          setLatitude={setLatitudeInput}
          setLongitude={setLongitudeInput}
          setStatusInput={setStatusInput}
        />

        <ShipmentReceipt />
      </div>
    </>
  );
}