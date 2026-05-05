import { useState } from "react";

import Sidebar from "../components/Sidebar";
import LiveCards from "../components/LiveCards";
import ResultsTable from "../components/ResultsTable";
import ChartsSection from "../components/ChartsSection";
import useSocket from "../hooks/useSocket";
import AlertsPanel from "../components/AlertPanel";

const Dashboard = ({ thresholds }) => {

  // GRAPH DATA
  const [history, setHistory] = useState([]);

  // ALERTS
  const [alerts, setAlerts] = useState([]);

  // LIVE DATA
  const [data, setData] = useState({
    voltage: 0,
    current: 0,
    pf: 0,
    temp: 0,
    trip: 0,
  });

  // 🔥 SOCKET HOOK
  useSocket(setData, setHistory, setAlerts, thresholds);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">

      <Sidebar />

      <div className="w-3/4 p-4 space-y-4">

        <LiveCards data={data} />

        <ResultsTable />

        <ChartsSection history={history} />

        <AlertsPanel alerts={alerts} />

      </div>
    </div>
  );
};

export default Dashboard;