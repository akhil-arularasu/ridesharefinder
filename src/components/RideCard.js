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
  

function RideCard({ride, handleLeaveClick, handleJoinClick, isMyRide}) {
  const [expanded, setExpanded] = React.useState(false);
  const [otherRiders, setOtherRiders] = useState([]);
  const [hostDetails, setHostDetails] = useState(null);
  const navigate = useNavigate();


  const handleExpandClick = (rideId) => {
      if (!expanded)
      {
        console.log("fet the details now", rideId);
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
          navigate('/Login');
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
          <Icon name="users"/>
          { ride.seatsRemaining}
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
            disabled={ride.seatsLeft === 0} // Disable button if no seats are left
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
                Ride Host: {hostDetails.name}
                </Box>
                <Box>
                Host Phone Number: {hostDetails.telNumber}
                </Box>
              </Typography>
            ) : (
              <div>Loading...</div>
            )}
            {otherRiders.map((rider, index) => (
              <Typography>
              <div key={index}>
              <div>Rider {index + 1} Name: {rider.name}</div>
              <div>Rider {index + 1} Phone Number: {rider.telNumber}</div>
              </div>
              </Typography>
            ))}
        </CardContent>
      </Collapse>
    </Card>
  );
}
export default RideCard;