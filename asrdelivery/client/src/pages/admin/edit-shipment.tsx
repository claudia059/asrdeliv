import { useEffect, useState,  } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrackingExists, useUpdateShipment } from "@/hooks/use-shippments";
import { toast } from "@/hooks/use-toast";
import { Navigate, useParams } from "react-router-dom";

export default function EditShipment() {
  const [b, setB] = useState(false);
  const getId = () => {
    const { id } = useParams();
    if(id){
      return id;
    }
    return null;
  }

  type ShipmentFormData = {
    packageName: string;
    packageType: string;
    packageDescription: string;
    weight: string;
    dimensions: string;
    trackingNumber: string;
    deliveryInstructions: string;
    deliveryDate: Date;
    deliveryfee: number;
    receivedAt: Date;
    toBeDeliveredAt: Date;
    senderFullName: string;
    senderEmail: string;
    senderPhoneNo: string;
    senderAddress: string;
    receiverFullName: string;
    receiverEmail: string;
    receiverPhoneNo: string;
    receiverAddress: string;
  };

  const [formData, setFormData] = useState<ShipmentFormData>({
    packageName: "",
    packageType: "",
    packageDescription: "",
    weight: "",
    dimensions: "",
    trackingNumber: "",
    deliveryInstructions: "",
    deliveryDate: new Date(),
    deliveryfee: 0,
    receivedAt: new Date(),
    toBeDeliveredAt: new Date(),
    senderFullName: "",
    senderEmail: "",
    senderPhoneNo: "",
    senderAddress: "",
    receiverFullName: "",
    receiverEmail: "",
    receiverPhoneNo: "",
    receiverAddress: "",
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await useUpdateShipment(formData);

    if(r?.message){
      toast({
        title: "Success",
        description: "Shipment updated successfully",
        variant: "default",
      });
    }
  };

  
  const normalizeShipment = (data: any): ShipmentFormData => {
    return {
      ...data,
      deliveryDate: data?.deliveryDate ? new Date(data.deliveryDate) : new Date(),
      receivedAt: data?.receivedAt ? new Date(data.receivedAt) : new Date(),
      toBeDeliveredAt: data?.toBeDeliveredAt ? new Date(data.toBeDeliveredAt) : new Date(),
      deliveryfee: data?.deliveryfee !== undefined ? Number(data.deliveryfee) : 0,
    };
  };

  const id = getId();
  useEffect(() => {
      const fectShipment = async (track:string = '') => {
        try {
          const r = await TrackingExists(track);
          if(!r){
            setB(true);
            toast({
              title: "Shipment Not Found",
              description: `No shipment found with tracking number ${track}`,
              variant: "destructive"
            });
            return <Navigate to="/admin/shipments" replace={true} />;
          }
          if (r) setFormData(normalizeShipment(r));
        } catch (error) {
          console.log(`ASRerro: ${error}`);
          return null;
        }
      };

        if(id){
          fectShipment(id);
        }
  }, [id]);

  return (
        <>
    <div className="pt-6 px-3 lg:px-6 pb-4">
        <h1 className="text-xl font-semibold text-stone-900 mb-1">Shipments</h1>
        <div className="flex items-center justify-between">
            <p className="text-sm text-stone-600">Manage your account settings and personal information</p>
        </div>
        <div className="border-b border-stone-200 mt-4"></div>
      </div>
    <div className="h-full overflow-y-auto p-6">
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className=" space-y-2">
            <CardTitle className="text-3xl font-bold text-gray-900">Edit Shipments</CardTitle>
            <p className="text-sm text-gray-600">Create new Shipments</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6" >
              
              <CardHeader>
                <CardTitle className="text-1xl font-bold text-gray-400">Shipment Details</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name" className="text-sm font-normal text-gray-700">
                    Package Name
                  </Label>
                  <Input
                    id="first-name"
                    name="packageName"
                    type="text"
                    required
                    value={formData.packageName}
                    onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Electronics"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="packageType" className="text-sm font-normal text-gray-700">
                    Shipment Type
                  </Label>
                  <Input
                    id="packageType"
                    name="packageType"
                    type="text"
                    required
                    value={formData.packageType}
                    onChange={(e) => setFormData({ ...formData, packageType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Express"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="first-name" className="text-sm font-normal text-gray-700">
                    Description
                  </Label>
                  <Input
                    id="Description"
                    name="packageDescription"
                    type="text"
                    required
                    value={formData.packageDescription}
                    onChange={(e) => setFormData({ ...formData, packageDescription: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Fragile electronic items"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-sm font-normal text-gray-700">
                    weight
                  </Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="text"
                    required
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="2kg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="first-name" className="text-sm font-normal text-gray-700">
                    Dimensions
                  </Label>
                  <Input
                    id="dimensions"
                    name="dimensions"
                    type="text"
                    required
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="10x10x10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trackingNumber" className="text-sm font-normal text-gray-700">
                    Tracking Number
                  </Label>
                  <Input disabled
                    id="trackingNumber"
                    name="trackingNumber"
                    type="text"
                    required    
                    value={formData.trackingNumber}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Trk12"
                  />
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-1xl font-bold text-gray-400">Other Details</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deliveryInstructions" className="text-sm font-normal text-gray-700">
                    Delivery Instructions
                  </Label>
                  <Input
                    id="deliveryInstructions"
                    name="deliveryInstructions"
                    type="text"
                    required
                    value={formData.deliveryInstructions}
                    onChange={(e) => setFormData({ ...formData, deliveryInstructions: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Leave at door"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deliveryDate" className="text-sm font-normal text-gray-700">
                    Delivery Date
                  </Label>
                  <Input
                    id="sdeliveryDate"
                    name="deliveryDate"
                    type="date"
                    required
                    value={
                      formData.deliveryDate instanceof Date
                        ? formData.deliveryDate.toISOString().slice(0, 10)
                        : ""
                    }
                    onChange={(e) => setFormData({ ...formData, deliveryDate: new Date(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder=""
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryfee" className="text-sm font-normal text-gray-700">
                    Delivery Fee
                  </Label>
                  <Input
                    id="deliveryfee"
                    name="deliveryfee"
                    type="number"
                    required
                    value={formData.deliveryfee}
                    onChange={(e) => setFormData({ ...formData, deliveryfee: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="amount"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deliveryDate" className="text-sm font-normal text-gray-700">
                    To Be Delivered Date
                  </Label>
                  <Input
                    id="toBeDeliveredAt"
                    name="toBeDeliveredAt"
                    type="date"
                    required
                    value={
                      formData.toBeDeliveredAt instanceof Date
                        ? formData.toBeDeliveredAt.toISOString().slice(0, 10)
                        : ""
                    }
                    onChange={(e) => setFormData({ ...formData, toBeDeliveredAt: new Date(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder=""
                  />
                </div>

              </div>


              <CardHeader>
                <CardTitle className="text-1xl font-bold text-gray-400">Sender Details</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senderFullName" className="text-sm font-normal text-gray-700">
                    FullName
                  </Label>
                  <Input disabled
                    id="senderFullName"
                    name="senderFullName"
                    type="text"
                    required
                    value={formData.senderFullName}
                    onChange={(e) => setFormData({ ...formData, senderFullName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Mr. vecky"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senderEmail" className="text-sm font-normal text-gray-700">
                    Email
                  </Label>
                  <Input 
                    id="senderEmail"
                    name="senderEmail"
                    type="email"
                    required
                    value={formData.senderEmail}
                    onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="xpress@gmail.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senderPhoneNo" className="text-sm font-normal text-gray-700">
                    PhoneNo
                  </Label>
                  <Input 
                    id="senderPhoneNo"
                    name="senderPhoneNo"
                    type="tel"
                    required
                    value={formData.senderPhoneNo}
                    onChange={(e) => setFormData({ ...formData, senderPhoneNo: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="+14666"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senderAddress" className="text-sm font-normal text-gray-700">
                    Address
                  </Label>
                  <Input 
                    id="senderAddress"
                    name="senderAddress"
                    type="text"
                    required
                    value={formData.senderAddress}
                    onChange={(e) => setFormData({ ...formData, senderAddress: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="NY"
                  />
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-1xl font-bold text-gray-400">Receiver Details</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="receiverFullName" className="text-sm font-normal text-gray-700">
                    FullName
                  </Label>
                  <Input disabled
                    id="receiverFullName"
                    name="receiverFullName"
                    type="text"
                    required
                    value={formData.receiverFullName}
                    onChange={(e) => setFormData({ ...formData, receiverFullName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Mr. vecky"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiverEmail" className="text-sm font-normal text-gray-700">
                    Email
                  </Label>
                  <Input 
                    id="receiverEmail"
                    name="receiverEmail"
                    type="email"
                    required
                    value={formData.receiverEmail}
                    onChange={(e) => setFormData({ ...formData, receiverEmail: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="xpress@gmail.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiverPhoneNo" className="text-sm font-normal text-gray-700">
                    PhoneNo
                  </Label>
                  <Input  
                    id="receiverPhoneNo"
                    name="receiverPhoneNo"
                    type="tel"
                    required
                    value={formData.receiverPhoneNo}
                    onChange={(e) => setFormData({ ...formData, receiverPhoneNo: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="+14666"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiverAddress" className="text-sm font-normal text-gray-700">
                    Address
                  </Label>
                  <Input 
                    id="receiverAddress"
                    name="receiverAddress"
                    type="text"
                    required
                    value={formData.receiverAddress}
                    onChange={(e) => setFormData({ ...formData, receiverAddress: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="NY"
                  />
                </div>
              </div>

              <Button disabled={b}
                type="submit"
                className="w-full"
              >
                Update Package
              </Button>
            </form>

          </CardContent>
        </Card>
    </div>
    </>
  );
}
