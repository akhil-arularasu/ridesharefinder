import React,{useState, useEffect, Fragment } from 'react'
import { List, Header, Table } from "semantic-ui-react";
//import Card from './UI/Card';
import RideItem from './RideItem';


function RideView ({rides}) {
  console.log("Rides array:", rides);  // Check the structure and content of the rides array

  function handleJoinClick (rideId) {
    // Add your logic for handling a join click here
    console.log("Joining ride with ID:", rideId);
    
    fetch('/api/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
     //   'Authorization': 'Bearer ' + userToken, // Replace with actual token if authentication is required
      },
      body: JSON.stringify({ ride_id: rideId })
    })
  }

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
