import React, {Component, useState, useEffect} from 'react'
import MyRides from "./components/MyRides"
import RideSearch from "./components/RideSearch"
import { InView } from 'react-intersection-observer'
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { SegmentGroup, Segment, Container,Grid, GridColumn } from 'semantic-ui-react';

function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [myRides, setMyRides] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

return <>
    <SegmentGroup>
      <Segment>
      <MyRides refreshKey = {refreshKey} setRefreshKey={setRefreshKey} rides={myRides} />
      </Segment>
      <Segment>
      <RideSearch refreshKey = {refreshKey} setRefreshKey={setRefreshKey} myRides={myRides}/>
      </Segment>
    </SegmentGroup>
    </>;
}

export default Dashboard