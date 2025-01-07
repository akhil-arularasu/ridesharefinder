import React from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';
import '@reach/combobox/styles.css';

const LocationAutocomplete = ({ label, onSelect }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      const locationName = address; // Use the selected address as the name

      // Send back only name, latitude, and longitude
      onSelect({ locationName, lat, lng });
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <div>
      <label>{label}</label>
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Start typing an address"
          style={{ width: '90%', padding: '1px', fontSize: '16px' }} // Add this line
        />
        <ComboboxPopover>
          {status === 'OK' && (
            <ComboboxList>
              {data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
            </ComboboxList>
          )}
        </ComboboxPopover>
      </Combobox>
    </div>
  );
};

export default LocationAutocomplete;
