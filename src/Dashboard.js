import React,{useState, useEffect} from 'react'
import MyRides from "./components/MyRides"
import RideSearch from "./components/RideSearch"

function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0)

  return <div>
    <MyRides refreshKey = {refreshKey} setRefreshKey={setRefreshKey}/>
    <br/>
    <br/>
/   <RideSearch refreshKey = {refreshKey} setRefreshKey={setRefreshKey}/>
  </div>;
}

export default Dashboard