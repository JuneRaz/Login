import React, { useState, useEffect, createContext } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import LevelButtons from './levelButtons';
import normalIcon from './icons/gps.png';
import lowIcon from './icons/gps(1).png';
import mediumIcon from './icons/gps(2).png';
import highIcon from './icons/gps(3).png';
import extremeIcon from './icons/gps(4).png';

// Define context
export const MarkerContext = createContext();
export const LevelContext = createContext();

const markerIcons = {
  Normal: normalIcon,
  Low: lowIcon,
  Medium: mediumIcon,
  High: highIcon,
  Extreme: extremeIcon
};

const mapContainerStyle = {
  width: '95%',
  height: '80%',
  margin: '20px auto'
};

const initPosition = {
  lat: 10.310530313219541,
  lng: 123.89366616608562
};

const MapContainer = () => {
  const [markers, setMarkers] = useState([]);
  const [poptext, setPoptext] = useState('');

  useEffect(() => {
    console.log('poptext has changed:', poptext);
  }, [poptext]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyBP4935sgIDwKy6UFmDSchMGBv9zesXlvQ"> {/* Replace with your actual API key */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={initPosition}
      >
        <LevelContext.Provider value={[poptext, setPoptext]}>
          <MarkerContext.Provider value={[markers, setMarkers]}>
            <LevelButtons />
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={{
                  url: markerIcons[poptext],
                  scaledSize: new window.google.maps.Size(30, 30)
                }}
              />
            ))}
          </MarkerContext.Provider>
        </LevelContext.Provider>
      </GoogleMap>
    </LoadScript>
  );
};

export default MapContainer;
