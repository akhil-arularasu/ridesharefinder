import React, { useState, useEffect } from 'react';
import Rides from './Rides';
import SearchableDropdown from './SearchableDropdown';
import "./SearchableDropdown.css";
import { Grid, Icon, Message, Container, Label } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import Range from 'multi-range-slider-react';
import LocationAutocomplete from './LocationAutocomplete'; // Import the component


function RideSearch({refreshKey, setRefreshKey, myRides}) {
  console.log('my', myRides) // its empty here as well
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
    rideDate: getCurrentDate(),
    startTime: 0,
    endTime: 1439,
    startLocation: null,
    endLocation: null
  });

  useEffect(() => {
    const userToken = localStorage.getItem('token'); // Retrieve the token
    
    const { rideDate, startTime, endTime, startLocation, endLocation } = searchParams;

    // Convert startTime and endTime from minutes to "HH:MM" format
    const startTimeInHHMM = minutesToTime(startTime);
    const endTimeInHHMM = minutesToTime(endTime);  

    if (startLocation && endLocation) {
      console.log('Making API request with the following pars:', {
        rideDate,
        startTimeInHHMM,
        endTimeInHHMM,
        startLatitude: startLocation.lat,
        startLongitude: startLocation.lng,
        endLatitude: endLocation.lat,
        endLongitude: endLocation.lng
      });
  
      fetch(process.env.REACT_APP_SERVER +
        `/api/searchRides?rideDate=${rideDate}&startTime=${startTimeInHHMM}&endTime=${endTimeInHHMM}&startLatitude=${startLocation.lat}&startLongitude=${startLocation.lng}&endLatitude=${endLocation.lat}&endLongitude=${endLocation.lng}`, {
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
          console.log('API response data:', data);
          if (data.rides && Array.isArray(data.rides)) {
            const updatedRides = data.rides.map(ride => ({
              ...ride
            }));
            setRides(updatedRides);
            setError('');
          } else if (data.message) {
            setRides([]);
            setError(data.message);
          } else {
            throw new Error('Invalid data format');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          setError('Failed to fetch rides. Please try again later.');
        });
    }
  }, [searchParams, refreshKey, navigate]); // Add searchParams to the dependency array
 
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

  const handleStartLocationSelect = (location) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      startLocation: location
    }));
  };

  const handleEndLocationSelect = (location) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      endLocation: location
    }));
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
          <Grid.Column width={4}>        
            <Label htmlFor="fromLocationDropdown" >
              Start Location <span style={{ marginRight: '1em' }}></span><Icon name="location arrow" />
            </Label>
            <div className="RideSearch">
              <LocationAutocomplete onSelect={handleStartLocationSelect} />
            </div>
          </Grid.Column>        
          <Grid.Column width={4}>        
            <Label htmlFor="toLocationDropdown">
              Destination <span style={{ marginRight: '1em' }}></span><Icon name="map marker alternate" />
            </Label>
            <div className="RideSearch">
              <LocationAutocomplete onSelect={handleEndLocationSelect} />
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