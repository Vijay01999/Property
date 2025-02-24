import { useEffect, useRef } from "react";
import { Property } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";

interface MapViewProps {
  properties: Property[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function MapView({ properties, center, zoom = 12 }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Load Google Maps Script
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = initMap;
    } else {
      initMap();
    }

    return () => {
      // Cleanup markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      // Update markers when properties change
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      properties.forEach((property) => {
        const marker = new window.google.maps.Marker({
          position: {
            lat: Number(property.latitude),
            lng: Number(property.longitude),
          },
          map: mapInstanceRef.current,
          title: property.title,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold">${property.title}</h3>
              <p class="text-sm">${formatCurrency(Number(property.price))}</p>
              <p class="text-sm">${property.size} sq ft</p>
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });

        markersRef.current.push(marker);
      });

      // Center map on first property if no center provided
      if (!center && properties.length > 0) {
        mapInstanceRef.current.setCenter({
          lat: Number(properties[0].latitude),
          lng: Number(properties[0].longitude),
        });
      }
    }
  }, [properties]);

  function initMap() {
    if (!mapRef.current || mapInstanceRef.current) return;

    const defaultCenter = center || { lat: 28.3670, lng: 79.4304 }; // Bareilly coordinates
    
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: zoom,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });
  }

  return <div ref={mapRef} className="w-full h-full" />;
}
