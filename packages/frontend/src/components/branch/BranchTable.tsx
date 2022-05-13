import { BranchItem } from '@components/branch/BranchItem';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, ClockIcon, ExclamationIcon, FilterIcon, PencilIcon } from '@heroicons/react/outline';
import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';

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
          <button className="flex flex-row items-center text-white text-xs bg-violet-600 hover:bg-violet-700 rounded-md px-2 py-2 transition ease-in duration-100">
            <div className="w-5 bg-violet-300 text-violet-700 mr-1 p-1 rounded-md"><PencilIcon /></div>
            <div className="font-medium tracking-tight">NEW BRANCH</div>
          </button>

          <Menu as="div" className="relative">
            <Menu.Button className="h-full flex flex-row items-center text-white text-xs bg-zinc-700 hover:bg-zinc-600 rounded-md px-2 py-2 transition ease-in duration-100">
              <div className="w-3 text-zinc-400 mr-1 rounded-md"><FilterIcon /></div>
              <div className="font-medium tracking-tight mr-1 text-zinc-400">SORT:</div>
              <div className="font-medium tracking-tight text-zinc-100 mr-1">Recently Created</div>
              <div className="w-3 text-zinc-400"><ChevronDownIcon /></div>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top rounded-md bg-zinc-600 border border-zinc-400 text-white shadow-lg focus:outline-none divide-y">
                <Menu.Item as="div">
                  {({ active }) => (
                    <button
                      className={`${active ? 'bg-zinc-700' : ''} 
                        flex w-full items-center rounded-md p-2 text-white text-xs`}
                    >
                      <ClockIcon className="mr-2 h-4 w-4" />
                      <span>Recently Created</span>
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item as="div">
                  {({ active }) => (
                    <button
                      className={`${active ? 'bg-zinc-700' : ''} 
                        flex w-full items-center rounded-md p-2 text-white text-xs`}
                    >
                      <ExclamationIcon className="mr-2 h-4 w-4" />
                      <span>Issue Count</span>
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
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
