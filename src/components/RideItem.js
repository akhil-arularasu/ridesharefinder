import React, { useState } from "react";
//import Card from './UI/Card';
import { List, Header, Table } from "semantic-ui-react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const RideItem = ({ rideId, fromLocationName, toLocationName, fromLocationId, toLocationId, date, time, seatsLeft, handleJoinClick }) => {
    //console.log("RideItem props:", { rideId, fromLocationName, toLocationName, fromLocationId, toLocationId, date, time, seatsLeft });  // Check the props

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hostDetails, setHostDetails] = useState(null);
    const [otherRiders, setOtherRiders] = useState([]);

    const handleOpen = () => {
      setIsModalOpen(true);
      fetchRideDetails();
    };

    const handleClose = () => {
      setIsModalOpen(false);
      setHostDetails(null); // Clear the details when closing the modal
    };

    const fetchRideDetails = () => {
      // Replace with your actual API endpoint
      const userToken = localStorage.getItem('token');
      fetch(process.env.REACT_APP_SERVER + `/api/rideDetails?rideId=${rideId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userToken, // Replace with actual token if authentication is required
        },
      })
        .then(response => {
          return response.json(); })
          .then(data => {
            if (data.rides && data.rides.length > 0) {
              setHostDetails(data.rides[0]); // Assuming the first entry is the host
        
              // Process other riders
              const otherRidersData = data.rides.slice(1); // Get all entries except the first
              setOtherRiders(otherRidersData); // Update state with other riders' details
            }
                })
        .catch(error => console.error('Error fetching ride details:', error));
    };

    const modalStyle = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };

    return (
    <Table.Row>        
      <Table.Cell>{fromLocationName}</Table.Cell>
      <Table.Cell>{toLocationName}</Table.Cell>
      <Table.Cell>{date}</Table.Cell>
      <Table.Cell>{time}</Table.Cell>
      <Table.Cell>{seatsLeft}</Table.Cell>
      <Table.Cell>
        <button type="button"
          onClick={handleOpen}
          >More Info
        </button>
          {/* Modal */}
          <Modal
            open={isModalOpen}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-title" variant="h6" component="h2">
                Further Ride Details
              </Typography>
              <Typography id="modal-description" sx={{ mt: 2 }}>
            {hostDetails ? (
              <>
                <div>Ride Host: {hostDetails.name}</div>
                <div>Host Phone Number: {hostDetails.telNumber}</div>
              </>
            ) : (
              <div>Loading...</div>
            )}
            {/* Horizontal line separator */}
            <hr />
            {otherRiders.map((rider, index) => (
              <div key={index}>
              <div>Rider {index + 1} Name: {rider.name}</div>
              <div>Rider {index + 1} Phone Number: {rider.telNumber}</div>
              </div>
            ))}
          </Typography>
            </Box>
          </Modal>
      </Table.Cell>
      <Table.Cell>
        <button type="button"
        onClick={() => handleJoinClick(rideId)} // Passing ride.id to the function
          >Join
        </button>
      </Table.Cell>
    </Table.Row>
  );
}


export default RideItem;