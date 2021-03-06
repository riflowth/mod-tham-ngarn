import { useAuth } from '@hooks/auth/AuthContext';
import axios from 'axios';
import Image from "next/image";
import { useRouter } from 'next/router';
import { useState } from "react";
import Swal from "sweetalert2";
import ModThamNgarnLogo from '@publics/mtn-logo.svg';

export const Login = () => {
  const { login, error } = useAuth();
  const router = useRouter();

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

    const error = await login(username, password);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: axios.isAxiosError(error) ? error!.response!.data.message : 'Unexpected error',
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Yeahh...",
        text: 'Login successfully!',
      }).then(() => {
        router.push('/');
      });
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-zinc-800">
      <div className="flex justify-center w-full lg:max-w-7xl drop-shadow-2xl mx-12">
        <div className="hidden lg:block relative bg-zinc-700 rounded-l-md w-2/3">
          <Image
            src={ModThamNgarnLogo}
            layout="fill"
            alt=""
          />
        </div>

        <div className="w-full lg:w-1/3 px-5 py-24 space-y-10 bg-white rounded-xl lg:rounded-l-none lg:rounded-r-xl">
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
              <button
                className="flex justify-center w-2/3 mx-auto py-2 rounded-md text-xl bg-violet-700 text-white hover:bg-violet-700/90"
                type="submit"
              >
                Login
              </button>
            </form>
            <a
              href=""
              className="text-violet-700 border-b border-violet-700 hover:font-medium hover:border-b-2"
            >
              Forget Password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
