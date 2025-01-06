import React, { useState } from 'react';
import LocationAutocomplete from './LocationAutocomplete';
import axios from 'axios';

const LocationForm = () => {
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (startLocation && endLocation) {
      try {
        const response = await axios.post('/api/locations', {
          startLocation,
          endLocation,
        });
        console.log('Response:', response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <LocationAutocomplete onSelect={setStartLocation} />
      <LocationAutocomplete onSelect={setEndLocation} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default LocationForm;