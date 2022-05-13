import { ClockIcon } from '@heroicons/react/outline';
import Image from 'next/image';

type BranchItemProp = {
  id: string,
  managerName: string,
  address: string,
};

export const BranchItem = ({
  id,
  managerName,
  address,
}: BranchItemProp) => {
  return (
    <div className="flex flex-row items-center justify-between w-full bg-zinc-700 rounded-md px-6 py-4">
      <div className="flex flex-row space-x-8">
        <div className="flex flex-col">
          <span className="text-zinc-400">Branch ID</span>
          <span className="text-white">{id}</span>
        </div>

        <div className="flex flex-row items-center space-x-3">
          <div className="flex flex-col">
            <div className="relative w-10 h-10 rounded-full bg-zinc-500 overflow-hidden">
              <Image
                src={`https://avatars.dicebear.com/api/micah/${id}.svg`}
                alt=""
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-zinc-400">Manager</span>
            <span className="text-white">{managerName}</span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-zinc-400">Address</span>
          <span className="text-white">{address}</span>
        </div>
      </div>

      <div className="flex flex-row space-x-4">
        <div className="flex flex-rol items-center">
          <div className="border border-violet-500 hover:bg-violet-500 text-violet-400 hover:text-white rounded-md w-10 h-10 p-1.5 mr-3 transition ease-in duration-100"><ClockIcon /></div>
          <div className="flex flex-col">
            <div className="text-white font-medium text-lg leading-tight">11</div>
            <div className="text-zinc-400 font-light text-xs leading-tight">Ticket Pending</div>
          </div>
        </div>
      </div>

    </div>
  );
};
