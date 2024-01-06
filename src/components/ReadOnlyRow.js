import React from "react";
import { Table } from "semantic-ui-react";
import Button from '@mui/material/Button';

const convertTo12HourFormat = (time) => {
  let [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

const ReadOnlyRow = ({ ride, handleLeaveClick }) => {
  console.log('ReadOnlyRow ride:', ride);

  return (
    <Table.Row>        
    <Table.Cell>{ride.fromLocationName}</Table.Cell>
    <Table.Cell>{ride.toLocationName}</Table.Cell>
    <Table.Cell>{ride.rideDate}</Table.Cell>
    <Table.Cell>{convertTo12HourFormat(ride.rideTime)}</Table.Cell>
    <Table.Cell>{ride.seatsRemaining}</Table.Cell>
    <Table.Cell>
        <Button type="button" 
          onClick={() => handleLeaveClick(ride.ride_id)} // Ensure this matches the property name
          aria-label={`Leaving ride from ${ride.fromLocationName} to ${ride.toLocationName}`}
          >
          Leave
        </Button>
        </Table.Cell>
    </Table.Row>

  );
};

export default ReadOnlyRow;