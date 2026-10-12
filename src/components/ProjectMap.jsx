import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Layers, 
  ExternalLink, 
  Copy, 
  Check, 
  Maximize2,
  Navigation,
  Compass
} from 'lucide-react';

export default function ProjectMap({
  latitude,
  longitude,
  projectName = 'MahaRERA Project',
  reraId = '',
  address = '',
  village = '',
  taluka = ''
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [tileMode, setTileMode] = useState('street'); // 'street' or 'satellite'

  // Standardize coordinates
  const lat = typeof latitude === 'number' && !isNaN(latitude) ? latitude : 18.5204;
  const lng = typeof longitude === 'number' && !isNaN(longitude) ? longitude : 73.8567;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 16,
      zoomControl: true,
      scrollWheelZoom: false
    });

    // Choose base tile layer
    const streetTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    });

    const satelliteTiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19
    });

    if (tileMode === 'satellite') {
      satelliteTiles.addTo(map);
    } else {
      streetTiles.addTo(map);
    }

    // Custom pulse marker icon
    const customIcon = L.divIcon({
      className: 'custom-map-marker-pin',
      html: `
        <div style="
          position: relative;
          width: 38px;
          height: 38px;
          background: #1d4ed8;
          border: 3px solid #ffffff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 14px rgba(29, 78, 216, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            transform: rotate(45deg);
            width: 10px;
            height: 10px;
            background: #ffffff;
            border-radius: 50%;
          "></div>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38]
    });

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

    // Popup content
    const popupContent = `
      <div style="font-family: Inter, sans-serif; padding: 4px 2px; min-width: 180px;">
        <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem; margin-bottom: 2px;">
          ${projectName}
        </div>
        ${reraId ? `<div style="font-size: 0.75rem; color: #1d4ed8; font-weight: 700; margin-bottom: 4px;">RERA: ${reraId}</div>` : ''}
        <div style="font-size: 0.75rem; color: #64748b; line-height: 1.4;">
          ${address || `${village}, ${taluka}, Pune`}
        </div>
        <div style="margin-top: 6px; font-size: 0.72rem; color: #047857; font-weight: 600;">
          📍 Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);
    marker.openPopup();

    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Invalidate size in next tick
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, tileMode, projectName, reraId, address, village, taluka]);

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 16, { animate: true });
      if (markerRef.current) {
        markerRef.current.openPopup();
      }
    }
  };

  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <div style={{
      position: 'relative',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
      background: '#ffffff'
    }}>
      {/* Map Header Toolbar */}
      <div style={{
        padding: '12px 18px',
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: '#eff6ff',
            color: '#1d4ed8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MapPin size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
              Geographic Project Location
            </div>
            <div style={{ fontSize: '0.725rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Latitude: <b>{lat.toFixed(5)}° N</b></span>
              <span>•</span>
              <span>Longitude: <b>{lng.toFixed(5)}° E</b></span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={handleCopyCoords}
            title="Copy Latitude & Longitude"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: '7px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            {copied ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
            <span>{copied ? 'Copied!' : 'Copy Coords'}</span>
          </button>

          <button
            type="button"
            onClick={() => setTileMode(tileMode === 'street' ? 'satellite' : 'street')}
            title="Switch Map / Satellite View"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: '7px',
              border: '1px solid #cbd5e1',
              background: tileMode === 'satellite' ? '#0f172a' : '#ffffff',
              color: tileMode === 'satellite' ? '#ffffff' : '#334155',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Layers size={13} />
            <span>{tileMode === 'satellite' ? 'Street View' : 'Satellite'}</span>
          </button>

          <button
            type="button"
            onClick={handleRecenter}
            title="Recenter Map"
            style={{
              padding: '6px 8px',
              borderRadius: '7px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <Navigation size={14} />
          </button>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in Google Maps"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: '7px',
              border: '1px solid #bfdbfe',
              background: '#eff6ff',
              color: '#1d4ed8',
              fontSize: '0.75rem',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            <span>Google Maps</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Leaflet Map Box */}
      <div 
        ref={mapContainerRef} 
        style={{ 
          width: '100%', 
          height: '360px',
          background: '#e2e8f0',
          position: 'relative',
          zIndex: 1
        }} 
      />

      {/* Map Bottom Coordinates Info Badge */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        zIndex: 500,
        background: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '8px',
        padding: '6px 12px',
        color: '#ffffff',
        fontSize: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        pointerEvents: 'none',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
      }}>
        <Compass size={14} color="#60a5fa" />
        <span><b>Coordinates:</b> {lat.toFixed(5)}° N, {lng.toFixed(5)}° E</span>
        <span style={{ color: '#94a3b8' }}>|</span>
        <span style={{ color: '#86efac' }}>MahaRERA Verified Geo-Location</span>
      </div>
    </div>
  );
}
