const LiveCards = ({ data }) => {

  //  Conditions
  const isHighCurrent = data.current > 8; // threshold
  const isTrip = data.trip > 0;

  return (
    <div className="grid grid-cols-5 gap-4">

      {/* 🔵 VOLTAGE */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-md hover:scale-105 transition">
        <p className="text-gray-400 text-sm">Voltage</p>
        <h2 className="text-2xl font-bold text-blue-400">
          {data.voltage.toFixed(2)}
        </h2>
      </div>


      {/*  CURRENT */}
      <div
        className={`p-4 rounded-xl shadow-md transition transform hover:scale-105 ${
          isHighCurrent
            ? "bg-red-500/20 shadow-red-500/30"
            : "bg-gray-800"
        }`}
      >
        <p className="text-gray-400 text-sm">Current</p>

        <h2
          className={`text-2xl font-bold ${
            isHighCurrent ? "text-red-400" : "text-yellow-400"
          }`}
        >
          {data.current.toFixed(2)}
        </h2>
      </div>


      {/*  PF */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-md hover:scale-105 transition">
        <p className="text-gray-400 text-sm">Power Factor</p>
        <h2 className="text-2xl font-bold text-purple-400">
          {data.pf.toFixed(2)}
        </h2>
      </div>


      {/*  TEMP */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-md hover:scale-105 transition">
        <p className="text-gray-400 text-sm">Temperature</p>
        <h2 className="text-2xl font-bold text-orange-400">
          {data.temp.toFixed(2)}
        </h2>
      </div>


      {/*  TRIP STATUS */}
      <div
        className={`p-4 rounded-xl shadow-md transition transform hover:scale-105 ${
          isTrip
            ? "bg-blue-500/20 shadow-blue-500/40 animate-pulse"
            : "bg-gray-800"
        }`}
      >
        <p className="text-gray-400 text-sm">Trip Status</p>

        <h2
          className={`text-2xl font-bold ${
            isTrip ? "text-blue-400" : "text-gray-300"
          }`}
        >
          {isTrip ? "TRIPPED" : "NORMAL"}
        </h2>
      </div>

    </div>
  );
};

export default LiveCards;