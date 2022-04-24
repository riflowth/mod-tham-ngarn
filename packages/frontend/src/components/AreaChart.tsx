import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: " A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: " B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: " C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: " D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: " E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: " F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: " G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const Chart = () => {
  return (
    <div className="flex flex-col items-center px-3 py-5">
      <div className="self-start p-2 ml-12 text-xl font-bold text-[#CBC3D8]">
        What is this Graph?
      </div>
      <div className="h-[250px] w-[300px] md:w-[400px] xl:w-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <XAxis dataKey="name" tick={{ fill: "white" }} />
            <YAxis tick={{ fill: "white" }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="uv"
              stroke="#E78DD2"
              fill="#E78DD2"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
