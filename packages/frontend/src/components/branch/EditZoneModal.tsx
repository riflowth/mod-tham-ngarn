import { Dialog, Transition } from '@headlessui/react';
import { PencilAltIcon, XIcon } from '@heroicons/react/outline';
import fetch from '@utils/Fetch';
import moment from 'moment';
import Router from 'next/router';
import { Fragment, useState } from 'react';
import Swal from 'sweetalert2';

type ZoneData = {
  timeToStart: string,
  timeToEnd: string,
};

type EditZoneModalProp = ZoneData & { zoneId: number };

export const EditZoneModal = ({
  zoneId,
  timeToStart,
  timeToEnd,
}: EditZoneModalProp) => {
  const [data, setData] = useState<ZoneData>({
    timeToStart: moment(timeToStart).format('HH:mm a'),
    timeToEnd: moment(timeToEnd).format('HH:mm a')
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const edit = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, edit it!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch
          .put('/zone/' + zoneId, { 
            timeToStart: moment(data.timeToStart, 'HH:mm a').format('YYYY-MM-DD HH:mm:ss'),
            timeToEnd: moment(data.timeToEnd, 'HH:mm a').format('YYYY-MM-DD HH:mm:ss')
           })
          .then(() => {
            Swal.fire("Deleted!", "Your zone has been edited.", "success")
              .then(() => {
                Router.reload();
              });
          })
          .catch((error: any) => Swal.fire("Failed", error.response.data.message, "error"));
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your zone is safe :)", "error");
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex justify-center items-center border border-violet-500 hover:bg-violet-500 text-violet-400 hover:text-white rounded-md w-8 h-8 p-1.5 mr-2 transition ease-in duration-100"
      >
        <PencilAltIcon />
      </button>
      <Transition as={Fragment} show={isOpen}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full bg-zinc-500 ring ring-zinc-400 p-6 rounded-md max-w-md transform transition-all shadow-md">
                  <button
                    className="absolute top-0 right-0 w-5 h-5 text-zinc-800 hover:text-zinc-900 m-4"
                    onClick={() => setIsOpen(false)}
                  >
                    <XIcon />
                  </button>

                  <Dialog.Title as="div" className="text-lg font-semibold text-white mb-2">
                    Edit Zone {zoneId}
                  </Dialog.Title>

                  <div className="mb-4">
                    <div className="text-sm text-white mb-1">
                      <span>Time To Start</span>
                    </div>
                    <input
                      className="w-full rounded-md shadow px-2"
                      type="text"
                      value={data.timeToStart}
                      onChange={(e) => setData({ ...data, timeToStart: e.target.value })}
                    />
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-white mb-1">
                      <span>Time To End</span>
                    </div>
                    <input
                      className="w-full rounded-md shadow px-2"
                      type="text"
                      value={data.timeToEnd}
                      onChange={(e) => setData({ ...data, timeToEnd: e.target.value })}
                    />
                  </div>

                  <button
                    className="flex flex-row justify-center items-center space-x-1 bg-violet-600 ring ring-violet-400 hover:ring-violet-500 hover:bg-violet-700 text-white w-full rounded-md text-sm py-1"
                    onClick={edit}
                  >
                    <PencilAltIcon className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
