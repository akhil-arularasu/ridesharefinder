import React, { useState, useEffect } from 'react';
import Rides from './Rides';
import RideView from './RideView'
import { Dropdown } from 'semantic-ui-react';
import SearchableDropdown from './SearchableDropdown';
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import "./SearchableDropdown.css"

function timeToSliderValue(time) {
  // Assuming time is in format 'HH:MM'
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes; // Convert time to minutes since midnight
}

function sliderValueToTime(value) {
  let totalMinutes = value;
  totalMinutes = Math.max(0, totalMinutes); // Ensure value is not below 0
  totalMinutes = Math.min(24 * 60 - 1, totalMinutes); // Ensure value is not above 1439 (which is 23:59 in minutes)

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function RideSearch() {
  const [rides, setRides] = useState([{}]);
  const [searchParams, setSearchParams] = useState({
    fromLocationId: "2",
    toLocationId: "3",
    rideDate: "2023-12-27",
    startTime: "1:00",
    endTime: "23:00"
  });

  useEffect(() => {
    const { fromLocationId, toLocationId, rideDate, startTime, endTime } = searchParams;
    fetch(
      `/api/search?fromLocationId=${fromLocationId}&toLocationId=${toLocationId}&rideDate=${rideDate}&startTime=${startTime}&endTime=${endTime}`
    ).then((res) =>
      res.json().then((data) => {
        console.log('Ride data:', data); // Add this line to log the response
        setRides(data.rides);
      })
    );
  }, [searchParams]);

  const handleTimeSliderChange = (e) => {
    const { name, value } = e.target;
    const newValue = Number(value);
    let newStartTime = timeToSliderValue(searchParams.startTime);
    let newEndTime = timeToSliderValue(searchParams.endTime);
  
    if (name === 'startTime' && newValue >= newEndTime) {
      // Set the start time to one minute less than the end time
      newStartTime = newEndTime - 1;
    } else if (name === 'endTime' && newValue <= newStartTime) {
      // Set the end time to one minute more than the start time
      newEndTime = newStartTime + 1;
    } else {
      // No overlap, set the new value
      if (name === 'startTime') {
        newStartTime = newValue;
      } else {
        newEndTime = newValue;
      }
    }
  
    setSearchParams((prevParams) => ({
      ...prevParams,
      startTime: sliderValueToTime(newStartTime),
      endTime: sliderValueToTime(newEndTime),
    }));
  };
  
  const maxSliderValue = 24 * 60 - 1; // 1439, representing 23:59

  // Handler for when search parameters change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value
    }));
    console.log('search',searchParams)
  };

  const [locationOptions, setLocationOptions] = useState([]);
  const [fromValue, setFromValue] = useState(null);
  const [toValue, setToValue] = useState(null);

  useEffect(() => {
    fetch(process.env.REACT_APP_SERVER + '/api/locations')
      .then(response => response.json())
      .then(data => {
        const formattedOptions = data.map(location => ({
          id: location.location_id, // Replace 'id' with the actual identifier property from your API
          label: location.location_name, // Replace 'name' with the actual property name from your API
        }));
        setLocationOptions(formattedOptions);
      })
      .catch(error => console.error('Error fetching locations:', error));
  }, []);

  const findIdByName = (locationName) => {
    const location = locationOptions.find(option => option.label === locationName);
    return location ? location.id : null;
};

  // Define a custom change handler
  const handleValueChange = (selectedOption) => {
  console.log('Selected option:', selectedOption);
    
  const fromlocId = findIdByName(selectedOption)
  console.log('Location ID:', fromlocId);

    setSearchParams(prevParams => ({
      ...prevParams,
      fromLocationId: fromlocId
    }));

    // Update the state with the new value
    setFromValue(selectedOption);
  };

  const handleToLocationChange = (selectedOption) => {
    console.log('Selected option for To Location:', selectedOption);

    const tolocId = findIdByName(selectedOption);
    console.log('To Location ID:', tolocId);

    setSearchParams(prevParams => ({
      ...prevParams,
      toLocationId: tolocId
      
    }))
    
    setToValue(selectedOption);
  }
    ;
  
  return (
    <div>
    <h2>Search Rides</h2>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ marginRight: '20px' }}>
      </div>
      </div>
      <label htmlFor="fromLocationDropdown" className="dropdown-label">From Location</label>
      <div className="RideSearch">
      <SearchableDropdown
        options={locationOptions}
        label="label"
        id="fromLocationDropdown"
        selectedVal={fromValue}
        handleChange={handleValueChange} // Use the custom handler
      />
    </div>
    {/* Dropdown for To Location */}
    <label htmlFor="toLocationDropdown" className="dropdown-label">To Location</label>
      <div className="RideSearch">
        <SearchableDropdown
          options={locationOptions}
          label="label"
          id="toLocationDropdown"
          selectedVal={toValue} // Update this if managing separate state for ToLocation
          handleChange={handleToLocationChange} // Use the custom handler for To Location
        />
      </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '10px' }}>
        {/* Row for Date and Time Range Selectors */}
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          <div style={{ marginRight: '20px' }}>
            <label htmlFor="rideDate">Ride Date:</label>
            <input
              id="rideDate"
              type="date"
              name="rideDate"
              value={searchParams.rideDate}
              onChange={handleInputChange}
            />
          </div>
          <div style={{ marginRight: '20px' }}>
            <label htmlFor="startTime">Start Time: {searchParams.startTime}</label>
            <input
              id="startTime"
              type="range"
              name="startTime"
              min="0"
              max={maxSliderValue}
              value={timeToSliderValue(searchParams.startTime)}
              onChange={handleTimeSliderChange}
            />
          </div>
          <div>
            <label htmlFor="endTime">End Time: {searchParams.endTime}</label>
            <input
              id="endTime"
              type="range"
              name="endTime"
              min="0"
              max={maxSliderValue}
              value={timeToSliderValue(searchParams.endTime)}
              onChange={handleTimeSliderChange}
            />
          </div>
        </div>
  
        {/* Displaying the selected times */}
        <div style={{ marginBottom: '20px' }}>
          Start Time: {searchParams.startTime} - End Time: {searchParams.endTime}
        </div>
      </div>
      <RideView rides={rides} />
    </div>
  );  
  }

export default RideSearch;
