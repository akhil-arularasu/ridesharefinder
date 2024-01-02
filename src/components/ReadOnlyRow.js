import React from "react";
import { Button, Table } from "semantic-ui-react";

const ReadOnlyRow = ({ ride, handleLeaveClick }) => {
  console.log('ReadOnlyRow ride:', ride);

  return (
    <Table.Row>        
    <Table.Cell>{ride.fromLocationName}</Table.Cell>
    <Table.Cell>{ride.toLocationName}</Table.Cell>
    <Table.Cell>{ride.rideDate}</Table.Cell>
    <Table.Cell>{ride.rideTime}</Table.Cell>
    <Table.Cell>{ride.seatsRemaining}</Table.Cell>
    <Table.Cell>
        <button type="button" 
          onClick={() => handleLeaveClick(ride.ride_id)} // Ensure this matches the property name
          aria-label={`Leaving ride from ${ride.fromLocationName} to ${ride.toLocationName}`}
          >
          Leave
        </button>
        </Table.Cell>
    </Table.Row>

  );
};

export default ReadOnlyRow;