/* eslint-disable jsx-a11y/alt-text */
import Image from "next/image";
import React, { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const myLoader = () => {
    return `https://images.unsplash.com/photo-1522543558187-768b6df7c25c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80`;
  };
  return (
    <div className="flex items-center justify-center w-full h-screen mx-auto bg-[#6043D0]/90">
      {/* Container */}
      <div className="flex w-full max-w-7xl drop-shadow-2xl">
        {/* Left Image */}
        <div className="relative w-[800px] h-[600px] flex-[2]">
          <Image
            loader={myLoader}
            src="https://images.unsplash.com/photo-1522543558187-768b6df7c25c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            layout="fill"
            objectFit="cover"
            className="rounded-l-xl"
          />
        </div>
        {/* Right Form */}
        <div className="w-full bg-white flex-[1] rounded-r-xl p-5 space-y-10">
          {/* title */}
          <div className="flex flex-col space-y-1">
            <span className="text-3xl font-bold text-[#6043D0]">Hello!!</span>
            <span className="text-3xl font-bold text-[#6043D0]">
              Good Morning
            </span>
          </div>

          {/* Form */}
          <div className="flex flex-col items-center w-full p-2 mx-auto space-y-5 ">
            {/* Head */}
            <div className="text-2xl font-bold ">
              <span className="text-[#6043D0]">Login</span> your account
            </div>
            <form action="" className="self-start w-full space-y-6">
              <div className="flex flex-col pl-10 space-y-2">
                <label className="text-lg font-bold"> Username</label>
                <input
                  type="text"
                  className="border-b outline-none w-[80%] text-lg"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="flex flex-col pl-10 space-y-2">
                <label className="text-lg font-bold"> Password</label>
                <input
                  type="Password"
                  className="w-[80%] border-b outline-none  text-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className=" text-xl font-extrabold bg-[#6043D0] w-[60%] flex items-center t mx-auto text-white py-2 hover:bg-[#6043D0]/90">
                <button className="items-center w-full" type="submit">
                  Login
                </button>
              </div>
            </form>
            <a
              href=""
              className="text-[#6043D0] border-b border-[#6043D0] hover:font-medium hover:border-b-2"
            >
              Forget Password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
