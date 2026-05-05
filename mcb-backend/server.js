// --------------------------------------
//  IMPORTS
// --------------------------------------

const connectDB = require("./config/db");
const Data = require("./models/data");

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

//  DON'T import serialport globally
// Reason:
// - Render (cloud) doesn't support hardware
// - It crashes deployment
// const { SerialPort } = require("serialport");
// const { ReadlineParser } = require("@serialport/parser-readline");

const dataRoutes = require("./routes/dataRoutes");


// --------------------------------------
//  DB CONNECT
// --------------------------------------
connectDB();


// --------------------------------------
//  APP SETUP
// --------------------------------------

const app = express();

//  Production tip:
// For now "*" is fine (easy deployment)
// Later restrict to your frontend URL
app.use(cors({ origin: "*" }));

const server = http.createServer(app);

// API route
app.use("/api", dataRoutes);

// Socket server
const io = new Server(server, {
  cors: { origin: "*" },
});


// --------------------------------------
//  FEATURE FLAG
// --------------------------------------

// true  → fake data (cloud safe)
// false → real Arduino (local only)
const USE_FAKE = true;


// --------------------------------------
//  SERIAL (REAL MODE - ONLY LOCAL)
// --------------------------------------

let port;
let parser;

if (!USE_FAKE) {
  //  Import ONLY when needed
  // Reason: Avoid crash on Render
  const { SerialPort } = require("serialport");
  const { ReadlineParser } = require("@serialport/parser-readline");

  port = new SerialPort({
    path: "COM4", // change based on system
    baudRate: 115200,
  });

  parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

  parser.on("data", async (line) => {
    try {
      const data = JSON.parse(line);

      console.log("Arduino:", data);

      io.emit("live-data", data);

      // Save to DB
      await Data.create(data);

    } catch (err) {
      console.log("Invalid JSON / DB Error:", err.message);
    }
  });
}


// --------------------------------------
//  FAKE DATA (DEPLOYMENT MODE)
// --------------------------------------

if (USE_FAKE) {

  console.log(" RUNNING IN FAKE MODE");

  setInterval(async () => {

    const data = {
      voltage: 220 + Math.random() * 10,
      current: Math.random() * 10,
      pf: 0.7 + Math.random() * 0.2,
      temp: 30 + Math.random() * 5,
      tripTime: Math.random() > 0.9 ? 1 : 0,
    };

    io.emit("live-data", data);

    // Save to DB
    try {
      await Data.create(data);
    } catch (err) {
      console.log("DB Save Error:", err.message);
    }

  }, 1000);
}


// --------------------------------------
//  SOCKET CONNECTION
// --------------------------------------

io.on("connection", (socket) => {

  console.log("Client connected:", socket.id);


  // -----------------------------
  // RELAY CONTROL
  // -----------------------------
  socket.on("relay-toggle", (data) => {

    console.log("Relay Command:", data);

    const command = JSON.stringify({
      relay: data.relay,
      action: data.action,
    });

    if (!USE_FAKE && port) {
      // Real Arduino
      port.write(command + "\n");
    } else {
      // Fake mode (UI simulation)
      setTimeout(() => {
        socket.emit("relay-status", {
          relay: data.relay,
          status: data.action,
        });
      }, 300);
    }
  });


  // -----------------------------
  // CURRENT CONTROL
  // -----------------------------
  socket.on("set-current", (data) => {

    console.log("Current Set:", data);

    if (!USE_FAKE && port) {
      const command = JSON.stringify({
        cmd: "set-current",
        value: data.value,
      });

      port.write(command + "\n");
    } else {
      console.log("FAKE CURRENT:", data.value);
    }
  });


  // -----------------------------
  // DEVICE STATUS (FAKE)
  // -----------------------------
  if (USE_FAKE) {
    setInterval(() => {
      socket.emit("device-status", "connected");
    }, 2000);
  }


  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

});


// --------------------------------------
//  SERVER START (DEPLOYMENT SAFE)
// --------------------------------------

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});






