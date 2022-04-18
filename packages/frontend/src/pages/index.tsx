import type { NextPage } from "next";
import Navbar from "../components/Navbar/Navbar";
import Home from "../components/Home";

const IndexPage: NextPage = () => {
  return (
    <div className="h-screen bg-[#22202e]  ">
      <Navbar />
      <Home />
    </div>
  );
};

export default IndexPage;
