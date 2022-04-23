/* eslint-disable @next/next/no-img-element */
import { BellIcon, PencilAltIcon, SearchIcon } from "@heroicons/react/solid";
import React from "react";

const Widget = () => {
  return (
    <div className="flex-[6] bg-[#353147] flex items-center sm:justify-around md:px-10">
      {/*Left item*/}
      <div className="px-1 flex-[2]">
        <SearchIcon className="absolute w-5 h-5 mt-2 ml-2 lg:mt-3 lg:ml-3 text-slate-500" />
        <input
          type="text"
          className="w-32 h-8 sm:h-9  lg:h-12 px-3 sm:px-8 md:px-9 lg:px-10 rounded-xl sm:w-64 lg:w-96 bg-[#22202e] text-white font-bold outline-none sm:placeholder-slate-500 placeholder-transparent "
          placeholder="Search"
        />
      </div>

      {/*  Right item*/}
      <div className="flex justify-end flex-[1] px-6 space-x-10 ">
        <PencilAltIcon className="text-white cursor-pointer h-7 w-7 md:w-10 md:h-10" />
        <div className="relative">
          <div className="absolute flex items-center justify-center w-5 h-5 ml-6 font-bold text-white bg-red-500 rounded-full">
            2
          </div>
          <BellIcon className="text-white cursor-pointer h-7 w-7 md:w-10 md:h-10" />
        </div>
      </div>
    </div>
  );
};

export default Widget;
