import React,{useState, useEffect} from 'react'
import Rides from "./Rides"
import SearchableDropdown from './SearchableDropdown';
import { Button, Container, Grid, Select, Label, Icon, ButtonGroup, ButtonOr } from 'semantic-ui-react';


function MyRides({ refreshKey, setRefreshKey, rides }) {
  const [isEditing, setIsEditing] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);


  useEffect(() => {
    const userToken = localStorage.getItem('token');
    fetch(process.env.REACT_APP_SERVER + '/api/locations', {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      }
    })
      .then(response => response.json())
      .then(data => {
        const formattedOptions = data.map(location => ({
          id: location.location_id,
          label: location.location_name,
          isCampus: location.isCampus
        }));
        setLocationOptions(formattedOptions);
      })
      .catch(error => console.error('Error fetching locations:', error));
  }, []);


  const [addFormData, setAddFormData] = useState({
    fromLocationId: "",
    toLocationId: "",
    rideDate: "",
    rideTime:"",
    seatsLeft:""
  })


const handleFromLocationChange = (selectedLabel) => {
  const fromLocationObj = locationOptions.find(option => option.label === selectedLabel);
  if (fromLocationObj) {
    setAddFormData(prevFormData => ({
      ...prevFormData,
      fromLocationId: fromLocationObj.id
    }));
    setFromLocation(fromLocationObj);
    setToLocation(null); // Reset toLocation when fromLocation changes
  }
};


const handleToLocationChange = (selectedLabel) => {
  const toLocationObj = locationOptions.find(option => option.label === selectedLabel);
  if (toLocationObj) {
    setToLocation(toLocationObj);
  }
};
  const startEditingHandler = () => {
    setIsEditing(true);
  };


  const stopEditingHandler = () => {
    setIsEditing(false);
  };

  const getFromLocation = () => {
    return locationOptions.find(option => option.id === addFormData.fromLocationId);
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

  const getToLocationOptions = () => {
  const fromLocation = getFromLocation();


  const isFromLocationCampus = fromLocation ? fromLocation.isCampus : false;


  return locationOptions.filter(option => {
    // Exclude the selected 'From Location'
    if (option.id === addFormData.fromLocationId) return false;


    // Filter based on campus status
    return isFromLocationCampus ? !option.isCampus : option.isCampus;
  });
};


 const handleAddFormSubmit = (event) => {
  event.preventDefault();
  const newRide = {
    fromLocationId: fromLocation.id,
    toLocationId: toLocation.id,
    rideDate: addFormData.rideDate,
    rideTime: addFormData.rideTime,
    seatsRemaining: addFormData.seatsRemaining,
  };
  console.log('Sending data to the server:', newRide);
  const userToken = localStorage.getItem('token'); // Retrieve the token
 
  // Send the newRide data to the server
  fetch(process.env.REACT_APP_SERVER + '/api/create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`, // Include the token in headers
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newRide),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Here you can handle the response data
    console.log('Success:', data);
      setRefreshKey(prevRefreshKey => prevRefreshKey + 1)
  })
  .catch((error) => {
    console.error('Error:', error);
  })
  .finally(() => {
    // This block runs regardless of the outcome of the fetch request
    // Reset form data to initial state
    setAddFormData({
      fromLocationId: "",
      toLocationId: "",
      rideDate: "",
      rideTime: "",
      seatsLeft: ""
    });
 
    // If you're using a flag to show/hide the form (like isEditing),
    // you can also reset it here
    setIsEditing(false);
})};


useEffect(() => {
}, [locationOptions]);


useEffect(() => {
}, [addFormData.fromLocationId]);  


  return (
    <Container fluid>
    <Label as='a' color='blue' ribbon>
      My Tryps
    </Label>
   {rides.length === 0 ? (
        <div> You don't have any scheduled rides.</div>
      ) : (
      <Rides rides={rides} setRefreshKey={setRefreshKey} myRides={rides} />
      )}
      <br/>

      {!isEditing && (
      <Button onClick={startEditingHandler} primary><Icon name='add circle' />Add New Tryp</Button>
      )}


      {isEditing && (
        <>
      <Label  color='blue' ribbon>
          Add New Tryp
      </Label>        
      <form onSubmit={handleAddFormSubmit}>
      <Grid columns={5} stackable>
      <Grid.Column>        
      <Label htmlFor="fromLocationDropdown">Location
      <>
      <span style={{ marginRight: '1em' }}></span><Icon name="location arrow" />
      </>
      </Label>
      <SearchableDropdown
        options={locationOptions}
        label="label"
        id="fromLocationDropdown"
        selectedVal={fromLocation ? fromLocation.label : ""}
        handleChange={handleFromLocationChange}
      />
      </Grid.Column>        
      <Grid.Column>        
      <Label htmlFor="fromLocationDropdown" >Destination
      <>
      <span style={{ marginRight: '1em' }}></span><Icon name="map marker alternate" />
      </>
      </Label>
      <SearchableDropdown
        options={getToLocationOptions()} // You might need to filter this based on fromLocation
        label="label"
        id="toLocationDropdown"
        selectedVal={toLocation ? toLocation.label : ""}
        handleChange={handleToLocationChange}
        disabled={!fromLocation} // Disable if fromLocation is not selected
      />
      {!fromLocation && <p>Please select 'From Location' first.</p>}
      </Grid.Column>      
      <Grid.Row columns={6}>
      <Grid.Column >
      <Label htmlFor="RideDate">
        Ride Date
        </Label>    
        <input
        type = "date"
        name = "rideDate"
        required="required"
        placeholder="Enter Ride Date ..."
        onChange={handleAddFormChange}
        />  
      </Grid.Column>            
      <Grid.Column>  
        <Label htmlFor="rideTime">
        Ride Time
        </Label>
        &nbsp;
        <input
        type = "time"
        name = "rideTime"
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
        <Button inverted={false} primary >Save</Button>
      </ButtonGroup>        </Grid.Column>
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