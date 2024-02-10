import React,{useState} from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
//import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, Grid, Icon } from 'semantic-ui-react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const convertTo12HourFormat = (time) => {
    if (!time) return ''; // Return an empty string if time is not provided
  
    let [hours, minutes] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours || 12; // the hour '0' should be '12'
  
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };
  

  function RideCard({ ride, handleLeaveClick, handleJoinClick, isMyRide }) {
    const [expanded, setExpanded] = useState(false);
    const [otherRiders, setOtherRiders] = useState([]);
    const [hostDetails, setHostDetails] = useState(null);
    const [seatsRemaining, setSeatsRemaining] = useState(ride.seatsRemaining); // Local state to manage seats remaining input
    const [editMode, setEditMode] = useState(false); // State to toggle edit mode
    const navigate = useNavigate();

    const handleSaveSeats = (e) => {
      e.preventDefault();
      
      const userToken = localStorage.getItem('token');
      const updatedSeats = parseInt(seatsRemaining, 10); // Parse it once and use this variable

    
      console.log("ride_id:", ride.ride_id);
      console.log("seatsRemaining before parseInt:", updatedSeats);
      
      fetch(process.env.REACT_APP_SERVER + '/api/updateSeats', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rideId: ride.ride_id,
          seatsRemaining: parseInt(seatsRemaining, 10), // Ensure conversion to integer
        }),
      })
      .then(response => {
        if (!response.ok) {
          if (response.status === 401) {
            // Handle unauthorized access
            navigate('/login');
            return;
          }
          // Handle other HTTP errors
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setSeatsRemaining(updatedSeats);
        console.log('Success:', data);

        // Update component state here if necessary
        // For instance, you might want to update a state variable that tracks the number of seats
        // Or you could trigger a re-fetch or update of the ride's details to reflect the new seats remaining
    
        // Example: setRideDetails((prevDetails) => ({ ...prevDetails, seatsRemaining: parseInt(seatsRemaining, 10) }));
        // This is just an example. Adjust based on your actual state management logic.
      })
      .catch(error => {
        console.error('Error updating seats:', error.message || error);
        alert(`Error updating seats: ${error.message || 'Please try again.'}`);
      })      
      .finally(() => {
        setEditMode(false); // Exit edit mode
      });
    };
    
  const handleExpandClick = (rideId) => {
      if (!expanded)
      {
        console.log("fetch the details now", rideId);
        fetchRideDetails(rideId)
        setExpanded(!expanded);
      }
      else
        setExpanded(!expanded);
  };

  const fetchRideDetails = (rideId) => {
    const userToken = localStorage.getItem('token');
    fetch(process.env.REACT_APP_SERVER + `/api/rideDetails?rideId=${rideId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + userToken,
      },
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized access
          navigate('/login');
          return;
        }
        // Handle other HTTP errors
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.rides && data.rides.length > 0) {
        setHostDetails(data.rides[0]); // Assuming the first entry is the host
        console.log("test");
        // Process other riders
        const otherRidersData = data.rides.slice(1); // Get all entries except the first
        setOtherRiders(otherRidersData); // Update state with other riders' details
      }
    })
    .catch(error => {
      console.error('Error fetching ride details:', error);
      // Optionally handle the error more specifically
      // For example, show an error message to the user
    });
  };  

  return (
    <Card raised>
      <Grid stackable>
      <Grid.Column>      
      <Typography>
      <Icon name="location arrow" />
            { ride.fromLocationName}
          </Typography>
      <Typography>
      <Icon name="map marker alternate" />
          { ride.toLocationName}
      </Typography>
      <Typography>
          <Icon name="calendar alternate outline" />
          {ride.rideDate}
        </Typography>
        <Typography>
          <Icon name="clock outline" />
          {convertTo12HourFormat(ride.rideTime)}
        </Typography>
        <Typography>
          <Icon name="users" /> {/* Assuming you're using a compatible Icon component */}
            Seats Left:
            {isMyRide && editMode ? (
              <TextField
                size="small"
                type="number"
                value={seatsRemaining}
                onChange={(e) => setSeatsRemaining(e.target.value)}
                sx={{ width: 60 }} // Adjust width as needed
                inputProps={{ 
                  min: 0,  // Minimum value
                  max: 9,  // Maximum value
                }}
                />
            ) : (
              ` ${seatsRemaining}`
            )}
            {isMyRide && !editMode && (
            <Button onClick={() => setEditMode(true)} size="small" style={{ marginLeft: 8 }}>
              Edit
            </Button>
          )}
            {isMyRide && editMode && (
              <Button onClick={handleSaveSeats} size="small">
                Save
              </Button>
            )}
        </Typography>
      </Grid.Column>  
      </Grid>
      <CardActions disableSpacing>
        {isMyRide ? (
            <Button secondary type="button"
            onClick={() => handleLeaveClick(ride.ride_id)}
            aria-label={`Leaving ride from ${ride.fromLocationName} to ${ride.toLocationName}`}
            >
            Leave
            </Button>
        ) : (
            <Button primary type="button"
            onClick={() => handleJoinClick(ride.ride_id)}
            aria-label={`Joining ride from ${ride.fromLocationName} to ${ride.toLocationName}`}
            disabled={ride.seatsRemaining === 0} // Disable button if no seats are left
            >
            Join
            </Button>
        )}
      <ExpandMore
          expand={expanded}
          onClick={(rideId) => handleExpandClick(ride.ride_id)}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
            {hostDetails ? (
              <Typography>
                <Box>
                <Icon name="user" /> Host: {hostDetails.name}
                </Box>
                <Box>
                <Icon name="phone" /> {hostDetails.telNumber}
                </Box>
              </Typography>
            ) : (
              <div>Loading...</div>
            )}
            {otherRiders.map((rider, index) => (
              <Typography>
              <div key={index}>
              <div>
                <Icon name="user" />{index + 1}: {rider.name}
              </div>
              <div>
                <Icon name="phone" />{index + 1}: {rider.telNumber}
              </div>
              </div>
              </Typography>
            ))}
        </CardContent>
      </Collapse>
    </Card>
  );
}
export default RideCard;