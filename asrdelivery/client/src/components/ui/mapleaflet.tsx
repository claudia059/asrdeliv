import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "../../map.css";

type Props = {
  latitude: number;
  longitude: number;
  location: string;
};

export default function MapLeaflet({ latitude, longitude, location }: Props) {
  useEffect(() => {
    const map = L.map("map").setView([latitude, longitude], 13);

    // ✅ Add map tiles (IMPORTANT)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    L.circle([latitude, longitude], {
        radius: 50, // meters
        color: "#2a93ff",
        fillColor: "#2a93ff",
        fillOpacity: 0.15,
    }).addTo(map);

    const userIcon = L.divIcon({
        className: "",
        html: `<div class="user-location"></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });

    const markers = L.markerClusterGroup();

    // ✅ Use ONLY ONE marker (with pulse icon)
    const marker = L.marker([latitude, longitude], {
      icon: userIcon,
    });

    marker.bindPopup(`<strong>${location}</strong>`);

    markers.addLayer(marker);
    map.addLayer(markers);

    return () => {
      map.remove();
    };
  }, [latitude, longitude, location]);

  return <div id="map" style={{ height: "500px" }} />;
}