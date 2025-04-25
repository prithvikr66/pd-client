import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';

// Fix default marker icon (Leaflet bug workaround)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const HeatLayer = ({ potholes }) => {
  const map = useMap();

  useEffect(() => {
    if (!potholes.length) return;

    const points = potholes.map(p => [
      p.lat,
      p.lng,
      p.severity === 'high' ? 1.0 : p.severity === 'medium' ? 0.6 : 0.3
    ]);

    const heat = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
    });

    heat.addTo(map);

    return () => map.removeLayer(heat);
  }, [potholes, map]);

  return null;
};

const RecenterMap = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 15); // zoom level
    }
  }, [position, map]);

  return null;
};

export default function HeatMap() {
  const [position, setPosition] = useState(null);
  const [potholes, setPotholes] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const userPos = [latitude, longitude];
        setPosition(userPos);

        const res = await fetch(
          `http://localhost:3000/nearby?lat=${latitude}&lng=${longitude}&radius=3000`
        );
        const data = await res.json();
        setPotholes(data);
      },
      (err) => alert('Failed to get location!'),
      { enableHighAccuracy: true }
    );
  }, []);

  if (!position) return <p>Loading map...</p>;

  return (
    <MapContainer center={position} zoom={14} style={{ height: '100vh', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <RecenterMap position={position} />
      <HeatLayer potholes={potholes} />
      <Marker position={position}>
        <Popup>You are here!</Popup>
      </Marker>
    </MapContainer>
  );
}
