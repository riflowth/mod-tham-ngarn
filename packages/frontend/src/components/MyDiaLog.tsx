import { Dialog, Transition } from "@headlessui/react";
import { Entity } from '@models/Entity';
import { Fragment, useState, cloneElement, useEffect } from "react";
import Swal from "sweetalert2";

type MyDialogProp<T extends Entity> = {
  children: React.ReactElement;
  isModalOpen: boolean;
  close: Function;
  action: string;
  current?: T;
};

export function MyDialog<T>({ children, isModalOpen, close, action, current }: MyDialogProp<T>) {
  const [confirm, setConfirm] = useState(false);

  const openConfirm = async () => {
    const value = await Swal.fire({
      icon: "question",
      title: "Confirm Action",
      showCancelButton: true,
      toast: true,
      width: "20rem",
      confirmButtonText: "Confirm",
    });
    if (value.isConfirmed) {
      setConfirm(true);
      close();
    }
  };

  useEffect(() => {
    setConfirm(false);
  }, [isModalOpen]);

  return (
    <>
      <Transition appear show={isModalOpen} as="div">
        <Dialog as="div" className="relative z-10" onClose={() => close()}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform shadow-xl bg-zinc-700 rounded-2xl">
                  {cloneElement(children, { confirm: confirm, current: current, action: action })}
                  <div className="flex flex-row justify-around">
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md bg-violet-500 focus:outline-none hover:bg-violet-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={openConfirm}
                      >
                        OK
                      </button>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md bg-violet-500 focus:outline-none hover:bg-violet-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => close()}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
