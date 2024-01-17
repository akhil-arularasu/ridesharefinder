import React,{useState, useEffect, Fragment } from 'react'
import { Grid } from "semantic-ui-react";
import RideCard from "./RideCard";
import { useNavigate } from 'react-router-dom';


function Rides ({rides, setRefreshKey, myRides}) {
  console.log('Rides props:', rides); // Check the received rides array

  const checkRideIsMyRide = (rideId) => {
    // Use Array.prototype.some to check if any object in myRides has the given rideId
    console.log("check is my rideid", rideId)
    console.log(" my rides", myRides)
    const isMyRide =  myRides.some(ride => ride.ride_id === rideId);
    console.log("myride - ", isMyRide)
    return isMyRide;
  };
  const navigate = useNavigate();

  const handleLeaveClick = (rideId) => {
    const token = localStorage.getItem('token');
    console.log('Sending data:', { rideId });
    fetch(process.env.REACT_APP_SERVER + '/api/leave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ rideId })
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          navigate('/Login');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      console.log('Leaving ride ID:', rideId);
      setRefreshKey(prevRefreshKey => prevRefreshKey + 1);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };
  
  function handleJoinClick(rideId) {
    const userToken = localStorage.getItem('token');
    fetch(process.env.REACT_APP_SERVER + '/api/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ ride_id: rideId })
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          navigate('/Login');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      console.log('Joining ride ID:', rideId);
      setRefreshKey(prevRefreshKey => prevRefreshKey + 1);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };
  
  return (
    <form>
      <Grid stackable>
      <Grid.Row columns={3}>
      {rides.length === 0 ? (
        <div> No rides found.</div>
      ) : (
        Array.isArray(rides) && rides.map((ride, index) => (
          <Grid.Row columns={3} key={index} style={{ marginBottom: '20px' }}> {/* Adjust marginBottom as needed */}
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
