import { SpinnerIcon } from '@components/SpinnerIcon';
import { Disclosure } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline';
import { ClassUtils } from '@utils/CommonUtils';
import fetch from '@utils/Fetch';
import { useEffect, useState } from 'react';

type ZoneDetailDropdownProp = {
  isOpen: boolean,
  branchId: string,
};

type Machine = {
  machineId: number,
  zoneId: number,
  name: string,
  serial: string,
  manufacturer: string,
  registrationDate: string,
  retiredDate: string,
  status: string,
};

type Zone = {
  machines: {
    id: number,
    status: string,
  }[],
  zoneId: number,
};

type ApiResponse = {
  data: Machine[],
};

export const ZoneDetailDropdown = ({
  isOpen,
  branchId,
}: ZoneDetailDropdownProp) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [zoneData, setZoneData] = useState<Zone[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchZoneData = async () => {
      const machines = await fetch.get<ApiResponse>(`/machine/branch/${branchId}`);
      const machineStatus = await Promise.all(machines.data.data
        .map((machine) => fetch
          .get(`/part/status/` + machine.machineId)
          .then((data) => { return { status: data.data, id: machine.machineId }; })));

      const zones: Zone[] = [];

      machines.data.data.forEach((machine) => {
        const zone = zones.find((zone: any) => zone.zoneId === machine.zoneId);
        const status = machineStatus.find((status) => status.id === machine.machineId);

        if (!zone) {
          zones.push({
            zoneId: machine.zoneId,
            machines: [{
              id: machine.machineId,
              status: status ? status.status.data : 'UNAVAILABLE',
            }],
          });
        } else {
          zone.machines.push({
            id: machine.machineId,
            status: status ? status.status.data : 'UNAVAILABLE',
          });
        }
      });

      zoneData.map((zone) => {
        console.log(zone.machines);
      });

      setZoneData(zones);
      setIsLoading(false);
    };

    fetchZoneData();
  }, [isOpen]);

  return (
    <Disclosure.Panel className={ClassUtils.concat(
      isLoading ? 'bg-zinc-700' : 'bg-zinc-600',
      "px-8 py-4 text-sm text-zinc-100 w-full",
    )}>
      {isLoading ? (
        <div className="flex flex-row space-x-2 justify-center">
          <div className="w-4 h-4 "><SpinnerIcon /></div>
          <span>Loading...</span>
        </div>
      ) : (
        <table className="w-full">
          <tbody>
            {zoneData.map((zone) => (
              <tr key={zone.zoneId} className="border-b border-zinc-400 hover:bg-zinc-400/20">
                <td className="px-2 py-3">
                  <div className="flex flex-col">
                    <span className="text-zinc-400 text-sm">Zone ID</span>
                    <span className="text-white text-sm">{zone.zoneId}</span>
                  </div>
                </td>
                <td className="px-2 py-3">
                  <div className="flex flex-col">
                    <span className="text-zinc-400 text-sm">Machine Count</span>
                    <span className="text-white text-sm">{zone.machines.length}</span>
                  </div>
                </td>
                <td className="px-2 py-3">
                  <div className="flex flex-col">
                    <div className="flex flex-row items-center space-x-1 w-fit text-zinc-700 px-2 rounded-md text-xs bg-emerald-500">
                      <CheckCircleIcon className="w-3 h-3" />
                      <span>Available</span>
                    </div>
                    <span className="text-white text-sm">
                      {zone.machines.filter((machine) => machine.status === 'AVAILABLE').length}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-3">
                  <div className="flex flex-col">
                    <div className="flex flex-row items-center space-x-1  w-fit text-zinc-300 px-2 rounded-md text-xs bg-red-600">
                      <XCircleIcon className="w-3 h-3" />
                      <span>Unvailable</span>
                    </div>
                    <span className="text-white text-sm">
                      {zone.machines.filter((machine) => machine.status === 'UNAVAILABLE').length}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Disclosure.Panel>
  );

  // THIS IS THE SECRET BELOW!!!

  // return (
  //   <Disclosure.Panel className={ClassUtils.concat(
  //     isLoading ? 'bg-zinc-700' : 'bg-zinc-600',
  //     "px-8 py-4 text-sm text-zinc-100 w-full"
  //   )}>
  // {isLoading ? (
  //   <div className="flex flex-row space-x-2 justify-center">
  //     <div className="w-4 h-4 "><SpinnerIcon /></div>
  //     <span>Loading...</span>
  //   </div>
  // ) : (
  //       <table className="w-full">
  //         <tbody>
  //           {zoneData!.map((zone) => (
  //             <tr key={zone.machineId} className="border-b border-zinc-400 hover:bg-zinc-400/20">
  // <td className="px-2 py-3">
  //   <div className="flex flex-col">
  //     <span className="text-zinc-400 text-sm">Zone ID</span>
  //     <span className="text-white text-xs">{zone.zoneId}</span>
  //   </div>
  // </td>
  //               <td className="px-2 py-3">
  //                 <div className="flex flex-col">
  //                   <span className="text-zinc-400 text-sm">Machine ID</span>
  //                   <span className="text-white text-xs">{zone.machineId}</span>
  //                 </div>
  //               </td>
  //               <td className="px-2 py-3">
  //                 <div className="flex flex-col">
  //                   <span className="text-zinc-400 text-sm">Serial</span>
  //                   <span className="text-white text-xs">{zone.serial}</span>
  //                 </div>
  //               </td>
  //               <td className="p-2">
  //                 <div className="flex flex-col">
  // <div className="flex flex-row space-x-1 items-center text-zinc-400 text-sm">
  //   <TagIcon className="w-3 h-3" />
  //   <span>Name</span>
  // </div>
  //                   <span className="text-white text-xs">{zone.name}</span>
  //                 </div>
  //               </td>
  //               <td className="p-2">
  //                 <div className="flex flex-col">
  //                   <span className="text-zinc-400 text-sm">Manufacturer</span>
  //                   <span className="text-white text-xs">{zone.manufacturer}</span>
  //                 </div>
  //               </td>
  //               <td className="p-2">
  //                 <div className="flex flex-col">
  //                   <div className="flex flex-row space-x-1 items-center text-zinc-400 text-sm">
  //                     <PencilAltIcon className="w-3 h-3" />
  //                     <span>Registration</span>
  //                   </div>
  //                   <span className="text-white text-xs">{moment(zone.registrationDate).format('dddd MM YYYY')}</span>
  //                 </div>
  //               </td>
  //               <td className="p-2">
  //                 <div className="flex flex-col">
  //                   <div className="flex flex-row space-x-1 items-center text-zinc-400 text-sm">
  //                     <XCircleIcon className="w-3 h-3" />
  //                     <span>Retired</span>
  //                   </div>
  //                   <span className="text-white text-xs">{moment(zone.retiredDate).format('dddd MM YYYY')}</span>
  //                 </div>
  //               </td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     )}
  //   </Disclosure.Panel>
  // );
};
