// 🔥 React hook import
import { useState } from "react";

// 🔥 Router components
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 🔥 Pages
import Dashboard from "./pages/Dashboard";
import Controls from "./pages/Controls";
import Reports from "./pages/Reports";

function App() {

  // 🔥 GLOBAL STATE (shared across pages)
  // thresholds used in:
  // - Controls (input)
  // - Dashboard (logic)
  const [thresholds, setThresholds] = useState({
    current: 10,
    temp: 50,
  });


  return (

    // 🌐 enables routing
    <BrowserRouter>

      <Routes>

        {/* 🟢 Dashboard */}
        <Route
          path="/"
          element={
            <Dashboard thresholds={thresholds} />
          }
        />

        {/* 🟡 Controls */}
        <Route
          path="/controls"
          element={
            <Controls
              thresholds={thresholds}       // send current values
              setThresholds={setThresholds} // allow update
            />
          }
        />

        {/* 🔵 Reports */}
        <Route
          path="/reports"
          element={<Reports />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;









// //  Router components import kar rahe
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// //  Pages import
// import Dashboard from "./pages/Dashboard";
// import Controls from "./pages/Controls";
// import Reports from "./pages/Reports";

// //THRESHOLD STATE9=(USER DEFINED LIMITS)
// const[thresholds, setThresholds] = useState ({
//     current: 10,
//     temp: 50,
// });

// function App() {
//   return (

//     //  BrowserRouter:
//     // Pure app ko routing enable karta hai
//     // Without this → routing kaam nahi karegi
//     <BrowserRouter>

//       {/* 📦 Routes:
//           Ye container hai jisme saare routes define karte hain */}
//       <Routes>

//         {/* 🟢 Route 1:
//             "/" means home page
//             element → kaunsa component show hoga */}
//         <Route path="/" element={<Dashboard />} />

//         {/* 🟡 Route 2:
//             "/controls" pe Controls component show hoga */}
//         <Route path="/controls" element={<Controls 
//         threshold = {thresholds}
//         setThresholds = {setThresholds}
//         />} />

//         {/* 🔵 Route 3:
//             "/reports" pe Reports component */}
//         <Route path="/reports" element={<Reports />} />

//       </Routes>

//     </BrowserRouter>
//   );
// }

// export default App;