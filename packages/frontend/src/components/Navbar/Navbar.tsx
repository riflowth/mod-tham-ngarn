import React from "react";
import Sidebar from "./Sidebar";
import Widget from "./Widget";

const Navbar = () => {
  return (
    <div className="flex font-[Nunito] bg-[#353147]">
      <Sidebar />
      <Widget />
    </div>
  );
};

export default Navbar;
