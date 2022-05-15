import { EditZoneModal } from '@components/branch/EditZoneModal';
import { SpinnerIcon } from '@components/SpinnerIcon';
import { Disclosure } from '@headlessui/react';
import { CheckCircleIcon, TrashIcon, XCircleIcon } from '@heroicons/react/outline';
import { ClassUtils } from '@utils/CommonUtils';
import fetch from '@utils/Fetch';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

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
  price: number,
  status: string,
};

type Zone = {
  machines: {
    id: number,
    status: string,
    price: number,
  }[],
  price: number,
  zoneId: number,
  timeToStart: string,
  timeToEnd: string,
};

type ZoneResponse = {
  zoneId: number,
  timeToStart: string,
  timeToEnd: string,
  branchId: number,
};

type ApiResponse<T> = {
  data: T,
};

export const ZoneDetailDropdown = ({
  isOpen,
  branchId,
}: ZoneDetailDropdownProp) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [zoneData, setZoneData] = useState<Zone[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    fetchZoneData();
  }, [isOpen]);

  const fetchZoneData = async () => {
    const zoneInfos = await fetch.get<ApiResponse<ZoneResponse[]>>(`/branch/${branchId}/zone`);
    const machines = await fetch.get<ApiResponse<Machine[]>>(`/machine/branch/${branchId}`);
    const machineStatus = await Promise.all(machines.data.data
      .map((machine) => fetch
        .get(`/part/status/` + machine.machineId)
        .then((data) => { return { status: data.data, id: machine.machineId }; })));

    const zones = zoneInfos.data.data.map((info) => {
      const zoneMachines = machines.data.data.filter((machine) => machine.zoneId === info.zoneId);
      return {
        zoneId: info.zoneId,
        timeToStart: info.timeToStart,
        timeToEnd: info.timeToEnd,
        price: zoneMachines.reduce((acc, obj) => (acc + obj.price), 0),
        machines: zoneMachines.map((machine) => ({
          id: machine.machineId,
          status: machineStatus.filter((status) => status.id === machine.machineId)[0].status.data,
          price: machine.price,
        })),
      };
    });

    setZoneData(zones);
    setIsLoading(false);
  };

  const deleteZone = async (zoneId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch
          .delete(`/zone/${zoneId}`)
          .then(() => {
            Swal.fire("Deleted!", "This Zone has been deleted.", "success");
            fetchZoneData();
          })
          .catch((error: any) => Swal.fire("Failed", error.response.data.message, "error"));
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your Zone is safe :)", "error");
      }
    });
  };

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
                    <span className="text-zinc-400 text-sm">Work Time</span>
                    <span className="text-white text-sm">
                      {moment(zone.timeToStart).format('HH:mm a')} - {moment(zone.timeToEnd).format('HH:mm a')}
                    </span>
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
                    <span className="text-zinc-400 text-sm">Price</span>
                    <span className="text-white text-sm">{new Intl.NumberFormat('th-TH').format(zone.price)} ฿</span>
                  </div>
                </td>

                {zone.machines.length !== 0 ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <td>-</td>
                    <td>-</td>
                  </>
                )}

                <td className="flex flex-row space-x-2 px-2 py-3">
                  <button
                    className="w-8 h-8 p-1.5 text-red-500 bg-transparent rounded-md ring-1 ring-red-500 hover:bg-red-500 hover:text-white"
                    onClick={() => deleteZone(zone.zoneId)}
                  >
                    <TrashIcon />
                  </button>
                  <EditZoneModal
                    zoneId={zone.zoneId}
                    timeToStart={zone.timeToStart}
                    timeToEnd={zone.timeToEnd}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Disclosure.Panel>
  );
};
