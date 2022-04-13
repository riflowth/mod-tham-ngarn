import {
  DotsCircleHorizontalIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/solid";
import React, { useState } from "react";
type ErrorlogDetail = {
  name: string;
  id: string;
};
import { Dialog } from "@headlessui/react";
const ErrorLogItem = ({ name, id }: ErrorlogDetail) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="flex flex-1 justify-between items-center p-2 px-5   w-full bg-[#D599C6] rounded-full">
      <div className="w-12 h-12 text-[#be3c93] animate-pulse">
        <ShieldExclamationIcon />
      </div>
      |
      <div className="flex flex-col">
        {/* Title */}
        <span className="font-bold">Title: นายพลทหารได้ไบเบิล</span>
        {/* Staff */}
        <div className="space-x-2">
          <span className="font-semibold">StaffID: {id}</span>
          <span className="font-medium-">StaffName: {name}</span>
        </div>
      </div>
      <div className="flex items-center space-x-3 bg-[#ffcef3] p-2 px-3 rounded-3xl cursor-pointer hover:bg-[#ffa6e9] transition-colors ease-in-out duration-300">
        <span>See more</span>
        <div className="w-8 h-8">
          <DotsCircleHorizontalIcon />
        </div>
      </div>
    </div>
  );
};

export default ErrorLogItem;
