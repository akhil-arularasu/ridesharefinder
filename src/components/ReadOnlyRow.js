import React from "react";
import { List, Header, Table } from "semantic-ui-react";

const ReadOnlyRow = ({ ride, handleLeaveClick }) => {
  console.log('ReadOnlyRow ride:', ride);

  return (
    <Table.Row>        
    <Table.Cell>{ride.fromLocationId}</Table.Cell>
    <Table.Cell>{ride.toLocationId}</Table.Cell>
    <Table.Cell>{ride.rideDate}</Table.Cell>
    <Table.Cell>{ride.rideTime}</Table.Cell>
    <Table.Cell>{ride.seatsRemaining}</Table.Cell>
    <Table.Cell>
        <button type="button" 
          onClick={() => handleLeaveClick(ride.ride_id)} // Passing ride.id to the function
          >
          Leave
        </button>
        </Table.Cell>
    </Table.Row>

  );
};

export default ReadOnlyRow;