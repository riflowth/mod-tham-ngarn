/* eslint-disable @next/next/no-img-element */
import { BellIcon, PencilAltIcon } from "@heroicons/react/solid";
import React from "react";

const Widget = () => {
  return (
    <div className="flex-[6] bg-[#353147] flex items-center sm:justify-between">
      {/*Left item*/}

      <div className="px-1">
        <input
          type="text"
          className="w-32 h-8 px-2 rounded-xl sm:"
          placeholder="Search"
        />
      </div>

      {/*  Right item*/}
      <div className="flex justify-between px-6 space-x-2 md:w-2xl">
        <PencilAltIcon className="w-10 h-10 text-white" />
        <BellIcon className="w-10 h-10 text-white" />
      </div>
    </div>
  );
};

export default Widget;
