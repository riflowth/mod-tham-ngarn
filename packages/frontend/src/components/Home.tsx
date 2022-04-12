import React from "react";
import Chart from "./AreaChart";
import ErrorLog from "./ErrorLog";
import MachineLog from "./MachineLog";
import TwoBarChart from "./TwoBarChart";

const Home = () => {
  return (
    <div className="relative w-full px-10 py-10 text-white bg-[#22202e]">
      <div className="grid grid-rows-1 gap-10 mx-auto my-auto lg:grid-cols-3">
        {/* Graph stat */}
        <div className="flex flex-col items-center bg-[#353147] rounded-xl py-5 px-3">
          {" "}
          <div className="self-start p-2 ml-12 text-xl font-bold text-[#CBC3D8]">
            What is this Graph?
          </div>
          <div className="h-[250px] w-[300px] md:w-[400px] xl:w-[450px]">
            <Chart />
          </div>
        </div>

        {/* Log notification */}
        <div className="bg-[#353147] rounded-xl ">
          <ErrorLog />
        </div>

        {/* Machine  */}
        <div className="bg-[#353147] rounded-xl md:row-span-2">
          <MachineLog />
        </div>

        {/* Twobar */}
        <div className="bg-[#353147] rounded-xl md:col-span-2">
          <div className="self-start p-3 pt-6 ml-12 text-xl font-bold text-[#CBC3D8]">
            What is this Bars?
          </div>
          <div className="flex flex-col justify-around md:flex-row">
            <div className="h-[300px] w-[300px] md:w-[400px] xl:w-[900px]">
              <TwoBarChart />
            </div>
            <div className="text-xl font-bold">
              <span className="flex items-center justify-center">
                Hello this is Xiaoxuxx
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
