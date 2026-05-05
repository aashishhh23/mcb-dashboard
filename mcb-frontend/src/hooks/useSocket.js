import { useEffect } from "react";
import { io } from "socket.io-client";

const useSocket = (setData, setHistory, setAlerts, thresholds) => {

  useEffect(() => {

    // ✅ USE ENV VARIABLE (NOT HARDCODE)
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    // ❗ WHY:
    // Hardcoding = bad practice
    // Env = scalable (dev / prod / staging)

    const socket = io(BACKEND_URL, {
      transports: ["websocket"], // 🔥 Render ke liye required
      reconnection: true,
    });

    // ✅ CONNECTION SUCCESS
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    // ❌ ERROR HANDLING (IMPORTANT DEBUG)
    socket.on("connect_error", (err) => {
      console.log("❌ Socket error:", err.message);
    });

    // -----------------------------
    //  LISTEN LIVE DATA
    // -----------------------------
    socket.on("live-data", (d) => {

      console.log("📡 LIVE DATA:", d); // DEBUG

      let last;

      setHistory((prev) => {
        last = prev[prev.length - 1];

        const isSpike =
          last && Math.abs(d.current - last.current) > 3;

        const isTrip = d.tripTime > 0;

        const newPoint = {
          time: Date.now(),
          voltage: d.voltage,
          current: d.current,
          spike: isSpike,
          trip: isTrip,
        };

        const updated = [...prev, newPoint];

        // ❗ WHY LIMIT?
        // memory leak avoid + chart performance maintain
        if (updated.length > 20) updated.shift();

        return updated;
      });

      // -----------------------------
      // ALERT SYSTEM
      // -----------------------------

      if (last && Math.abs(d.current - last.current) > 3) {
        setAlerts((prev) => [
          {
            type: "spike",
            message: "⚡ Spike detected",
            time: new Date().toLocaleTimeString(),
          },
          ...prev.slice(0, 4), // ❗ limit alerts to 5
        ]);
      }

      if (d.tripTime > 0) {
        setAlerts((prev) => [
          {
            type: "trip",
            message: "MCB Trip detected",
            time: new Date().toLocaleTimeString(),
          },
          ...prev.slice(0, 4),
        ]);
      }

      if (d.current > thresholds.current) {
        setAlerts((prev) => [
          {
            type: "danger",
            message: "Current exceeded threshold",
            time: new Date().toLocaleTimeString(),
          },
          ...prev.slice(0, 4),
        ]);
      }

      if (d.temp > thresholds.temp) {
        setAlerts((prev) => [
          {
            type: "danger",
            message: "Temperature too high",
            time: new Date().toLocaleTimeString(),
          },
          ...prev.slice(0, 4),
        ]);
      }

      // -----------------------------
      // UPDATE LIVE CARDS
      // -----------------------------
      setData({
        voltage: d.voltage,
        current: d.current,
        pf: d.pf,
        temp: d.temp,
        trip: d.tripTime,
      });

    });

    // -----------------------------
    // CLEANUP (VERY IMPORTANT)
    // -----------------------------
    return () => {
      socket.disconnect();

      // ❗ WHY:
      // multiple socket connections avoid
      // memory leak prevent
    };

  }, [setData, setHistory, setAlerts, thresholds]);

};

export default useSocket;