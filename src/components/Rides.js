import React, { useState, useEffect, Fragment } from 'react';
import { Grid } from "semantic-ui-react";
import RideCard from "./RideCard";
import { useNavigate } from 'react-router-dom';

function Rides({ rides, setRefreshKey, myRides, setError }) {
  console.log("Parent Component - myRides: ", myRides); // problem myRides is coming in empty


  const checkRideIsMyRide = (ride_id) => {
    // Use Array.prototype.some to check if any object in myRides has the given ride_id
    console.log("check is my ride_id", ride_id);
    const isMyRide = myRides.some(ride => ride.ride_id === ride_id); // problem is that myRides is emtpy
    console.log("myride - ", isMyRide);
    return isMyRide;
  };

  const navigate = useNavigate();

  const handleLeaveClick = (ride_id) => {
    const token = localStorage.getItem('token');
    fetch(process.env.REACT_APP_SERVER + '/api/leave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ride_id })
    })
    .then(response => {
      console.log('Response status:', response.status); // Debugging: log response status
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
      if (data.error) {
        throw new Error(data.error);
      }
      if (!data.ride_id) {
        throw new Error("ride_id is missing in the response");
      }
      setRefreshKey(prevRefreshKey => prevRefreshKey + 1);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const handleJoinClick = (ride_id) => {
    const userToken = localStorage.getItem('token');
    fetch(process.env.REACT_APP_SERVER + '/api/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
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
    .then((data) => {
      if (data.error)
         throw new Error(data.error);
      console.log('Joined ride ID from backend:', data.ride_id); // Print the ride_id from the backend
      setRefreshKey(prevRefreshKey => prevRefreshKey + 1);
    })
    .catch(error => {
      console.error('Error:', error);
      setError(error.message);
    });
  };
  
  return (
    <form>
      <Grid stackable>
        <Grid.Row columns={4}>
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
                    isMyRide={checkRideIsMyRide(ride.ride_id)} // Use ride.id instead of ride.ride_id
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