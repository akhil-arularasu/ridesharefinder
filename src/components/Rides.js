import React,{useState, useEffect, Fragment } from 'react'
import { List, Header, Table } from "semantic-ui-react";
//import Card from './UI/Card';
import ReadOnlyRow from "./ReadOnlyRow";


function Rides ({rides, setRides, setRefreshKey}) {
  console.log('Rides props:', rides); // Check the received rides array

  //removes ride
  const handleLeaveClick = (rideId) => {
    const token = localStorage.getItem('token'); // Retrieve the token
    console.log('Sending data:', { rideId }); // Assuming rideId is the variable being sent
    fetch(process.env.REACT_APP_SERVER + '/api/leave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include the token if needed
      },
      body: JSON.stringify({ rideId }) // Send the rideId in the request body
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(() => {
      // Remove the ride from the frontend table
      console.log('Leaving ride ID:', rideId);
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
    <form>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>From Location</Table.HeaderCell>
            <Table.HeaderCell>To Location</Table.HeaderCell>
            <Table.HeaderCell>Ride Date</Table.HeaderCell>
            <Table.HeaderCell>Ride Time</Table.HeaderCell>
            <Table.HeaderCell>Seats Left</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rides.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan="5">You have not joined any rides.</Table.Cell>
            </Table.Row>
          ) : (
            Array.isArray(rides) && rides.map(ride => (
              <ReadOnlyRow
                key={ride.id}
                ride={ride}
                handleLeaveClick={handleLeaveClick}
              />
            ))
          )}
        </Table.Body>
      </Table>
    </form>
  );
}

export default Rides;