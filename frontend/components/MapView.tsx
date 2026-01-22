'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Issue } from '@/app/types';
import { useRouter } from 'next/navigation';

interface MapViewProps {
  issues: Issue[];
  onMapClick?: (lat: number, lng: number) => void;
}

const MapView = ({ issues, onMapClick }: MapViewProps) => {
  const router = useRouter();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

const map = new maplibregl.Map({
  container: mapContainerRef.current,
  style: {
    version: 8,
    sources: {
      osm: {
        type: "raster",
        tiles: [
          "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
        ],
        tileSize: 256
      }
    },
    layers: [
      {
        id: "osm",
        type: "raster",
        source: "osm"
      }
    ]
  },
  center: [96.1635, 16.8251],
  zoom: 12
});

    map.addControl(new maplibregl.NavigationControl());

    map.on('click', (e) => {
      if (onMapClick) {
        onMapClick(e.lngLat.lat, e.lngLat.lng);
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, [onMapClick]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers for each issue
    issues.forEach((issue) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.backgroundColor = getMarkerColor(issue.status);
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';

      const marker = new maplibregl.Marker(el)
        .setLngLat([issue.longitude, issue.latitude])
        .addTo(mapRef.current!);

      el.addEventListener('click', () => {
        router.push(`/issue/${issue.id}`);
      });

      markersRef.current.push(marker);
    });
  }, [issues]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

const getMarkerColor = (status: string) => {
  switch (status) {
    case 'pending':
      return '#f59e0b'; // Amber
    case 'verified':
      return '#3b82f6'; // Blue
    case 'in_progress':
      return '#10b981'; // Green
    case 'fixed':
      return '#8b5cf6'; // Purple
    default:
      return '#6b7280'; // Gray
  }
};

export default MapView;