import React from "react";
//import Card from './UI/Card';
import { List, Header, Table } from "semantic-ui-react";

const RideItem = ({ rideId, fromLocationId, toLocationId, date, time, seatsLeft, handleJoinClick }) => {
    console.log("RideItem props:", { rideId, fromLocationId, toLocationId, date, time, seatsLeft });  // Check the props

    return (
    <Table.Row>        
      <Table.Cell>{fromLocationId}</Table.Cell>
      <Table.Cell>{toLocationId}</Table.Cell>
      <Table.Cell>{date}</Table.Cell>
      <Table.Cell>{time}</Table.Cell>
      <Table.Cell>{seatsLeft}</Table.Cell>
      <Table.Cell>
        <button type="button" onClick={handleJoinClick(rideId)}>
          Join
        </button>
      </Table.Cell>
    </Table.Row>
  );
}


export default RideItem;