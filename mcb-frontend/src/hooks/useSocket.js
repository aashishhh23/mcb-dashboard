import { useEffect } from "react";
import { io } from "socket.io-client";

const useSocket = (setData, setHistory, setAlerts, thresholds) => {

  useEffect(() => {

    //  connect to backend
    const socket = io("http://localhost:5001");


    //  listen for live data
    socket.on("live-data", (d) => {

      // -----------------------------
      //  DETECTION LOGIC (ALL HERE)
      // -----------------------------

      //  get previous value (for spike detection)
      let last;

      setHistory((prev) => {
        last = prev[prev.length - 1]; // last data point

        // -----------------------------
        //  SPIKE DETECTION
        // -----------------------------
        const isSpike =
          last && Math.abs(d.current - last.current) > 3;

        // -----------------------------
        //  TRIP DETECTION
        // -----------------------------
        const isTrip = d.tripTime > 0;

        // -----------------------------
        //  THRESHOLD DETECTION (NEW)
        // -----------------------------
        const isOverCurrent = d.current > thresholds.current;
        const isOverTemp = d.temp > thresholds.temp;


        // -----------------------------
        //  CREATE NEW POINT FOR GRAPH
        // -----------------------------
        const newPoint = {
          time: Date.now(),
          voltage: d.voltage,
          current: d.current,
          spike: isSpike,
          trip: isTrip,
        };

        const updated = [...prev, newPoint];

        //  performance limit
        if (updated.length > 20) updated.shift();

        return updated;
      });


      // -----------------------------
      // ALERT SYSTEM (CLEAN SEPARATE)
      // -----------------------------

      //  Spike Alert
      if (last && Math.abs(d.current - last.current) > 3) {
        setAlerts((prev) => {
          const updated = [
            {
              type: "spike",
              message: "⚡ Spike detected",
              time: new Date().toLocaleTimeString(),
            },
            ...prev,
          ];

          if (updated.length > 5) updated.pop();
          return updated;
        });
      }

      //  Trip Alert
      if (d.tripTime > 0) {
        setAlerts((prev) => {
          const updated = [
            {
              type: "trip",
              message: " MCB Trip detected",
              time: new Date().toLocaleTimeString(),
            },
            ...prev,
          ];

          if (updated.length > 5) updated.pop();
          return updated;
        });
      }

      //  Threshold Alerts (NEW)
      if (d.current > thresholds.current) {
        setAlerts((prev) => {
          const updated = [
            {
              type: "danger",
              message: " Current exceeded threshold",
              time: new Date().toLocaleTimeString(),
            },
            ...prev,
          ];

          if (updated.length > 5) updated.pop();
          return updated;
        });
      }

      if (d.temp > thresholds.temp) {
        setAlerts((prev) => {
          const updated = [
            {
              type: "danger",
              message: " Temperature too high",
              time: new Date().toLocaleTimeString(),
            },
            ...prev,
          ];

          if (updated.length > 5) updated.pop();
          return updated;
        });
      }


      // -----------------------------
      //  UPDATE LIVE CARDS
      // -----------------------------
      setData({
        voltage: d.voltage,
        current: d.current,
        pf: d.pf,
        temp: d.temp,
        trip: d.tripTime,
      });

    });


    //  cleanup (important)
    return () => socket.disconnect();

  }, [setData, setHistory, setAlerts, thresholds]); // include thresholds

};

export default useSocket;