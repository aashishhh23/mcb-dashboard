import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ChartsSection = ({ history }) => {

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-700 hover:shadow-blue-500/20 transition-all duration-300">

      {/*  Title */}
      <h2 className="text-xl font-semibold mb-4 text-gray-200">
        Live Electrical Data
      </h2>

      {/* GRAPH CONTAINER */}
      <ResponsiveContainer width="100%" height={320}>

        <LineChart data={history}>

          {/* X-axis (hidden time) */}
          <XAxis dataKey="time" hide />

          {/* Y-axis */}
          <YAxis stroke="#9ca3af" />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "none",
              borderRadius: "10px",
              color: "white",
            }}
          />

          {/*  VOLTAGE LINE */}
          <Line
            type="monotone"
            dataKey="voltage"
            stroke="#38bdf8"
            strokeWidth={2}
            dot={false} // no dots for voltage
          />

          {/*  CURRENT LINE + SPIKE/TRIP VISUAL */}
          <Line
            type="monotone"
            dataKey="current"
            stroke="#facc15"
            strokeWidth={2}
            dot={(props) => {
              const { cx, cy, payload } = props;

              //  Trip → blue dot
              if (payload.trip) {
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill="#3b82f6"
                    className="animate-pulse "
                  />
                );
              }

              //  Spike → red dot
              if (payload.spike) {
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill="#ef4444"
                  />
                );
              }

              // normal point
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={2}
                  fill="#facc15"
                />
              );
            }}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartsSection;