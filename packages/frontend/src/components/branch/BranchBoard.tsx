import { BranchTable } from '@components/branch/BranchTable';
import { Sorting, SortingButton } from '@components/SortingButton';
import { PencilIcon } from '@heroicons/react/outline';
import fetch from '@utils/Fetch';
import { useEffect, useState } from 'react';

type BranchResponse = {
  branchId: number,
  address: string,
  postalCode: string,
  telNo: string,
};

type StaffResponse = {
  branchId: number,
  fullName: string,
  position: string,
};

type ApiResponse<T> = {
  data: T,
};

export type Branch = BranchResponse & {
  managerName: string,
};

const sortings: Sorting[] = [
  {
    text: 'Recently Created',
    sort: (a: any, b: any) => {
      if (a.branchId < b.branchId) return -1;
      if (a.branchId > b.branchId) return 1;
      return 0;
    }
  },
  {
    text: 'Issue Count',
    sort: (a: any, b: any) => {
      if (a.address < b.address) return -1;
      if (a.address > b.address) return 1;
      return 0;
    }
  },
  {
    text: 'Manager Name',
    sort: (a: any, b: any) => {
      if (a.managerName < b.managerName) return -1;
      if (a.managerName > b.managerName) return 1;
      return 0;
    }
  }
];

export const BranchBoard = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [sortBy, setSortBy] = useState(sortings[0]);

  useEffect(() => {
    const loadBranchesData = async () => {
      const branches = await fetch.get<ApiResponse<BranchResponse[]>>('/branch');
      const staffs = await fetch.get<ApiResponse<StaffResponse[]>>('/staff');

      const branchesData: Branch[] = branches.data.data.map((branch) => {
        const manager = staffs.data.data.find((staff) => {
          return (staff.position === 'MANAGER') && (staff.branchId === branch.branchId);
        });
        return { ...branch, managerName: manager ? manager.fullName : '' };
      });

      setBranches(branchesData);
    };

    loadBranchesData();
  }, []);

  return (
    <div className="w-full p-8 overflow-y-auto">
      <div className="flex flex-row justify-between items-center mb-4">
        <div className="text-white font-semibold text-lg">Branches</div>

        <div className="flex flex-row space-x-2">
          <button className="flex flex-row items-center text-white text-xs bg-violet-600 hover:bg-violet-700 rounded-md px-2 py-2 transition ease-in duration-100">
            <div className="w-5 bg-violet-300 text-violet-700 mr-1 p-1 rounded-md"><PencilIcon /></div>
            <div className="font-medium tracking-tight">NEW BRANCH</div>
          </button>

          <SortingButton
            sortings={sortings}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
      </div>

      {branches.length === 0 ? (
        <div className="text-zinc-400">No Branch</div>
      ) : (
        <BranchTable
          branches={branches}
          sortBy={sortBy}
        />
      )}
    </div>
  );
};
