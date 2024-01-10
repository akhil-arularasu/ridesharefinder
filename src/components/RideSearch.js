import React, { useState, useEffect } from 'react';
import Rides from './Rides';
import SearchableDropdown from './SearchableDropdown';
import "./SearchableDropdown.css"
import { Grid } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';


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

function RideSearch({refreshKey, setRefreshKey, myRides}) {
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [rides, setRides] = useState([{}]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    fromLocationId: "2",
    fromLocationName: "Emory Atlanta Campus",
    toLocationName: "ATL Hartsfield-Jackson Airport",
    toLocationId: "3",
    rideDate: getCurrentDate(),
    startTime: "00:00",
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
    )
    .then(response => {
      if (response.status === 401) {
        // If unauthorized, redirect to the login page
        navigate('/login');
        return;
      }
      return response.json();
    })
    .then((rides) => {
      // Process the rides data
      const updatedRides = rides.map(ride => ({
        ...ride
      }));
      setRides(updatedRides);
    })
    .catch((error) => {
      console.error('Error:', error);
      // Handle other errors
    });
  }, [searchParams, refreshKey, navigate]); // Add navigate to the dependency array
    
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
    console.log('userToken', userToken)
    fetch(process.env.REACT_APP_SERVER + '/api/locations', {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      }
    })
    .then(response => {
      if (response.status === 401) {
        // If unauthorized, redirect to the home page
        navigate('/Login');
        return;
      }
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
      .then(data => {
        const formattedOptions = data.map(location => ({
          id: location.location_id, // Replace 'id' with the actual identifier property from your API
          label: location.location_name, // Replace 'name' with the actual property name from your API
          isCampus: location.isCampus
        }));
        setLocationOptions(formattedOptions);
      })
      .catch(error => console.error('Error fetching locations:', error));
  }, [navigate]);

  const findIdByName = (locationName) => {
    const location = locationOptions.find(option => option.label === locationName);
    return location ? location.id : null;
};

  const [fromLocationSelected, setFromLocationSelected] = useState(false);

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

    setFromLocationSelected(!!selectedOption);
  };

const handleToLocationChange = (selectedOption) => {
    console.log('Selected option for To Location:', selectedOption);

    // Assuming you have a state or a way to check if 'From Location' is selected
    // For example, using a state variable `fromLocationSelected`
    if (!fromLocationSelected) {
        // Display an alert or set an error state
        alert("Please select a 'From Location' first.");
        return; // Exit the function to prevent further execution
    }

    const tolocId = findIdByName(selectedOption);
    console.log('To Location ID:', tolocId);

    setSearchParams(prevParams => ({
        ...prevParams,
        toLocationId: tolocId
    }));
    
    setToValue(selectedOption);
};

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
    <Grid stackable>
    <Grid.Row columns={5}>
    <Grid.Column>        
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
    </Grid.Column>        
      <Grid.Column>        
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
        {!fromValue && <p>Please select 'From Location' first.</p>}
      </div>
      </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={5}>
          <Grid.Column>
        {/* Row for Date and Time Range Selectors */}
            <label htmlFor="rideDate">Ride Date: </label>
            <input
              id="rideDate"
              type="date"
              name="rideDate"
              value={searchParams.rideDate}
              onChange={handleInputChange}
            />
          </Grid.Column>            
          <Grid.Column>  
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
          </Grid.Column>
          <Grid.Column>
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
            </Grid.Column>
            </Grid.Row>
      </Grid>
      <br/> 
      {rides.length === 0 ? (
            <div> No rides found for the given search criteria.</div>
        ) : (
      <Rides rides={rides} setRefreshKey={setRefreshKey} myRides={myRides}/>
      )}
      </div> 
  )}

export default RideSearch;
