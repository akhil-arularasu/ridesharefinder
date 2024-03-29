import React,{useState, useEffect, Fragment } from 'react'
import { Grid } from "semantic-ui-react";
import RideCard from "./RideCard";
import { useNavigate } from 'react-router-dom';


function Rides ({rides, setRefreshKey, myRides, setError}) {

  console.log('Rides props:', rides); // Check the received rides array

  const checkRideIsMyRide = (ride_id) => {
    // Use Array.prototype.some to check if any object in myRides has the given ride_id
    console.log("check is my ride_id", ride_id)
    const isMyRide =  myRides.some(ride => ride.ride_id === ride_id);
    console.log("myride - ", isMyRide)
    return isMyRide;
  };

  const navigate = useNavigate();

  const handleLeaveClick = (ride_id) => {
    const token = localStorage.getItem('token');
    console.log('Sending data:', { ride_id });
    fetch(process.env.REACT_APP_SERVER + '/api/leave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ride_id })
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
    .then(() => {
      console.log('Leaving ride ID:', ride_id);
      setRefreshKey(prevRefreshKey => prevRefreshKey + 1);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };
  
  function handleJoinClick(ride_id) {
    const userToken = localStorage.getItem('token');
    fetch(process.env.REACT_APP_SERVER + '/api/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ ride_id: ride_id })
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
    .then((data) => {
      if (data.error)
         throw new Error(data.error)
      console.log('Joining ride ID:', ride_id);
      setRefreshKey(prevRefreshKey => prevRefreshKey + 1);
    })
    .catch(error => {
      console.error('Error:', error);
      setError(error.message)
    });
  };
  
  return (
    <form>
      <Grid stackable>
      <Grid.Row columns={5}>
      {rides.length === 0 ? (
        <div> No rides found.</div>
      ) : (
        Array.isArray(rides) && rides.map((ride, index) => (
          <Grid.Row columns={5} key={index} style={{ marginBottom: '20px' }}> {/* Adjust marginBottom as needed */}
            <Grid.Column>    
              <RideCard
                ride={ride}
                handleLeaveClick={handleLeaveClick}
                handleJoinClick={handleJoinClick}
                isMyRide={checkRideIsMyRide(ride.ride_id)}
              />
            </Grid.Column>
          </Grid.Row>
        ))
      )}
    </Grid.Row>
    </Grid>
    </form>
  );
}


export default Rides;
