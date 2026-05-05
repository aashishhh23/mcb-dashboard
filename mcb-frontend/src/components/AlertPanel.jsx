const AlertsPanel = ({ alerts }) => {
  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-700">

      <h3 className="text-lg font-semibold mb-3">Alerts</h3>

      {alerts.length === 0 && (
        <p className="text-gray-400">No alerts</p>
      )}

      <div className="space-y-2">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`p-2 rounded text-sm ${
              alert.type === "spike"
                ? "bg-red-500/20 text-red-400"
                : "bg-blue-500/20 text-blue-400"
            }`}
          >
            <div>{alert.message}</div>
            <div className="text-xs opacity-70">{alert.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPanel;