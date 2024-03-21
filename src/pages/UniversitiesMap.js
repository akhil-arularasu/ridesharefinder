import 'leaflet/dist/leaflet.css';
import React from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Import the marker icon and shadow
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Customize the default icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  shadowSize: [41, 41] // Size of the shadow
});

// Set the default icon for all markers
L.Marker.prototype.options.icon = DefaultIcon;

const UniversitiesMap = () => {
  // Centers the map between the two universities
  const centerPosition = [33.7756, -84.3963]; 

  // Marker positions for Emory University and Georgia Tech
  const markers = [
    { position: [33.7971, -84.3222], name: 'Emory University' },
    { position: [33.6209, -83.8675], name: 'Oxford College of Emory University' },
  ];

  return (
    <MapContainer center={centerPosition} zoom={7} style={{ height: '400px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers.map((marker, idx) => (
        <Marker key={idx} position={marker.position}>
          <Popup>{marker.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default UniversitiesMap;
