import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const LiveTracking = ({ captainLocation }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);

    useEffect(() => {
        if (map.current) return; 

        // 1. Initialize Map with a default fallback (just in case location is blocked)
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [85.3250, 23.3441], // Default coordinates
            zoom: 15
        });

        // 2. Initialize Marker styling
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundColor = 'black';
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.borderRadius = '50%';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';

        marker.current = new mapboxgl.Marker(el)
            .setLngLat([85.3250, 23.3441])
            .addTo(map.current);

        // 3. NEW: Ask browser for EXACT current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { longitude, latitude } = position.coords;
                    
                    // Fly the map to your exact real-world location
                    map.current.flyTo({ 
                        center: [longitude, latitude], 
                        zoom: 16,
                        essential: true 
                    });
                    
                    // Snap the black dot to your exact location
                    marker.current.setLngLat([longitude, latitude]);
                },
                (error) => {
                    console.error("Browser location denied or failed:", error.message);
                },
                { enableHighAccuracy: true } // Forces GPS over Wi-Fi estimation
            );
        }
    }, []);

    // 4. Update marker if Captain's location comes in via WebSockets (during an active ride)
    useEffect(() => {
        if (captainLocation && map.current && marker.current) {
            const { lat, lng } = captainLocation;
            marker.current.setLngLat([lng, lat]);
            map.current.flyTo({ center: [lng, lat], zoom: 16 });
        }
    }, [captainLocation]);

    return <div ref={mapContainer} className="h-full w-full" />;
};

export default LiveTracking;