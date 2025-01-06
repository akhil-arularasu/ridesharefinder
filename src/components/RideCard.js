import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, Grid, Icon } from 'semantic-ui-react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Tooltip from '@material-ui/core/Tooltip';

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

function RideCard({ ride, handleLeaveClick, handleJoinClick, isMyRide}) {
  const [expanded, setExpanded] = useState(false);
  const [otherRiders, setOtherRiders] = useState([]);
  const [hostDetails, setHostDetails] = useState(null);
  const [seatsRemaining, setSeatsRemaining] = useState(ride.seatsRemaining); // Local state to manage seats remaining input
  const [editMode, setEditMode] = useState(false); // State to toggle edit mode
  const [loading, setLoading] = useState(true); // State to manage loading
  const navigate = useNavigate();

  // Update seatsRemaining whenever the ride prop changes
  useEffect(() => {
    setSeatsRemaining(ride.seatsRemaining);
  }, [ride.seatsRemaining]);

  useEffect(() => {
    if (expanded) {
      fetchRideDetails(ride.ride_id);
    }
  }, [ride.ride_id, expanded]); // Re-fetch ride details when ride_id or expanded state changes    

  const handleSaveSeats = (e) => {
    e.preventDefault();
    const userToken = localStorage.getItem('token');
    const updatedSeats = parseInt(seatsRemaining, 10); // Parse it once and use this variable

    fetch(process.env.REACT_APP_SERVER + '/api/updateSeats', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ride_id: ride.ride_id,
        seatsRemaining: updatedSeats, // Ensure conversion to integer
      }),
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      setSeatsRemaining(updatedSeats);
      console.log('Success:', data);
    })
    .catch(error => {
      console.error('Error updating seats:', error.message || error);
      alert(`Error updating seats: ${error.message || 'Please try again.'}`);
    })      
    .finally(() => {
      setEditMode(false); // Exit edit mode
    });
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const fetchRideDetails = (ride_id) => {
    const userToken = localStorage.getItem('token');
    fetch(process.env.REACT_APP_SERVER + `/api/locRideDetails?ride_id=${ride_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + userToken,
      },
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.rides && data.rides.length > 0) {
        setHostDetails(data.rides[0]); // Assuming the first entry is the host
        const otherRidersData = data.rides.slice(1); // Get all entries except the first
        setOtherRiders(otherRidersData); // Update state with other riders' details
        console.log('hostDetails:', hostDetails); // Log the host details
        console.log('otherRiders:', data.rides.slice(1).map(rider => rider.name)); // Log the other riders' details
      }
      setLoading(false); // Set loading to false after data is fetched
    })
    .catch(error => {
      console.error('Error fetching ride details:', error);
      setLoading(false); // Set loading to false even if there's an error
    });
  };

  useEffect(() => {
    if (ride && ride.ride_id) {
      fetchRideDetails(ride.ride_id);
    }
  }, [ride]);

  useEffect(() => {
    console.log('Ride object:', ride); // Log the ride object to verify its structure
  }, [ride]);

  // Map properties to use standardized names
  const startLocationName = ride.startLocationName || ride.fromLocationName;
  const endLocationName = ride.endLocationName || ride.toLocationName;  

  const handleJoin = (rideId) => {
    handleJoinClick(rideId);
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <Card raised>
      <Grid stackable>
        <Grid.Column>
          <Typography>
            <Icon name="location arrow" />
            <Tooltip title={ride.startLocationName} arrow>
            <span>{truncateText(startLocationName, 41)}</span>
            </Tooltip>
          </Typography>
          <Typography>
            <Icon name="map marker alternate" />
            {truncateText(endLocationName, 41)}
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
            {editMode ? (
              <TextField
                size="small"
                type="number"
                value={seatsRemaining}
                onChange={(e) => setSeatsRemaining(e.target.value)}
                sx={{ width: 60 }} // Adjust width as needed
                inputProps={{ 
                  min: 0,  // Minimum value
                  max: 7,  // Maximum value
                }}
              />
            ) : (
              ` ${seatsRemaining}`
            )}
            {ride.isHost && !editMode && (
              <Button onClick={() => setEditMode(true)} size="small" sx={{ ml: 1 }}>
                Edit
              </Button>
            )}
            {ride.isHost && editMode && (
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
            aria-label={`Leaving ride from ${startLocationName} to ${endLocationName}`}
          >
            Leave
          </Button>
        ) : (
          <Button primary type="button"
            onClick={() => handleJoin(ride.ride_id)}
            aria-label={`Joining ride from ${startLocationName} to ${endLocationName}`}
            disabled={
              ride.seatsRemaining === 0 || new Date(ride.rideDate) < new Date()
            } // Disable if no seats left or date is in the past
            >
            Join
          </Button>
        )}
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
      <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              {hostDetails && (
                <Typography>
                  <Box>
                    <Icon name="user" /> Host: {hostDetails.name}
                  </Box>
                  {isMyRide && (
                    <Box>
                      <Icon name="phone" /> {hostDetails.telNumber}
                    </Box>
                  )}
                </Typography>
              )}
              {otherRiders.map((rider, index) => (
                <div key={index}>
                  <Typography>
                    <Icon name="user" /> {index + 1}: {rider.name}
                  </Typography>
                  {isMyRide && (
                    <Typography>
                      <Icon name="phone" /> {index + 1}: {rider.telNumber}
                    </Typography>
                  )}
                </div>
              ))}
            </>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default RideCard;
