import { Dialog, Transition } from '@headlessui/react';
import { PencilAltIcon, PencilIcon, XIcon } from '@heroicons/react/outline';
import fetch from '@utils/Fetch';
import Router from 'next/router';
import { Fragment, useState } from 'react';
import Swal from 'sweetalert2';

type BranchData = {
  address: string,
  postalCode: string,
  telNo: string,
};

export const NewBranchModal = ({
}) => {
  const [data, setData] = useState<BranchData>({
    address: '',
    postalCode: '',
    telNo: '',
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const add = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, edit it!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch
          .post('/branch', data)
          .then(() => {
            Swal.fire("Deleted!", "Your branch has been edited.", "success")
              .then(() => {
                Router.reload();
              });
          })
          .catch((error: any) => Swal.fire("Failed", error.response.data.message, "error"));
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", ":)", "error");
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex flex-row items-center text-white text-xs bg-violet-600 hover:bg-violet-700 rounded-md px-2 py-2 transition ease-in duration-100">
        <div className="w-5 bg-violet-300 text-violet-700 mr-1 p-1 rounded-md"><PencilIcon /></div>
        <div className="font-medium tracking-tight">NEW BRANCH</div>
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
                    New Branch
                  </Dialog.Title>

                  <div className="mb-4">
                    <div className="text-sm text-white mb-1">
                      <span>Address</span>
                    </div>
                    <input
                      className="w-full rounded-md shadow px-2"
                      type="text"
                      name="address"
                      value={data.address}
                      onChange={(e) => setData({ ...data, address: e.target.value })}
                    />
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-white mb-1">
                      <span>Postal code</span>
                    </div>
                    <input
                      className="w-full rounded-md shadow px-2"
                      type="text"
                      name="address"
                      value={data.postalCode}
                      onChange={(e) => setData({ ...data, postalCode: e.target.value })}
                    />
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-white mb-1">
                      <span>Telephone number</span>
                    </div>
                    <input
                      className="w-full rounded-md shadow px-2"
                      type="text"
                      name="address"
                      value={data.telNo}
                      onChange={(e) => setData({ ...data, telNo: e.target.value })}
                    />
                  </div>

                  <button
                    className="flex flex-row justify-center items-center space-x-1 bg-violet-600 ring ring-violet-400 hover:ring-violet-500 hover:bg-violet-700 text-white w-full rounded-md text-sm py-1"
                    onClick={add}
                  >
                    <PencilAltIcon className="w-3 h-3" />
                    <span>Add</span>
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
