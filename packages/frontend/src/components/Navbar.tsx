import React from "react";
import Sidebar from "./Sidebar";
import Widget from "./Widget";

const Home = () => {
  return (
    <div className="flex font-[Nunito] bg-[#353147]">
      <Sidebar />
      <Widget />
    </div>
  );
};

export default Home;
