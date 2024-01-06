import React, { useState, useEffect } from 'react';
import Rides from './Rides';
import RideView from './RideView'
import { Dropdown } from 'semantic-ui-react';
import SearchableDropdown from './SearchableDropdown';
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import "./SearchableDropdown.css"


function convertTo24HourFormat(time) {
  // Split the time and AM/PM part
  const [timePart, modifier] = time.split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);

  // Convert to 24-hour format
  if (hours === 12) {
    hours = modifier === 'AM' ? 0 : 12;
  } else if (modifier === 'PM') {
    hours += 12;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function convertTo12HourFormat(time) {
  if (!time || !time.includes(':')) return time; // Return the original time if it's undefined or not in the expected format
  let [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

function timeToSliderValue(time) {
  let [timePart, modifier] = time.split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);
  hours = (modifier === 'PM' && hours !== 12) ? hours + 12 : hours;
  hours = (modifier === 'AM' && hours === 12) ? 0 : hours;

  return hours * 60 + minutes;
}

function sliderValueToTime(value) {
  let totalMinutes = value;
  totalMinutes = Math.max(0, totalMinutes);
  totalMinutes = Math.min(24 * 60 - 1, totalMinutes);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;

  return `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

function RideSearch({refreshKey, setRefreshKey}) {
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  const getCurrentTime = () => {
    const now = new Date();
    return now.toISOString().split('T')[1].substr(0, 5);
  };

  const [rides, setRides] = useState([{}]);
  const [searchParams, setSearchParams] = useState({
    fromLocationId: "2",
    fromLocationName: "Emory Atlanta Campus",
    toLocationName: "ATL Hartsfield-Jackson Airport",
    toLocationId: "3",
    rideDate: getCurrentDate(),
    startTime: getCurrentTime(),
    endTime: "23:59" // You can keep this as the end of the day if that makes sense for your application
  });
  useEffect(() => {
    const userToken = localStorage.getItem('token'); // Retrieve the token
    const { fromLocationId, toLocationId, rideDate, startTime, endTime } = searchParams;
    fetch(process.env.REACT_APP_SERVER +
      `/api/search?fromLocationId=${fromLocationId}&toLocationId=${toLocationId}&rideDate=${rideDate}&startTime=${startTime}&endTime=${endTime}`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        }
      }
    ).then((res) =>
      res.json().then((rides) => {
        console.log('Ride data:', rides); // Log the response
        const updatedRides = rides.map(ride => ({
          ...ride,
          rideTime: convertTo12HourFormat(ride.rideTime)
        }));
       
        setRides(updatedRides);
      })
    );
  }, [searchParams, refreshKey]);
  
  const handleTimeSliderChange = (e) => {
    const { name, value } = e.target;
    const newValue = Number(value);
    let newStartTime = timeToSliderValue(searchParams.startTime);
    let newEndTime = timeToSliderValue(searchParams.endTime);
  
    if (name === 'startTime' && newValue >= newEndTime) {
      newStartTime = newEndTime - 1;
    } else if (name === 'endTime' && newValue <= newStartTime) {
      newEndTime = newStartTime + 1;
    } else {
      if (name === 'startTime') {
        newStartTime = newValue;
      } else {
        newEndTime = newValue;
      }
    }
  
    setSearchParams((prevParams) => ({
      ...prevParams,
      startTime: convertTo24HourFormat(sliderValueToTime(newStartTime)),
      endTime: convertTo24HourFormat(sliderValueToTime(newEndTime)),
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
    console.log('search', searchParams)
  };

  const [locationOptions, setLocationOptions] = useState([]);
  const [fromValue, setFromValue] = useState(null);
  const [toValue, setToValue] = useState(null);

  useEffect(() => {
    const userToken = localStorage.getItem('token'); // Retrieve the token
    fetch(process.env.REACT_APP_SERVER + '/api/locations', {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      }
    })
      .then(response => response.json())
      .then(data => {
        const formattedOptions = data.map(location => ({
          id: location.location_id, // Replace 'id' with the actual identifier property from your API
          label: location.location_name, // Replace 'name' with the actual property name from your API
          isCampus: location.isCampus
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
      fromLocationId: fromlocId,
    }));

    // Update the state with the new value
    setFromValue(selectedOption);
    setToValue(null)
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

  const getFromLocation = () => {
    return locationOptions.find(option => option.id === searchParams.fromLocationId);
  };
  
  const getToLocationOptions = () => {
    const fromLocation = getFromLocation();
    const isFromLocationCampus = fromLocation ? fromLocation.isCampus : false;

    return locationOptions.filter(option => {
      // Exclude the selected 'From Location'
      if (option.id === searchParams.fromLocationId) return false;
  
      // If 'From Location' is a campus, show only non-campus locations for 'To Location'
      // If 'From Location' is not a campus, show only campus locations for 'To Location'
      return isFromLocationCampus ? !option.isCampus : option.isCampus;
    });
  };
    
  return (
    
    <div>
    <h2>Search Rides</h2>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginLeft: '10px' }}>
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
          options={getToLocationOptions()}
          label="label"
          id="toLocationDropdown"
          selectedVal={toValue} // Update this if managing separate state for ToLocation
          handleChange={handleToLocationChange} // Use the custom handler for To Location
          disabled={!fromValue} // Disable if fromValue is null or empty
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
        <div style={{ marginBottom: '20px' }}>
            Start Time: {convertTo12HourFormat(searchParams.startTime)} - End Time: {convertTo12HourFormat(searchParams.endTime)}
        </div>
      </div>
      <RideView rides={rides} setRides={setRides} setRefreshKey={setRefreshKey}/>
    </div>
  );  
  }

export default RideSearch;
