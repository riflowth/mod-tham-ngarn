import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import fetch from "@utils/Fetch";
import Swal from "sweetalert2";

export const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitFrom = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const { username, password } = formData;

    if (!username || !password || password.length < 8) {
      Swal.fire({
        imageUrl: "https://avatars.githubusercontent.com/u/73115539?v=4",
        imageWidth: 400,
        imageHeight: 200,
        title: "Oops...",
        text: "Please fill in the blanks.",
        background: "/packages/frontend/public/eiei.png",
      });
      return;
    }

    try {
      const response = await fetch.post("/auth/login", {
        username,
        password,
      });

      Swal.fire({
        icon: "success",
        title: "Yeahh...",
        text: response.data.message,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.message,
          });
        }
      }
    }
  };

  const image = () => {
    return "https://images.unsplash.com/photo-1522543558187-768b6df7c25c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80";
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-violet-700">
      <div className="flex w-full max-w-7xl drop-shadow-2xl">
        <div className="relative w-2/3">
          <Image
            loader={image}
            src={image()}
            layout="fill"
            objectFit="cover"
            className="rounded-l-xl"
            alt=""
          />
        </div>

        <div className="w-1/3 px-5 py-24 space-y-10 bg-white rounded-r-xl">
          <div className="flex flex-col items-center w-full mx-auto space-y-5">
            <div className="mb-4 text-2xl font-bold">
              <span className="text-[#6043D0]">Login</span> your account
            </div>

            <form onSubmit={submitFrom} className="w-full space-y-6">
              <div className="flex flex-col pl-10 space-y-2">
                <label className="text-lg font-bold"> Username</label>
                <input
                  type="text"
                  className="border-b outline-none w-[80%] text-lg"
                  name="username"
                  value={formData.username}
                  onChange={handleInput}
                />
              </div>
              <div className="flex flex-col pl-10 space-y-2">
                <label className="text-lg font-bold"> Password</label>
                <input
                  type="Password"
                  className="w-[80%] border-b outline-none  text-lg"
                  name="password"
                  value={formData.password}
                  onChange={handleInput}
                />
              </div>
              <div className=" text-xl font-extrabold bg-[#6043D0] w-[60%] flex items-center mx-auto text-white py-2 hover:bg-[#6043D0]/90">
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
