import React,{useState, useEffect} from 'react'
import MyRides from "./components/MyRides"
import RideSearch from "./components/RideSearch"
import { InView } from 'react-intersection-observer'
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { SegmentGroup, Segment } from 'semantic-ui-react';


function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [myRides, setMyRides] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const userToken = localStorage.getItem('token');

    // Redirect to login page if token is not found
    if (!userToken) {
      navigate('/login'); // Redirect using react-router v6 useNavigate hook
      return; // Exit the useEffect hook early
    }

    fetch(process.env.REACT_APP_SERVER + '/api/myRideSearch', {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setMyRides(data || []);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }, [refreshKey, navigate]); // Add 'history' to the dependency array
  
  return <SegmentGroup>
    <Segment>
    <MyRides refreshKey = {refreshKey} setRefreshKey={setRefreshKey} rides={myRides} />
    </Segment>
    <Segment>
   <RideSearch refreshKey = {refreshKey} setRefreshKey={setRefreshKey} myRides={myRides}/>
   </Segment>
   </SegmentGroup>;

}

export default Dashboard