//  Link import (page change without reload)
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-1/4 bg-gray-800 p-4 space-y-4">

      {/*  Title */}
      <h2 className="text-xl font-bold mb-6">MCB Dashboard</h2>

      {/*  Dashboard link */}
      <Link 
        to="/" // path define
        className="block p-2 hover:bg-gray-700 rounded"
      >
        Dashboard
      </Link>

      {/*  Controls link */}
      <Link 
        to="/controls"
        className="block p-2 hover:bg-gray-700 rounded"
      >
        Controls
      </Link>

      {/*  Reports link */}
      <Link 
        to="/reports"
        className="block p-2 hover:bg-gray-700 rounded"
      >
        Reports
      </Link>

    </div>
  );
};

export default Sidebar;