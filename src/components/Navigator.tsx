import { useCallback, useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  CircleMarker,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 14);
  }, [position, map]);
  return null;
};

const Routing = ({ start, end, onRouteComplete }) => {
  const map = useMap();

  useEffect(() => {
    if (!start || !end) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      routeWhileDragging: false,
    }).addTo(map);

    routingControl.on('routesfound', function (e) {
      const routeCoords = e.routes[0].coordinates.map((c) => [c.lat, c.lng]);
      onRouteComplete(routeCoords);
    });

    return () => map.removeControl(routingControl);
  }, [start, end, map, onRouteComplete]);

  return null;
};

const MapClickHandler = ({ onSetStartEnd }) => {
  useMapEvents({
    click(e) {
      onSetStartEnd([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const formatRouteToLineString = (coordinates) => {
  const lineString = coordinates
    .map(([lat, lng]) => `${lng} ${lat}`)
    .join(', ');
  return `LINESTRING(${lineString})`;
};

export default function Navigator() {
  const [position, setPosition] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [potholes, setPotholes] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      },
      () => alert('Failed to get location'),
      { enableHighAccuracy: true }
    );
  }, []);

  const onSetStartEnd = (latlng) => {
    if (!start) setStart(latlng);
    else if (!end) setEnd(latlng);
    else {
      setStart(latlng);
      setEnd(null);
      setPotholes([]);
    }
  };

  const handleRouteCoords = useCallback(async (coords) => {
    const linestring = formatRouteToLineString(coords);
  
    try {
      const res = await fetch('http://localhost:3000/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          route: linestring,
          buffer: 20,
        }),
      });
  
      const data = await res.json();
      setPotholes(data);
    } catch (err) {
      console.error('Error fetching potholes:', err);
    }
  }, []);
  

  if (!position) return <p>Loading...</p>;

  return (
    <MapContainer
      center={position}
      zoom={14}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <RecenterMap position={position} />
      <MapClickHandler onSetStartEnd={onSetStartEnd} />

      {start && <Marker position={start} />}
      {end && <Marker position={end} />}
      {start && end && (
        <Routing start={start} end={end} onRouteComplete={handleRouteCoords} />
      )}

      {potholes.map((p, idx) => (
        <CircleMarker
          key={idx}
          center={[p.lat, p.lng]}
          radius={6}
          color="red"
          fillOpacity={0.7}
        />
      ))}
    </MapContainer>
  );
}
