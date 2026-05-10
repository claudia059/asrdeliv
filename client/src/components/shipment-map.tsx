import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapUpdaterProps {
  lat: number;
  lng: number;
}

function MapUpdater({ lat, lng }: MapUpdaterProps) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

interface ShipmentMapProps {
  latitude: number;
  longitude: number;
  location: string;
  status: string;
  updatedAt: string;
}

export function ShipmentMap({ latitude, longitude, location, status, updatedAt }: ShipmentMapProps) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={6}
      style={{ height: "320px", width: "100%", borderRadius: "0.5rem", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater lat={latitude} lng={longitude} />
      <Marker position={[latitude, longitude]}>
        <Popup>
          <div className="text-sm">
            <p className="font-semibold">{location}</p>
            <p className="text-xs text-gray-600 mt-1">Status: {status}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Updated: {new Date(updatedAt).toLocaleString()}
            </p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
