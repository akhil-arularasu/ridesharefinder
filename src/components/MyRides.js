import React,{useState, useEffect} from 'react'
import Rides from "./Rides"
import { nanoid } from 'nanoid'

function MyRides() {
  const [rides, setRides]  = useState([])
  const [isEditing, setIsEditing] = useState(false);
  
  const [addFormData, setAddFormData] = useState({
    fromLocationId: "",
    toLocationId: "",
    rideDate: "",
    rideTime:"",
    seatsLeft:""
  })

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

 const handleAddFormSubmit = (event) => {
  event.preventDefault();

  const newRide = {
    fromLocationId: addFormData.fromLocationId,
    toLocationId: addFormData.toLocationId,
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
    const newRides = [...rides, data];
    setRides(newRides);
    setRideSubmitted(true); // Indicate that a new ride has been submitted
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

const [rideSubmitted, setRideSubmitted] = useState(false);

// Fetch rides from the server
const fetchRides = (userToken) => {
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
};

// Initial fetch when the component mounts
useEffect(() => {
  const userToken = localStorage.getItem('token');
  console.log(userToken)
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
}, []); // Empty dependency array for component mount



// Fetch rides after submission
useEffect(() => {
  if (rideSubmitted) {
    fetchRides();
    setRideSubmitted(false); // Reset the flag after fetching
  }
}, [rideSubmitted]); // Runs when `rideSubmitted` changes

  return (
    <div>
      <h2>My Rides</h2>
      <Rides rides={rides} setRides={setRides} />

      {!isEditing && (
        <button onClick={startEditingHandler}>Add New Ride</button>
      )}

      {isEditing && (
        <>
      <h2>Add a Ride</h2>
      <form onSubmit={handleAddFormSubmit}>
        <input
        type="number"
        name="fromLocationId"
        required="required"
        placeholder="Enter From Location..."
        onChange={handleAddFormChange}
        />
        <input
        type = "number"
        name = "toLocationId"
        required="required"
        placeholder="Enter to Location..."
        onChange={handleAddFormChange}
        />      
        <input
        type = "date"
        name = "rideDate"
        required="required"
        placeholder="Enter Ride Date ..."
        onChange={handleAddFormChange}
        />   
         <input
        type = "time"
        name = "rideTime"
        required="required"
        placeholder="Enter Ride Time ..."
        onChange={handleAddFormChange}
        />
        <input
        type = "number"
        name = "seatsRemaining"
        required="required"
        placeholder="Enter # of Seats Available (not including yourself) ..."
        onChange={handleAddFormChange}
        />
      <button type="submit">Add Ride</button>
      <button type="button" onClick={stopEditingHandler}>Cancel</button>
        </form>
        </>
      )}
    </div>
    
  );
}

export default MyRides;
