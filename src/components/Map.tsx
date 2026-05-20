import React, { useEffect, useState, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: { position: { lat: number; lng: number }; title: string; icon?: string }[];
}

export default function Map({ center, zoom = 15, markers = [] }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    const loader = new Loader({
      apiKey: '', // The platform will inject the API key if available, or I can use a public one if needed.
      // Actually, for this demo, I'll assume the user might need to provide one, 
      // but I'll try to use the library to load it.
      version: "weekly",
    });

    (loader as any).load().then(() => {
      if (mapRef.current && !map) {
        const newMap = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          disableDefaultUI: true,
          styles: [
            {
              "featureType": "all",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#7c7c7c" }]
            },
            {
              "featureType": "all",
              "elementType": "labels.text.stroke",
              "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }]
            },
            {
              "featureType": "administrative",
              "elementType": "geometry.fill",
              "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }]
            },
            {
              "featureType": "landscape",
              "elementType": "geometry",
              "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }]
            },
            {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry.fill",
              "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry.stroke",
              "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }]
            },
            {
              "featureType": "road.arterial",
              "elementType": "geometry",
              "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }]
            },
            {
              "featureType": "road.local",
              "elementType": "geometry",
              "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }]
            },
            {
              "featureType": "transit",
              "elementType": "geometry",
              "stylers": [{ "color": "#f2f2f2" }, { "lightness": 19 }]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }]
            }
          ]
        });
        setMap(newMap);
      }
    });
  }, []);

  useEffect(() => {
    if (map) {
      map.setCenter(center);
    }
  }, [center, map]);

  useEffect(() => {
    if (map) {
      // Clear old markers
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];

      // Add new markers
      markers.forEach(markerData => {
        const marker = new google.maps.Marker({
          position: markerData.position,
          map,
          title: markerData.title,
          icon: markerData.icon
        });
        markersRef.current.push(marker);
      });
    }
  }, [markers, map]);

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden shadow-inner bg-zinc-100">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
