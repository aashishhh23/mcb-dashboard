import { useState } from "react";
import { io } from "socket.io-client";

//  connect backend
const socket = io(import.meta.env.VITE_BACKEND_URL);

const Controls = ({ thresholds, setThresholds }) => {

  //  relay states
  const [relays, setRelays] = useState([false, false, false, false]);

  //  current input
  const [currentInput, setCurrentInput] = useState("");


  // -----------------------------
  //  TOGGLE RELAY
  // -----------------------------
  const toggleRelay = (index) => {

    const updated = [...relays]; // copy state

    updated[index] = !updated[index]; // toggle

    setRelays(updated); // update UI

    // send to backend
    socket.emit("relay-toggle", {
      relay: index + 1,
      action: updated[index] ? "on" : "off",
    });
  };


  // -----------------------------
  //  SEND CURRENT
  // -----------------------------
  const sendCurrent = () => {

    socket.emit("set-current", {
      value: Number(currentInput),
    });

    setCurrentInput(""); // clear input
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      {/*  TITLE */}
      <h1 className="text-3xl font-bold mb-8">
        Control Panel
      </h1>


      {/* ============================= */}
      {/*  RELAY SECTION */}
      {/* ============================= */}
      <div className="grid grid-cols-2 gap-6 mb-10">

        {relays.map((state, i) => (

          <div
            key={i}
            className="bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-700 flex items-center justify-between"
          >

            {/* Relay name */}
            <span className="text-lg">
              Relay {i + 1}
            </span>

            {/* Toggle switch */}
            <div
              onClick={() => toggleRelay(i)}
              className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition ${
                state ? "bg-green-500" : "bg-gray-600"
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${
                  state ? "translate-x-7" : ""
                }`}
              />
            </div>

          </div>

        ))}

      </div>


      {/* ============================= */}
      {/*  CURRENT CONTROL */}
      {/* ============================= */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 mb-6">

        <h2 className="text-xl mb-4">
          Set Test Current
        </h2>

        <div className="flex gap-4">

          <input
            type="number"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Enter current (3000, 5000...)"
            className="p-3 rounded-lg text-black w-1/2"
          />

          <button
            onClick={sendCurrent}
            className="bg-blue-500 px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Apply
          </button>

        </div>

      </div>


      {/* ============================= */}
      {/*  THRESHOLD CONTROL */}
      {/* ============================= */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">

        <h2 className="text-xl mb-4">
          Set Thresholds
        </h2>

        <div className="flex gap-4">

          {/* Max Current */}
          <input
            type="number"
            value={thresholds.current}
            onChange={(e) =>
              setThresholds((prev) => ({
                ...prev,
                current: Number(e.target.value),
              }))
            }
            placeholder="Max Current"
            className="p-3 rounded-lg text-black w-1/2"
          />

          {/* Max Temp */}
          <input
            type="number"
            value={thresholds.temp}
            onChange={(e) =>
              setThresholds((prev) => ({
                ...prev,
                temp: Number(e.target.value),
              }))
            }
            placeholder="Max Temp"
            className="p-3 rounded-lg text-black w-1/2"
          />

        </div>

      </div>

    </div>
  );
};

export default Controls;