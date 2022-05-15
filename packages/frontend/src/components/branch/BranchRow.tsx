import { EditBranchModal } from '@components/branch/EditBranchModal';
import { ZoneDetailDropdown } from '@components/branch/ZoneDetailDropdown';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon, TrashIcon, XIcon } from '@heroicons/react/outline';
import { useAuth } from '@hooks/auth/AuthContext';
import { ClassUtils } from '@utils/CommonUtils';
import fetch from '@utils/Fetch';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

type BranchItemProp = {
  id: string,
  managerId: number,
  managerName: string,
  address: string,
  telNo: string,
  pendingTicket: number,
  last: boolean,
};

export const BranchRow = ({
  id,
  managerId,
  managerName,
  address,
  telNo,
  pendingTicket,
  last,
}: BranchItemProp) => {
  const { user } = useAuth();
  const router = useRouter();

  const deleteBranch = (branchId: string) => {
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
          .delete(`/branch/${branchId}`)
          .then(() => {
            Swal.fire("Deleted!", "This Branch has been deleted.", "success");
            router.reload();
          })
          .catch((error: any) => Swal.fire("Failed", error.response.data.message, "error"));
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your Branch is safe :)", "error");
      }
    });
  };

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
                    {managerId !== -1 ? (
                      <Image
                        src={`https://avatars.dicebear.com/api/micah/${managerId}.svg`}
                        alt=""
                        layout="fill"
                        objectFit="cover"
                      />
                    ) : (
                      <XIcon className="text-zinc-300 p-2" />
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-400 text-sm">Manager</span>
                  <span className="text-white text-sm">{managerName || '-'}</span>
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
              <div className="flex flex-col">
                <span className="text-zinc-400 text-sm">Tel No.</span>
                <span className="text-white text-sm">{telNo}</span>
              </div>
            </td>

            <td className="px-6 py-5">
              {user!.role === 'CEO' && (
                <div className="flex flex-rol space-x-2 items-center">
                  <button
                    className="flex justify-center items-center border border-red-500 hover:bg-red-500 text-red-400 hover:text-white rounded-md w-10 h-10 p-2 transition ease-in duration-100"
                    onClick={() => deleteBranch(id)}
                  >
                    <TrashIcon />
                  </button>
                  <EditBranchModal
                    branchId={id}
                    manager={managerName}
                    address={address}
                    telNo={telNo}
                  />
                </div>
              )}
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
            <td colSpan={6}>
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
