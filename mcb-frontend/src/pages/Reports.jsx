import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Reports = () => {

  // -----------------------------
  // STATES
  // -----------------------------
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(5);
  const [page, setPage] = useState(1);


  // -----------------------------
  // BASE URL (PRODUCTION SAFE)
  // -----------------------------

  //  OLD (LOCAL ONLY - NOT WORK IN PRODUCTION)
  // const BASE_URL = "http://localhost:5001";

  //  NEW (RENDER BACKEND)
  const BASE_URL = "https://mcb-dashboard.onrender.com";


  // -----------------------------
  // FETCH DATA
  // -----------------------------
  useEffect(() => {

    setLoading(true);

    fetch(`${BASE_URL}/api/data/${filter}?page=${page}`)
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.log("Fetch Error:", err);
        setLoading(false);
      });

  }, [filter, page]);


  // -----------------------------
  // GRAPH DATA (SAFE FORMAT)
  // -----------------------------
  const chartData = data.map(item => ({
    voltage: Number(item.voltage || 0),
    current: Number(item.current || 0),
    time: item.createdAt
      ? new Date(item.createdAt).toLocaleTimeString()
      : "",
  }));


  // -----------------------------
  // DOWNLOAD CSV
  // -----------------------------
  const downloadCSV = () => {

    //  BAD PRACTICE:
    // No headers → confusing CSV

    //  GOOD:
    const headers = ["Voltage", "Current", "PF", "Temp", "Trip", "Time"];

    const rows = data.map(item => [
      item.voltage,
      item.current,
      item.pf,
      item.temp,
      item.tripTime,
      new Date(item.createdAt).toLocaleTimeString(),
    ]);

    const csvContent =
      [headers, ...rows]
        .map(e => e.join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "report.csv";
    a.click();
  };


  // -----------------------------
  // LOADING UI
  // -----------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading data...
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      <h1 className="text-3xl font-bold mb-6">
        Reports Dashboard
      </h1>


      {/* FILTER + DOWNLOAD */}
      <div className="flex gap-4 mb-4">

        <button
          onClick={() => {
            setFilter(5);
            setPage(1); // ✅ reset page (important)
          }}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          Last 5 min
        </button>

        <button
          onClick={() => {
            setFilter(60);
            setPage(1); // ✅ reset page
          }}
          className="bg-green-500 px-4 py-2 rounded"
        >
          Last 1 hour
        </button>

        <button
          onClick={downloadCSV}
          className="bg-yellow-500 px-4 py-2 rounded"
        >
          Download CSV
        </button>

      </div>


      {/* GRAPH */}
      <div className="bg-gray-800 p-4 rounded mb-6">

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>

            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="voltage"
              stroke="#3b82f6"
            />

            <Line
              type="monotone"
              dataKey="current"
              stroke="#facc15"
            />

          </LineChart>
        </ResponsiveContainer>

      </div>


      {/* TABLE */}
      <div className="overflow-x-auto">

        <table className="w-full text-sm border border-gray-700">

          <thead className="bg-gray-800">
            <tr>
              <th className="p-3">Voltage</th>
              <th className="p-3">Current</th>
              <th className="p-3">PF</th>
              <th className="p-3">Temp</th>
              <th className="p-3">Trip</th>
              <th className="p-3">Time</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-700 hover:bg-gray-800"
              >
                <td className="p-2">{item.voltage?.toFixed(2)}</td>
                <td className="p-2">{item.current?.toFixed(2)}</td>
                <td className="p-2">{item.pf?.toFixed(2)}</td>
                <td className="p-2">{item.temp?.toFixed(2)}</td>
                <td className="p-2">{item.tripTime}</td>
                <td className="p-2">
                  {new Date(item.createdAt).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>


      {/* PAGINATION */}
      <div className="flex gap-4 mt-4">

        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          className="bg-gray-700 px-4 py-2 rounded"
        >
          Prev
        </button>

        <button
          onClick={() => setPage(p => p + 1)}
          className="bg-gray-700 px-4 py-2 rounded"
        >
          Next
        </button>

      </div>

    </div>
  );
};

export default Reports;