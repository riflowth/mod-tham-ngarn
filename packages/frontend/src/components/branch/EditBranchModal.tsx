import { Dialog, Transition } from '@headlessui/react';
import { PencilAltIcon, XIcon } from '@heroicons/react/outline';
import fetch from '@utils/Fetch';
import Router from 'next/router';
import { Fragment, useState } from 'react';
import Swal from 'sweetalert2';

type BranchData = {
  branchId: string,
  manager: string,
  address: string,
  telNo: string,
};

export const EditBranchModal = ({
  branchId,
  manager,
  address,
  telNo,
}: BranchData) => {
  const [data, setData] = useState<BranchData>({ branchId, manager, address, telNo });
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
          .put('/branch/' + branchId, { ...data })
          .then(() => {
            Swal.fire("Deleted!", "Your branch has been edited.", "success")
              .then(() => {
                Router.reload();
              });
          })
          .catch((error: any) => Swal.fire("Failed", error.response.data.message, "error"));
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your branch is safe :)", "error");
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex justify-center items-center border border-violet-500 hover:bg-violet-500 text-violet-400 hover:text-white rounded-md w-10 h-10 p-2 mr-2 transition ease-in duration-100"
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
                    Edit Branch {branchId}
                  </Dialog.Title>

                  <div className="mb-4">
                    <div className="text-sm text-white mb-1">
                      <span>Address</span>
                    </div>
                    <input
                      className="w-full rounded-md shadow px-2"
                      type="text"
                      value={data.address}
                      onChange={(e) => setData({ ...data, address: e.target.value })}
                    />
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-white mb-1">
                      <span>Telephone number</span>
                    </div>
                    <input
                      className="w-full rounded-md shadow px-2"
                      type="text"
                      value={data.telNo}
                      onChange={(e) => setData({ ...data, telNo: e.target.value })}
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
