import React,{useState, useEffect, Fragment } from 'react'
import { List, Header, Table } from "semantic-ui-react";
//import Card from './UI/Card';
import RideItem from './RideItem';


function RideView ({rides, setRefreshKey}) {

  console.log("Rides array:", rides);  // Check the structure and content of the rides array

  function handleJoinClick (rideId) {
    // Add your logic for handling a join click here
    console.log("Joining ride with ID:", rideId);
    const userToken = localStorage.getItem('token');
    fetch(process.env.REACT_APP_SERVER + '/api/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + userToken, // Replace with actual token if authentication is required
      },
      body: JSON.stringify({ ride_id: rideId })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(() => {
      console.log('Joining ride ID:', rideId);
      setRefreshKey(prevRefreshKey => prevRefreshKey + 1)
      // const newRides = rides.filter(ride => ride.ride_id !== rideId);
      // console.log('New rides after removal:', newRides);
      // setRides(newRides);
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle any errors (e.g., show a notification to the user)
    });
  };  

    return (
        <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>From Location</Table.HeaderCell>
            <Table.HeaderCell>To Location</Table.HeaderCell>
            <Table.HeaderCell>Ride Date</Table.HeaderCell>
            <Table.HeaderCell>Ride Time</Table.HeaderCell>
            <Table.HeaderCell>Seats Lef</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
        {rides?.map(ride => (
            <RideItem rideId={ride.rideId} fromLocationId={ride.fromLocationId} toLocationId={ride.toLocationId} date={ride.rideDate} time={ride.rideTime} seatsLeft={ride.seatsRemaining} handleJoinClick={handleJoinClick}/>
            ))}

        </Table.Body>            
        </Table>
    )
    
}
export default RideView;
