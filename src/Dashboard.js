import React,{useState, useEffect} from 'react'
import MyRides from "./components/MyRides"
import RideSearch from "./components/RideSearch"

function Dashboard() {
   return <div>
    <MyRides/>
    <br/>
    <br/>
    <RideSearch/>
  </div>;
}

export default Dashboard