//-----------------------------------
//JAB ARDUINO CONNECT KROGE TB YEH CODE RUN KRNA FOR REAL DATA
//-----------------------------------

// // --------------------------------------
// //  IMPORTS
// // --------------------------------------

// // Express server
// const express = require("express");

// // HTTP server (needed for socket.io)
// const http = require("http");

// // Socket.io for real-time communication
// const { Server } = require("socket.io");

// //  SerialPort (Arduino communication)
// const { SerialPort } = require("serialport");

// //  Parser (line-by-line reading from Arduino)
// const { ReadlineParser } = require("@serialport/parser-readline");


// // --------------------------------------
// //  APP + SERVER SETUP
// // --------------------------------------

// const app = express();
// const server = http.createServer(app);

// // Socket server
// const io = new Server(server, {
//   cors: {
//     origin: "*", // allow all (dev only)
//   },
// });


// // --------------------------------------
// //  ARDUINO CONNECTION
// // --------------------------------------

// //  CHANGE THIS PORT (Device Manager check)
// const port = new SerialPort({
//   path: "COM3",
//   baudRate: 115200,
// });

// // Parser -> Arduino se line by line data milega
// const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));


// // --------------------------------------
// //  FEATURE FLAG
// // --------------------------------------

// const USE_FAKE = true; // false -> real Arduino mode


// // --------------------------------------
// //  FAKE DATA MODE
// // --------------------------------------

// if (USE_FAKE) {

//   console.log("🚧 RUNNING IN FAKE DATA MODE");

//   setInterval(() => {

//     const data = {
//       voltage: 220 + Math.random() * 10,
//       current: Math.random() * 10,
//       pf: 0.7 + Math.random() * 0.2,
//       temp: 30 + Math.random() * 5,
//       tripTime: Math.random() * 2,
//     };

//     // frontend ko bhejna
//     io.emit("live-data", data);

//   }, 1000);
// }


// // --------------------------------------
// //  REAL ARDUINO DATA MODE
// // --------------------------------------

// if (!USE_FAKE) {

//   console.log("⚡ RUNNING IN REAL ARDUINO MODE");

//   // Arduino -> backend -> frontend
//   parser.on("data", (line) => {

//     try {
//       const data = JSON.parse(line); // Arduino JSON bhejega

//       console.log("Arduino Data:", data);

//       io.emit("live-data", data); // frontend update

//     } catch (err) {
//       console.log("Invalid JSON from Arduino");
//     }
//   });
// }


// // --------------------------------------
// //  SOCKET CONNECTION
// // --------------------------------------

// io.on("connection", (socket) => {

//   console.log(" Client connected:", socket.id);


//   // ----------------------------------
//   //  MULTI-RELAY CONTROL
//   // ----------------------------------
//   socket.on("relay-toggle", (data) => {

//     console.log("Relay Command:", data);

//     //  JSON command banate hain
//     const command = JSON.stringify({
//       relay: data.relay,
//       action: data.action,
//     });

//     //  Arduino ko bhejna
//     port.write(command + "\n", (err) => {

//       if (err) {
//         console.log("❌ Serial Write Error:", err.message);
//       } else {
//         console.log("➡ Sent to Arduino:", command);
//       }

//     });

//   });


//   // ----------------------------------
//   //  CURRENT CONTROL
//   // ----------------------------------
//   socket.on("set-current", (data) => {

//     console.log("Current Set:", data);

//     const command = JSON.stringify({
//       cmd: "set-current",
//       value: data.value,
//     });

//     port.write(command + "\n");

//   });


//   // ----------------------------------
//   //  DISCONNECT
//   // ----------------------------------
//   socket.on("disconnect", () => {
//     console.log("❌ Client disconnected");
//   });

// });


// // --------------------------------------
// //  SERVER START
// // --------------------------------------

// server.listen(5001, () => {
//   console.log(" Server running at http://localhost:5001");
// });