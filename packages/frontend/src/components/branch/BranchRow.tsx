import { ZoneDetailDropdown } from '@components/branch/ZoneDetailDropdown';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon, ClockIcon } from '@heroicons/react/outline';
import { ClassUtils } from '@utils/CommonUtils';
import Image from 'next/image';

type BranchItemProp = {
  id: string,
  managerName: string,
  address: string,
  pendingTicket: number,
  last: boolean,
};

export const BranchRow = ({
  id,
  managerName,
  address,
  pendingTicket,
  last,
}: BranchItemProp) => {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <tr className={`bg-zinc-700 hover:bg-zinc-600 ${!last ? 'border-b-2 border-zinc-500' : ''}`}>
            <td className="px-6 py-5">
              <div className="flex flex-col">
                <span className="text-zinc-400 text-sm">Branch ID</span>
                <span className="text-white">{id}</span>
              </div>
            </td>

            <td className="px-6 py-5">
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
                  <span className="text-zinc-400 text-sm">Manager</span>
                  <span className="text-white text-sm">{managerName}</span>
                </div>
              </div>
            </td>

            <td className="px-6 py-5">
              <div className="flex flex-col">
                <span className="text-zinc-400 text-sm">Address</span>
                <span className="text-white text-sm">{address}</span>
              </div>
            </td>

            <td className="px-6 py-5">
              <div className="flex flex-rol items-center">
                <button className="flex justify-center items-center border border-violet-500 hover:bg-violet-500 text-violet-400 hover:text-white rounded-md w-10 h-10 p-1.5 mr-2 transition ease-in duration-100"><ClockIcon /></button>
                <div className="text-zinc-300 font-light text-xs leading-tight">View Tickets</div>
              </div>
            </td>

            <td className="px-6 py-5">
              <Disclosure.Button className={ClassUtils.concat(
                open ? 'rotate-180 transform' : '',
                'w-12 h-12 p-3 text-zinc-400'
              )}>
                <ChevronDownIcon />
              </Disclosure.Button>
            </td>
          </tr>

          <tr
            className={ClassUtils.concat(
              !open ? 'hidden' : ''
            )}
          >
            <td colSpan={5}>
            <ZoneDetailDropdown
              isOpen={open}
              branchId={id}
            />
          </td>
        </tr>
      </>
  )
}
    </Disclosure >
  );
};
