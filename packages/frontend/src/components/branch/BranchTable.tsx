import { BranchItem } from '@components/branch/BranchItem';
import { ChevronDownIcon, FilterIcon, PencilIcon } from '@heroicons/react/outline';
import axios from 'axios';
import { useEffect, useState } from 'react';

type BranchApiResponse = {
  branchId: number,
  address: string,
  postalCode: string,
  telNo: string,
};

type ApiResponse = {
  data: BranchApiResponse[],
};

export const BranchTable = () => {
  const [branches, setBranches] = useState<BranchApiResponse[]>([]);

  useEffect(() => {
    const loadBranchesData = async () => {
      const response = await axios.get<ApiResponse>('http://localhost:4000/branch');
      setBranches(response.data.data);
    };

    loadBranchesData();
  }, []);

  return (
    <div className="w-full p-8">
      <div className="flex flex-row justify-between items-center mb-4">
        <div className="text-white font-semibold text-lg">Branches</div>

        <div className="flex flex-row space-x-2">
          <button className="flex flex-row items-center text-white text-xs bg-violet-600 rounded-md px-2 py-2">
            <div className="w-5 bg-violet-300 text-violet-700 mr-1 p-1 rounded-md"><PencilIcon /></div>
            <div className="font-medium tracking-tight">NEW BRANCH</div>
          </button>

          <button className="flex flex-row items-center text-white text-xs bg-zinc-700 rounded-md px-2 py-2">
            <div className="w-3 text-zinc-400 mr-1 rounded-md"><FilterIcon /></div>
            <div className="font-medium tracking-tight mr-1 text-zinc-400">SORT:</div>
            <div className="font-medium tracking-tight text-zinc-100 mr-1">Recently Created</div>
            <div className="w-3 text-zinc-400"><ChevronDownIcon /></div>
          </button>
        </div>
      </div>

      {branches.length === 0 && (
        <div>No Branch</div>
      )}

      <div className="flex flex-col space-y-4">
        {branches.length !== 0 && branches.map((branch) => (
          <BranchItem
            key={branch.branchId}
            id={branch.branchId.toString()}
            managerName={"11"}
            address={branch.address}
          />
        ))}
      </div>
    </div>
  );
};
