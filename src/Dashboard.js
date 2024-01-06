import React,{useState, useEffect} from 'react'
import MyRides from "./components/MyRides"
import RideSearch from "./components/RideSearch"
import Navbar from "./pages/NavbarTwo"
import { InView } from 'react-intersection-observer'

function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  return <div>
    <InView >
      <Navbar/>
    <MyRides refreshKey = {refreshKey} setRefreshKey={setRefreshKey}/>
    <br/>
    <br/>
   <RideSearch refreshKey = {refreshKey} setRefreshKey={setRefreshKey}/>
  </InView>
  <br></br>
  <br></br>
  <br></br>

  <br></br>
  </div>;

}

export default Dashboard