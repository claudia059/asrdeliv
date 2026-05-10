import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type LocationUpdateModalProps = {
  open: boolean;
  initialLocation?: string;
  initialLatitude?: string;
  initialLongitude?: string;
  initialStatus?: string;
  setLatitude: (latitude: string) => void;
  setLongitude: (longitude: string) => void;
  setLocation: (location: string) => void;
  setStatusInput: (status: string) => void;
  onClose: () => void;
  onUpdate: () => void;
};


export default function LocationUpdateModal({
  open,
  initialLocation = "",
  setLocation,
  initialLatitude = "",
  setLatitude,
  initialLongitude = "",
  setLongitude,
  initialStatus = "",
  setStatusInput,
  onClose,
  onUpdate,
}: LocationUpdateModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[320px]">
        <h2 className="text-lg text-gray-900 text-center border-b mb-2 font-semibold mb-4">Update Shipment</h2>

          <Label htmlFor="location" className="block mb-1 font-medium text-sm">
            Location
          </Label>
        <input
          type="text"
          value={initialLocation}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter new location"
          className="border p-2 w-full mb-4"
        />

        <Label htmlFor="latitude" className="block mb-1 font-medium text-sm">
          Latitude
        </Label>
        <input
          type="text"
          value={initialLatitude}
          onChange={(e) => setLatitude(e.target.value)}
          placeholder="Enter latitude"
          className="border p-2 w-full mb-4"
        />

        <Label htmlFor="longitude" className="block mb-1 font-medium text-sm">
          Longitude
        </Label>
        <input
          type="text"
          value={initialLongitude}
          onChange={(e) => setLongitude(e.target.value)}
          placeholder="Enter longitude"
          className="border p-2 w-full mb-4"
        />

          <Label htmlFor="status" className="block mb-1 font-medium text-sm">
            Status
          </Label>
        <select
          id="status"
          name="status"
          required
          value={initialStatus}
          onChange={(e) => setStatusInput(e.target.value )}
          className="w-full px-4 mb-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select Status</option>
          {/* <!-- Order Crea/ted --> */}
          <option value="Pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>

          {/* <!-- Pickup/ //////Stage --> */}
          <option value="awaiting-pickup">Awaiting Pickup</option>
          <option value="picked-up">Picked Up</option>

          {/* <!-- Tra/nsit Stage --> */}
          <option value="in-transit">In Transit</option>
          <option value="arrived-at-hub">Arrived at Hub</option>
          <option value="departed-hub">Departed Hub</option>
          <option value="customs-clearance">Customs Clearance</option>
          <option value="delayed">Delayed</option>

          {/* <!-- Delivery Stage --> */}
          <option value="out-for-delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="failed-delivery">Failed Delivery Attempt</option>

          {/* <!-- Exceptions --> */}
          <option value="returned">Returned to Sender</option>
          <option value="cancelled">Cancelled</option>
          <option value="lost">Lost</option>
          <option value="damaged">Damaged</option>
          <option value="on-hold">On Hold</option>
        </select> 
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onUpdate}>Update</Button>
        </div>
      </div>
    </div>
  );
}