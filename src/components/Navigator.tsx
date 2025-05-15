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

// New component for the info panel
const InfoPanel = ({ potholes, start, end }) => {
  const getTotalPotholes = () => potholes.length;
  
  const getSeverityCount = () => {
    return potholes.reduce((acc, p) => {
      acc[p.severity] = (acc[p.severity] || 0) + 1;
      return acc;
    }, {});
  };

  const isRouteAdvisable = () => {
    const highSeverityCount = potholes.filter(p => p.severity === 'high').length;
    if (highSeverityCount > 3) return 'Not Advisable';
    if (highSeverityCount > 1) return 'Proceed with Caution';
    return 'Safe to Travel';
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#fff',
      height: '100%',
      overflowY: 'auto'
    }}>
      <h2 style={{ marginBottom: '20px' }}>Route Information</h2>
      
      {!start && (
        <p>Click on the map to set starting point</p>
      )}
      
      {start && !end && (
        <p>Click on the map to set destination</p>
      )}

      {start && end && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <h3>Route Status</h3>
            <p style={{
              padding: '10px',
              backgroundColor: isRouteAdvisable() === 'Safe to Travel' ? '#d4edda' : 
                            isRouteAdvisable() === 'Proceed with Caution' ? '#fff3cd' : '#f8d7da',
              borderRadius: '4px',
              marginTop: '10px'
            }}>
              {isRouteAdvisable()}
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3>Pothole Summary</h3>
            <p>Total Potholes: {getTotalPotholes()}</p>
            <div style={{ marginTop: '10px' }}>
              <h4>Severity Breakdown:</h4>
              {Object.entries(getSeverityCount()).map(([severity, count]) => (
                <p key={severity}>
                  {severity.charAt(0).toUpperCase() + severity.slice(1)}: {count}
                </p>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
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
      const res = await fetch('https://pd-server-six.vercel.app/route', {
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
    <div style={{ display: 'flex', height: '100%', width: '100%' }}>
      <div style={{ width: '65%', height: '100%' }}>
        <MapContainer
          center={position}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
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
              color={p.severity === 'high' ? 'red' : p.severity === 'medium' ? 'orange' : 'yellow'}
              fillOpacity={0.7}
            >
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      <div style={{ width: '35%', borderLeft: '1px solid #ccc' }}>
        <InfoPanel potholes={potholes} start={start} end={end} />
      </div>
    </div>
  );
}
