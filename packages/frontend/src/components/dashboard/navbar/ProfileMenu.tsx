import { Menu, Transition } from '@headlessui/react';
import { LogoutIcon } from '@heroicons/react/outline';
import { ClassUtils } from '@utils/CommonUtils';
import fetch from '@utils/Fetch';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

type ProfileMenuProp = {
  id: string,
};

export const ProfileMenu = ({
  id,
}: ProfileMenuProp) => {
  const router = useRouter();

  const logout = async () => {
    const response = await fetch.get('/auth/logout');
    if (response.status === 200) {
      router.push('/login');
    }
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="w-10 h-10 rounded-md bg-zinc-600 hover:bg-zinc-400 border border-zinc-300 transition ease-in duration-100">
        <Image
          src={`https://avatars.dicebear.com/api/micah/${id}.svg`}
          alt=""
          layout="fill"
          objectFit="cover"
        />
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
        <Menu.Items className="absolute z-10 right-0 w-48 mt-2 origin-top rounded-md text-white bg-zinc-800 border border-zinc-600 shadow-md focus:outline-none divide-y divide-zinc-600">
          <div className="px-1 py-0">
            <Menu.Item as="div" className="p-2 flex flex-col">
              <span className="text-sm text-violet-400 font-semibold">Hi, Nathee</span>
              <span className="text-xs text-zinc-400 font-light">CEO</span>
            </Menu.Item>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={ClassUtils.concat(
                    active ? 'bg-zinc-700/50 border-violet-500' : 'border-transparent',
                    'flex w-full items-center space-x-2 rounded-md border-l-4 p-2 text-sm'
                  )}
                  onClick={logout}
                >
                  <LogoutIcon className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
