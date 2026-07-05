import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const DEFAULT_CENTER = [85.3250, 23.3441];

const LiveTracking = ({ captainLocation }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Initialize map only once
  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: DEFAULT_CENTER,
      zoom: 15,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    mapRef.current.on("load", () => {
      const markerElement = document.createElement("div");

      markerElement.style.width = "18px";
      markerElement.style.height = "18px";
      markerElement.style.background = "#000";
      markerElement.style.border = "3px solid white";
      markerElement.style.borderRadius = "50%";
      markerElement.style.boxShadow = "0 0 8px rgba(0,0,0,.35)";

      markerRef.current = new mapboxgl.Marker(markerElement)
        .setLngLat(DEFAULT_CENTER)
        .addTo(mapRef.current);

      console.log("[MAP] Map initialized.");
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Update marker whenever captain location changes
  useEffect(() => {
    if (!captainLocation) return;
    if (!mapRef.current) return;
    if (!markerRef.current) return;

    const { lat, lng } = captainLocation;

    markerRef.current.setLngLat([lng, lat]);

    const center = mapRef.current.getCenter();

    const distance =
      Math.abs(center.lng - lng) + Math.abs(center.lat - lat);

    // Re-center only if the captain moves a noticeable distance
    if (distance > 0.002) {
      mapRef.current.easeTo({
        center: [lng, lat],
        duration: 1000,
      });
    }

    console.log(`[MAP] Updated -> ${lat}, ${lng}`);
  }, [captainLocation]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full"
    />
  );
};

export default LiveTracking;