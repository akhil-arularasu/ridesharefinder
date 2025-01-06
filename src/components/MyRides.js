import React, {useState, useEffect} from 'react'
import Rides from "./Rides"
import { Button, Container, Grid, Select, Label, Icon, Message, ButtonGroup, ButtonOr, Input } from 'semantic-ui-react';
import LocationAutocomplete from './LocationAutocomplete';

function MyRides({ refreshKey, setRefreshKey, rides }) {
  const [isEditing, setIsEditing] = useState(false);
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [error, setError] = useState(''); // Add an error state

  const [addFormData, setAddFormData] = useState({
    startLocationName: "",
    endLocationName: "",
    rideDate: "",
    rideTime: "",
    seatsRemaining: "",
    startLatitude: "",
    startLongitude: "",
    endLatitude: "",
    endLongitude: ""
  });

  const handleStartLocationSelect = ({ locationName, lat, lng }) => {
    console.log(locationName, lat, lng, 'location details');
    setAddFormData((prevParams) => ({
      ...prevParams,
      startLocationName: locationName, // Use the location name directly
      startLatitude: lat, // Latitude
      startLongitude: lng, // Longitude
    }));
  };
  
  const handleEndLocationSelect = ({ locationName, lat, lng }) => {
    console.log(locationName, lat, lng, 'location details');
    setAddFormData((prevParams) => ({
      ...prevParams,
      endLocationName: locationName, // Use the location name directly
      endLatitude: lat, // Latitude
      endLongitude: lng, // Longitude
    }));
  };

  const startEditingHandler = () => {
    setIsEditing(true);
  };

  const stopEditingHandler = () => {
    setIsEditing(false);
  };

  const handleAddFormChange = (event, data) => {
    let fieldName, fieldValue;

    // Check if the event is from a Semantic UI Select
    if (data) {
      fieldName = data.name;
      fieldValue = data.value;
    } else {
      fieldName = event.target.name;
      fieldValue = event.target.value;
    }

    setAddFormData(prevFormData => ({
      ...prevFormData,
      [fieldName]: fieldValue
    }));
  };

  const handleAddFormSubmit = (event) => {
    event.preventDefault();
    const newRide = {
      rideDate: addFormData.rideDate,
      rideTime: addFormData.rideTime,
      seatsRemaining: addFormData.seatsRemaining,
      startLocationName: addFormData.startLocationName,
      endLocationName: addFormData.endLocationName,
      startLatitude: addFormData.startLatitude,
      startLongitude: addFormData.startLongitude,
      endLatitude: addFormData.endLatitude,
      endLongitude: addFormData.endLongitude
    };
    console.log('Sending data to the server:', newRide);
    const userToken = localStorage.getItem('token'); // Retrieve the token
    setError('');

    // Send the newRide data to the server
    fetch(process.env.REACT_APP_SERVER + '/api/createRide', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`, // Include the token in headers
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRide),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => {
            throw new Error(data.error || 'Network response was not ok');
          });
        }
        return response.json();
      })
      .then(data => {
        // Here you can handle the response data
        console.log('Returned:', data);
        if (data.error) {
          throw new Error(data.error);
        }
        console.log('Ride information:', data.ride); // Log the ride information from the backend
        setRefreshKey(prevRefreshKey => prevRefreshKey + 1);
      })
      .catch((error) => {
        console.log('Error:', error.message);
        setError(error.message); // Set the error message from the response
      })
      .finally(() => {
        // This block runs regardless of the outcome of the fetch request
        // Reset form data to initial state
        setAddFormData({
          rideDate: "",
          rideTime: "",
          seatsRemaining: "",
          startLocationName: "",
          endLocationName: "",
          startLatitude: "",
          startLongitude: "",
          endLatitude: "",
          endLongitude: ""
        });

        // If you're using a flag to show/hide the form (like isEditing),
        // you can also reset it here
        setIsEditing(false);
      });
  };

  return (
    <Container fluid>
      <Label as='a' color='blue' ribbon>My Tryps</Label>
      {error && <Message error content={error} />}
      {rides.length === 0 ? (
        <div> You don't have any scheduled rides.</div>
      ) : (
        <Rides rides={rides} setRefreshKey={setRefreshKey} myRides={rides} setError={setError} />
      )}

      {!isEditing && (
        <Button onClick={startEditingHandler} primary><Icon name='add circle' />Create New Tryp</Button>
      )}

      {isEditing && (
        <>
          <Label color='blue' ribbon>
            Create New Tryp
          </Label>
          <form onSubmit={handleAddFormSubmit}>
            <Grid columns={5} stackable>
              <Grid.Column>
                <Label htmlFor="fromLocationDropdown">Start Location
                  <>
                    <span style={{ marginRight: '1em' }}></span><Icon name="location arrow" />
                  </>
                </Label>
              <LocationAutocomplete onSelect={handleStartLocationSelect} />
              </Grid.Column>
              <Grid.Column>
                <Label htmlFor="toLocationDropdown">Destination
                  <>
                    <span style={{ marginRight: '1em' }}></span><Icon name="map marker alternate" />
                  </>
                </Label>
                <LocationAutocomplete onSelect={handleEndLocationSelect} />
                {!fromLocation}
              </Grid.Column>
              <Grid.Row columns={7} stackable>
                <Grid.Column>
                  <Label htmlFor="RideDate" padded>
                    Ride Date
                  </Label>
                  &nbsp;
                  <input type="date"
                    name="rideDate"
                    required="required"
                    placeholder="Enter Ride Date ..."
                    min={new Date().toISOString().split("T")[0]} // Set the minimum date to today
                    onChange={handleAddFormChange}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Label htmlFor="rideTime">
                    Tryp Departure Time
                  </Label>
                  &nbsp;
                  <input
                    type="time"
                    name="rideTime"
                    required="required"
                    placeholder="Enter Ride Time ..."
                    onChange={handleAddFormChange}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Label htmlFor="seatsRemaining">
                    Seats Left
                    <>
                      <span style={{ marginRight: '1em' }}></span><Icon name="users" />
                    </>
                  </Label>
                  &nbsp;
                  <Select
                    name="seatsRemaining"
                    id="seatsRemaining"
                    required
                    onChange={(event, data) => handleAddFormChange(event, data)}
                    options={[...Array(9)].map((_, index) => ({
                      key: index + 1,
                      text: index + 1,
                      value: index + 1
                    }))}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <ButtonGroup>
                    <Button inverted={false} onClick={stopEditingHandler}>Cancel</Button>
                    <ButtonOr />
                    <Button inverted={false} primary>Save</Button>
                  </ButtonGroup>
                </Grid.Column>
                <Grid.Column>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </form>
        </>
      )}
    </Container>
  );
}

export default MyRides;