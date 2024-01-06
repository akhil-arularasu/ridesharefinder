import React,{useState, useEffect} from 'react'
import Rides from "./Rides"
import { nanoid } from 'nanoid'
import SearchableDropdown from './SearchableDropdown';
import { Button } from 'semantic-ui-react';

function MyRides({refreshKey, setRefreshKey}) {
  const [rides, setRides]  = useState([])
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

  const handleAddFormChange = (event) => {
    const fieldName = event.target.getAttribute('name');
    const fieldValue = event.target.value;
    console.log(fieldValue)
   // console.log(addFormData)
    setAddFormData(prevFormData => ({
      ...prevFormData,
      [fieldName]: fieldValue
    }));
 };
 const getFromLocation = () => {
  return locationOptions.find(option => option.id === addFormData.fromLocationId);
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
    // Optionally update the rides state with the new ride
 //   const newRides = [...rides, newRide];
 //   setRides(newRides);
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

// Initial fetch when the component mounts
useEffect(() => {
  const userToken = localStorage.getItem('token');
  console.log('toknnnn', userToken)
  fetch(process.env.REACT_APP_SERVER + '/api/myRideSearch',
  {
    headers: {
      'Authorization': `Bearer ${userToken}`,
    }
  } 
  )
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('response', response.json)
      return response.json();
    })
    .then(data => {
      setRides(data || []);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}, [refreshKey]); // Empty dependency array for component mount


useEffect(() => {
}, [locationOptions]);

useEffect(() => {
}, [addFormData.fromLocationId]);  

  return (
    <div>
      <h2>My Rides</h2>
      <Rides rides={rides} setRides={setRides} setRefreshKey={setRefreshKey} />

      {!isEditing && (
      <Button onClick={startEditingHandler}>Add New Ride</Button>
    )}

      {isEditing && (
        <>
      <h2>Add a Ride</h2>
      <form onSubmit={handleAddFormSubmit}>
      <label htmlFor="fromLocationDropdown" className="dropdown-label">From Location:</label>
      <SearchableDropdown
        options={locationOptions}
        label="label"
        id="fromLocationDropdown"
        selectedVal={fromLocation ? fromLocation.label : ""}
        handleChange={handleFromLocationChange}
      />
      <label htmlFor="fromLocationDropdown" className="dropdown-label">To Location:</label>
      <SearchableDropdown
        options={getToLocationOptions()} // You might need to filter this based on fromLocation
        label="label"
        id="toLocationDropdown"
        selectedVal={toLocation ? toLocation.label : ""}
        handleChange={handleToLocationChange}
        disabled={!fromLocation} // Disable if fromLocation is not selected
      />
        <input
        type = "date"
        name = "rideDate"
        required="required"
        placeholder="Enter Ride Date ..."
        onChange={handleAddFormChange}
        style={{ marginRight: '10px', marginBottom: '10px', marginLeft: '10px' }} // Added left margin
        />   
         <input
        type = "time"
        name = "rideTime"
        required="required"
        placeholder="Enter Ride Time ..."
        onChange={handleAddFormChange}
        style={{ marginRight: '10px', marginBottom: '10px', marginLeft: '10px' }} // Added left margin
        />
      <label htmlFor="seatsRemaining" style={{ display: 'block', marginLeft: '10px', marginBottom: '10px'}}>
        Enter # of Seats Available (not including yourself):
      </label>
      <input
        type="number"
        name="seatsRemaining"
        id="seatsRemaining"
        required="required"
        placeholder="1-10"
        onChange={handleAddFormChange}
        min="1"
        max="10"
        style={{ marginBottom: '10px', marginLeft: '10px' }} // Added left margin
      />
      <div style={{ marginTop: '20px' }}> {/* Container for buttons with top margin */}
        <Button 
          type="submit" 
          inverted={false} // Adjust based on your state or context
          primary
          style={{ marginRight: '10px', marginLeft: '10px' }} // Right margin between buttons
        >
          Add Ride
        </Button>

        <Button 
          type="button" 
          onClick={stopEditingHandler} 
          inverted={false} // Adjust based on your state or context
        >
          Cancel
        </Button>
      </div>
        </form>
        </>
      )}
    </div>
    
  );
}

export default MyRides;