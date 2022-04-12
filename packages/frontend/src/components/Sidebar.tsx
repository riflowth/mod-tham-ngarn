/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import {
  BellIcon,
  CogIcon,
  CurrencyDollarIcon,
  DatabaseIcon,
  LogoutIcon,
  TruckIcon,
  UserGroupIcon,
  ViewBoardsIcon,
} from "@heroicons/react/solid";
import SidebarItem from "./SidebarItem";
import Image from "next/image";

const Sidebar = () => {
  const [isShowed, setIsShowed] = useState(true);
  const myLoader = () => {
    return `https://images.unsplash.com/photo-1644982647869-e1337f992828?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80`;
  };

  return (
    <div className="sm:flex-[3] md:flex-[3] lg:flex-[2] 2xl:flex-[1] flex-[3] bg-[#75659E] relative mx-auto z-50">
      {/*Start LOGO */}
      <div className="absolute z-20 w-full h-full bg-gradient-to-r from-transparent to-[#353147]"></div>
      <div
        className="flex items-center justify-center py-5 px-2 sm:py-10 bg-gradient-to-t from-[#353147] via-[#7743EF] to-[#E78DD2] z-30"
        onClick={() => setIsShowed(!isShowed)}
      >
        <span className="z-20 hidden text-lg font-bold text-white cursor-pointer sm:inline-block sm:text-2xl sm:font-extrabold">
          Mod Tham Ngan
        </span>
        <span className="z-30 inline-block text-2xl font-bold text-white sm:hidden">
          MTN
        </span>
      </div>
      {/*End LOGO */}

      {/* Start DropMenu */}
      <div
        className={`absolute bg-[#353147] sm:flex-[2] lg:w-[275px] flex-[3] mx-auto px-4 -z-10 py-5 transition-transform duration-500 ease-in-out  space-y-8 rounded-b-lg ${
          isShowed ? "translate-y-0" : "translate-y-[-700px] "
        } `}
      >
        {/*Start Profile */}
        <div className="flex items-center pb-4 space-x-3 border-b-2 md:space-x-5 ">
          <div className="relative border-4 border-white rounded-full w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20">
            <Image
              loader={myLoader}
              src="https://images.unsplash.com/photo-1644982647869-e1337f992828?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80"
              layout="fill"
              objectFit="cover"
              className="border border-white rounded-full "
            />
          </div>
          <span className="hidden font-bold text-white text-md md:text-lg lg:text-xl md:inline-block">
            Nathree lnwza
          </span>
        </div>
        {/* End Profile */}
        {/* Menu */}
        <div>
          <div className="flex flex-col justify-center space-y-6">
            <SidebarItem text="Notification" icon={BellIcon} />
            <SidebarItem text="Dashbord" icon={ViewBoardsIcon} />
            <SidebarItem text="Users" icon={UserGroupIcon} />
            <SidebarItem text="Machines" icon={CogIcon} />
            <SidebarItem text="Edits" icon={DatabaseIcon} />
            <SidebarItem text="Orders" icon={CurrencyDollarIcon} />
            <SidebarItem text="Deliverly" icon={TruckIcon} />
            <SidebarItem text="Logout" icon={LogoutIcon} />
          </div>
        </div>
      </div>
      {/* End DropMenu */}
    </div>
  );
};

export default Sidebar;
