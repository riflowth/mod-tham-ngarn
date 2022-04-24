import Home from '@components/Home';
import Navbar from '@components/Navbar/Navbar';
import { NextPage } from 'next';

const IndexPage: NextPage = () => {
  return (
    <div className="h-screen bg-[#22202e]">
      <Navbar />
      <Home />
    </div>
  );
};

export default IndexPage;
