import React from "react";
import { NavLink } from "react-router-dom";

const LeftSide = (props) => {
  return (
    <div className="w-72 fixed z-0 border-gray-300 border-r h-screen text-right pl-32 pt-20" style={{ backgroundColor: "rgb(40, 40, 40)" }}>
      <div className="my-2">
        <NavLink exact to="/" className="text-gray-200 flex pl-2 py-2 items-center text-sm"
        activeClassName="border-red-400 border-r-4 text-gray-400 bg-gray-700 font-bold">Home</NavLink>
        <h1 className="text-xs text-gray-100 pr-28 py-4 pb-0 font-semibold items-center">PUBLIC</h1>
      </div>

      <div className="w-40 border-gray-300 text-right">
        <div>
          <NavLink exact to="/questions" className="text-sm text-gray-200 pl-2 pr-28 py-2 pt-2 items-center flex"
          activeClassName="border-red-400 text-gray-400 border-r-4 bg-gray-700 font-bold">Questions</NavLink>
        </div>
        <NavLink exact to="/users" className="text-sm text-gray-200 pl-2 pr-28 py-2 pt-2 items-center flex"
        activeClassName="border-red-400 text-gray-400 border-r-4 bg-gray-700 font-bold">Users</NavLink>
      </div>
    </div>
  );
};

export default LeftSide;