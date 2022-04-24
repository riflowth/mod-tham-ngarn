import Chart from '@components/AreaChart';
import ErrorLog from '@components/ErrorLogs/ErrorLog';
import Progressbar from '@components/Progressbar';
import TwoBarChart from '@components/TwoBarChart';

const Home = () => {
  return (
    <div className="relative w-full px-10 py-10 text-white bg-[#22202e]">
      <div className="grid grid-rows-1 gap-10 mx-auto my-auto lg:grid-cols-3">
        {/* ---------------------------- */}
        {/* Graph stat */}
        <div className=" bg-[#353147] rounded-xl ">
          <Chart />
        </div>

        {/* Log notification */}
        <div className="bg-[#353147] rounded-xl ">
          <ErrorLog />
        </div>
        {/* Calendar*/}
        <div className="bg-[#353147] rounded-xl">
          <Progressbar />
        </div>

        {/* Twobar */}
        <div className="bg-[#353147] rounded-xl md:col-span-2">
          <TwoBarChart />
        </div>

        <div className="bg-[#353147] rounded-xl ">
          {/* <MachineLog /> */}
          what is this space
        </div>

        {/* ---------------------------- */}
      </div>
    </div>
  );
};

export default Home;
