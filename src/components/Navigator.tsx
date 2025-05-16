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
    const highSeverityCount = potholes.filter(p => p.severity === 'medium').length;
    if (highSeverityCount > 2) return 'Not Advisable';
    if (highSeverityCount > 1) return 'Proceed with Caution';
    return 'Safe to Travel';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Safe to Travel': return '#4CAF50';
      case 'Proceed with Caution': return '#FFC107';
      case 'Not Advisable': return '#F44336';
      default: return '#757575';
    }
  };

  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#f8f9fa',
      height: '100%',
      overflowY: 'auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h2 style={{ 
        marginBottom: '24px',
        color: '#2c3e50',
        fontSize: '1.8rem',
        fontWeight: '600',
        borderBottom: '2px solid #e9ecef',
        paddingBottom: '12px'
      }}>Route Information</h2>
      
      {!start && (
        <div style={{
          padding: '16px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          color: '#6c757d'
        }}>
          Click on the map to set starting point
        </div>
      )}
      
      {start && !end && (
        <div style={{
          padding: '16px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          color: '#6c757d'
        }}>
          Click on the map to set destination
        </div>
      )}

      {start && end && (
        <>
          <div style={{ 
            marginBottom: '24px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ 
              color: '#2c3e50',
              marginBottom: '16px',
              fontSize: '1.4rem',
              fontWeight: '500'
            }}>Route Status</h3>
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: `2px solid ${getStatusColor(isRouteAdvisable())}`,
              color: getStatusColor(isRouteAdvisable()),
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: getStatusColor(isRouteAdvisable())
              }}></span>
              {isRouteAdvisable()}
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ 
              color: '#2c3e50',
              marginBottom: '16px',
              fontSize: '1.4rem',
              fontWeight: '500'
            }}>Pothole Summary</h3>
            
            <div style={{
              padding: '16px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              marginBottom: '20px'
            }}>
              <div style={{
                fontSize: '1.2rem',
                fontWeight: '500',
                color: '#2c3e50',
                marginBottom: '8px'
              }}>
                Total Potholes: {getTotalPotholes()}
              </div>
            </div>

            <div>
              <h4 style={{
                color: '#2c3e50',
                marginBottom: '12px',
                fontSize: '1.1rem',
                fontWeight: '500'
              }}>Severity Breakdown:</h4>
              <div style={{
                display: 'grid',
                gap: '12px'
              }}>
                {Object.entries(getSeverityCount()).map(([severity, count]) => (
                  <div key={severity} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px',
                    border: '1px solid #e9ecef'
                  }}>
                    <span style={{
                      textTransform: 'capitalize',
                      color: '#495057',
                      fontWeight: '500'
                    }}>
                      {severity}
                    </span>
                    <span style={{
                      backgroundColor: severity === 'high' ? '#F44336' : 
                                    severity === 'medium' ? '#FFC107' : '#4CAF50',
                      color: '#fff',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}>
                      {count}
                    </span>
                  </div>
                ))}
              </div>
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
