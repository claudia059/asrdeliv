import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

type Props = {
  latitude: number;
  longitude: number;
  location: string;
};

export default function WorldMapSection({ latitude, longitude, location }: Props) {
  useEffect(() => {
    const map = L.map("map").setView([latitude, longitude], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const markers = L.markerClusterGroup();

    const marker = L.marker([latitude, longitude]);
    marker.bindPopup(`<strong>${location}</strong>`);

    markers.addLayer(marker);
    map.addLayer(markers);

    // Cleanup (important in React)
    return () => {
      map.remove();
    };
  }, [latitude, longitude, location]);

  return <div id="map" style={{ height: "500px" }} />;
}