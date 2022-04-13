import Image from "next/image";
import React, { useEffect, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
const Progressbar = () => {
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(36);

  useEffect(() => {
    const increaseValue1 = () => {
      setValue1(value1 + 1);
    };
    const increaseValue2 = () => {
      setValue2(value2 + 2);
    };
    setTimeout(() => {
      if (value1 >= 100) {
        setValue1(0);
      } else {
        increaseValue1();
      }
      if (value2 >= 100) {
        setValue2(0);
      } else {
        increaseValue2();
      }
    }, 1000);
  }, [value1, value2]);

  const myLoader = () => {
    return `https://images.unsplash.com/photo-1649712344464-12f9563c03ff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=715&q=80`;
  };

  return (
    <div className="flex flex-col pb-4 ">
      <span className="self-start pt-5 pb-2 px-3 mt-1 ml-12 text-xl font-bold text-[#CBC3D8]">
        what is this Progress?
      </span>
      <div className="flex flex-col space-y-4 px-9">
        <div className="flex items-center justify-between bg-gradient-to-r from-[#9C65FE]/60 to-[#6A1DED] px-5 py-3 rounded-3xl ">
          {/* Progression */}
          <div className="w-[70px] h-[70px] md:w-[90px] md:h-[90px] font-bold">
            <CircularProgressbar
              value={value1}
              text={`${value1}%`}
              styles={buildStyles({
                pathColor: "#9164F0",
                trailColor: "#5302DD",
                textColor: "white",
                pathTransitionDuration: 0.5,
              })}
              strokeWidth={10}
            />
          </div>
          {/* infomation */}
          <div className="flex flex-col space-y-2">
            <span className="p-1 px-2 md:px-3 rounded-xl block bg-[#E78DD2] font-semibold">
              MachineID: 2
            </span>
            <div className="flex items-center justify-between space-x-4">
              <span className="p-1 px-2 md:px-3 rounded-xl block bg-[#E78DD2] font-semibold">
                StaffID: 3
              </span>
              <span className="hidden font-semibold sm:flex">zone: 4</span>
            </div>
          </div>
          {/* Who fix this machine */}
          <div className="relative hidden w-20 h-20 xl:inline-block ">
            <Image
              loader={myLoader}
              src="https://images.unsplash.com/photo-1649712344464-12f9563c03ff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=715&q=80"
              alt=""
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>
        </div>
        <div className="flex items-center justify-between bg-gradient-to-r from-[#4FA3FF]/50 to-[#2478F7] bg-[#9C65FE]/80 px-5 py-3 rounded-3xl ">
          {/* Progression */}
          <div className="w-[70px] h-[70px] md:w-[90px] md:h-[90px] font-bold">
            <CircularProgressbar
              value={value2}
              text={`${value2}%`}
              styles={buildStyles({
                pathColor: "#5D9AF5",
                trailColor: "#0454C7",
                textColor: "white",
                pathTransitionDuration: 0.5,
              })}
              strokeWidth={10}
            />
          </div>
          {/* infomation */}
          <div className="flex flex-col space-y-2">
            <span className="p-1 px-2 md:px-3 rounded-xl block bg-[#6A1EEB]/90 font-semibold">
              MachineID: 2
            </span>
            <div className="flex items-center justify-between space-x-4">
              <span className="p-1 px-2 md:px-3 rounded-xl block bg-[#6A1EEB]/90 font-semibold">
                StaffID: 3
              </span>
              <span className="hidden font-semibold sm:flex">zone: 4</span>
            </div>
          </div>
          {/* Who fix this machine */}
          <div className="relative hidden w-20 h-20 xl:inline-block ">
            <Image
              loader={myLoader}
              src="https://images.unsplash.com/photo-1649712344464-12f9563c03ff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=715&q=80"
              alt=""
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progressbar;
