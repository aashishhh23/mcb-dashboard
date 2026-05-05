import { useState,useEffect } from "react";

import Sidebar from "../components/Sidebar";
import LiveCards from "../components/LiveCards";
import ResultsTable from "../components/ResultsTable";
import ChartsSection from "../components/ChartsSection";
import useSocket from '../hooks/useSocket';
import AlertsPanel from "../components/AlertPanel";



const Dashboard = ({thresholds}) => {

    //GRAPH needs history (Array)
    const [history,setHistory] = useState([]);

    const[alerts, setAlerts] = useState([]);

    const [data, setData] = useState({
        
  voltage: 0,
  current: 0,
  pf: 0,
  temp: 0,
  trip: 0,

  
});



//PASS setAlerts TO HOOK
useSocket(setData, setHistory, setAlerts, thresholds);

// FAKE DATA

// useEffect(() => {
//   const interval = setInterval(() => {
//     setData({
//       voltage: Math.floor(220 + Math.random() * 10),
//       current: Math.floor(Math.random() * 10),
//       pf: (0.7 + Math.random() * 0.2).toFixed(2),
//       temp: Math.floor(30 + Math.random() * 5),
//       trip: Math.floor(Math.random() * 2),
//     });
//   }, 1000);

//   return () => clearInterval(interval);
// }, []);


  return (
    <div className="min-h-screen bg-gray-900 text-white flex">

        <Sidebar/>
        
        

      {/* Right Section */}
      <div className="w-3/4 p-4 space-y-4">

      {/* Pass Data To Child */}
      <LiveCards data = {data}/>

      <ResultsTable/>

{/* PASS HISTORY TO CHART */}
      <ChartsSection history={history}/>
      <AlertsPanel alerts={alerts} />

      </div>
    </div>

    
  );
};

export default Dashboard;