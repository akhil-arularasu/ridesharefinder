import React, { useState, useEffect } from 'react';
import Rides from './Rides';
import SearchableDropdown from './SearchableDropdown';
import "./SearchableDropdown.css";
import { Grid, Icon, Message, Container, Label } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import Range from 'multi-range-slider-react';

function RideSearch({refreshKey, setRefreshKey, myRides}) {
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Convert time string to minutes
  const timeToMinutes = (time) => {
    const [hours, minutes, period] = time.split(/[:\s]/);
    let totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    if (period === 'PM' && hours !== '12') totalMinutes += 12 * 60;
    return totalMinutes;
  };

  const [rides, setRides] = useState([]); // Initialize as an empty array
  const navigate = useNavigate();
  const [error, setError] = useState(''); // Add an error state
  const [searchParams, setSearchParams] = useState({
    fromLocationId: "2",
    fromLocationName: "Emory Atlanta Campus",
    toLocationName: "ATL Hartsfield-Jackson Airport",
    toLocationId: "3",
    rideDate: getCurrentDate(),
    startTime: 0,
    endTime: 1439
  });

  useEffect(() => {
    const userToken = localStorage.getItem('token'); // Retrieve the token
    
    const { fromLocationId, toLocationId, rideDate, startTime, endTime } = searchParams;

    // Convert startTime and endTime from minutes to "HH:MM" format
    const startTimeInHHMM = minutesToTime(startTime);
    const endTimeInHHMM = minutesToTime(endTime);  

    fetch(process.env.REACT_APP_SERVER +
      `/api/search?fromLocationId=${fromLocationId}&toLocationId=${toLocationId}&rideDate=${rideDate}&startTime=${startTimeInHHMM}&endTime=${endTimeInHHMM}`, {
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
    .then((data) => {
      // Check if data is an array before mapping
      if (Array.isArray(data)) {
        const updatedRides = data.map(ride => ({
          ...ride
        }));
        setRides(updatedRides);
        setError('');
      } else {
        throw new Error('Invalid data format');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      setError('Failed to fetch rides. Please try again later.');
    });
  }, [searchParams, refreshKey, navigate]); // Add navigate to the dependency array

  const handleTimeSliderChange = (values) => {
    console.log('Slider values:', values); // Debugging the slider values

    const { minValue, maxValue} = values;

    // Update the state only if there is a change
    if (minValue !== searchParams.startTime || maxValue !== searchParams.endTime) {
      setSearchParams((prevParams) => ({
        ...prevParams,
        startTime: minValue,
        endTime: maxValue,
      }));
    }
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
    .then(response => {
      if (response.status === 401) {
        // If unauthorized, redirect to the home page
        navigate('/login');
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
    
    const fromlocId = findIdByName(selectedOption);
    console.log('Location ID:', fromlocId);

    setSearchParams(prevParams => ({
      ...prevParams,
      fromLocationId: fromlocId,
    }));

    // Update the state with the new value
    setFromValue(selectedOption);
    setToValue(null);

    setFromLocationSelected(!!selectedOption);
  };

  const handleToLocationChange = (selectedOption) => {
    console.log('Selected option for To Location:', selectedOption);

    if (!fromLocationSelected) {
      alert("Please select a 'From Location' first.");
      return;
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
      if (option.id === searchParams.fromLocationId) return false;
      return isFromLocationCampus ? !option.isCampus : option.isCampus;
    });
  };
    
  const formatTime = (time) => {
    if (typeof time !== 'string' || !time.includes(':')) {
      console.error('Invalid time format. Expected a string in the format "HH:MM".');
      return time;
    }
  
    const [hours, minutes] = time.split(':');
    let formattedTime = '';
    let period = '';
  
    if (parseInt(hours) < 12) {
      formattedTime = `${hours}:${minutes}`;
      period = 'AM';
    } else if (parseInt(hours) === 12) {
      formattedTime = `${hours}:${minutes}`;
      period = 'PM';
    } else {
      formattedTime = `${parseInt(hours) - 12}:${minutes}`;
      period = 'PM';
    }
  
    return `${formattedTime} ${period}`;
  };

  // Convert minutes to time string in HH:mm format
  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    // If the time is 12:00, change it to 00:00
    if (hours === 12 && mins === 0) {
      return '00:00';
    }

    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  return (
    <Container fluid>
      <Label as='a' color='blue' ribbon>
      Search Tryps
      </Label>
      {error && <Message error content={error} />} 
      <Grid stackable>
      <Grid.Row columns={5}>
      <Grid.Column>        
      <Label htmlFor="fromLocationDropdown">
      Start Location <span style={{ marginRight: '1em' }}></span><Icon name="location arrow" />
      </Label>
      <div className="RideSearch">
      <SearchableDropdown
      options={locationOptions}
      label="label"
      id="fromLocationDropdown"
      selectedVal={fromValue}
      handleChange={handleValueChange} 
      />
      </div>
      </Grid.Column>        
      <Grid.Column>        
      <Label htmlFor="toLocationDropdown">
      Destination <span style={{ marginRight: '1em' }}></span><Icon name="map marker alternate" />
      </Label>
      <div className="RideSearch">
      <SearchableDropdown
      options={getToLocationOptions()}
      label="label"
      id="toLocationDropdown"
      selectedVal={toValue}
      handleChange={handleToLocationChange} 
      disabled={!fromValue} 
      />
      {!fromValue && <p>Please select 'From Location' first.</p>}
{/* Want a location added? <a href="https://forms.gle/CwUt69t7fJHqK2PJ6" target="_blank">Click Here</a> */}
      </div>
      </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={5}>
      <Grid.Column>
      <Label htmlFor="rideDate">Ride Date </Label>
      <input
      id="rideDate"
      type="date"
      name="rideDate"
      value={searchParams.rideDate}
      onChange={handleInputChange}
      className="hide-values"
      />
      </Grid.Column>            
      <Grid.Column>  
      <Label htmlFor="departureWindow">Departure Window </Label> {formatTime(minutesToTime(searchParams.startTime))} - {formatTime(minutesToTime(searchParams.endTime))}
      <Range
      id="departureWindow"
      min={0}
      max={1439}
      step={1}
      minValue={searchParams.startTime}
      maxValue={searchParams.endTime}
      onChange={handleTimeSliderChange}
      style={{ border: 'none', boxShadow: 'none', padding: '15px 10px' }}
      label='false'
      ruler='false'
      barInnerColor='#2185d0'

      />
      </Grid.Column>
      </Grid.Row>
      </Grid>
      <br/> 
      {rides.length === 0 ? (
      <div> No rides found for the given search criteria.</div>
      ) : (
      <Rides rides={rides} setRefreshKey={setRefreshKey} myRides={myRides} setError={setError}/>
      )}
    </Container> 
    );
}

export default RideSearch;
