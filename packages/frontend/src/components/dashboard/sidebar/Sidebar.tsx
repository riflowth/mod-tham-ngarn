import { SidebarButton } from '@components/dashboard/sidebar/SidebarButton';
import { CashIcon, ChipIcon, ClipboardListIcon, HomeIcon, UserIcon, ViewListIcon } from '@heroicons/react/outline';
import ModThamNgarnLogo from '@publics/mtn-logo.svg';
import Image from 'next/image';

type SidebarProp = {
  current: string,
};

const sidebarMenus = [
  { icon: <HomeIcon />, text: 'Home', href: '/' },
  { icon: <UserIcon />, text: 'Staff', href: '/staffs' },
  { icon: <ChipIcon />, text: 'Machine', href: '/machines' },
  { icon: <ViewListIcon />, text: 'Branch', href: '/branch' },
  { icon: <ClipboardListIcon />, text: 'Ticket', href: '/maintenances' },
  { icon: <CashIcon />, text: 'Bill', href: '/bills' },
];

export const Sidebar = ({
  current,
}: SidebarProp) => {
  return (
    <div className="h-screen bg-zinc-900 px-4 py-8">
      <div className="flex flex-row justify-center items-center space-x-2 mb-12 px-4">
        <div className="w-10 h-10 rounded-md">
          <Image
            src={ModThamNgarnLogo}
            alt=""
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-zinc-300 font-bold tracking-tighter">Mod Tham Ngarn</h1>
          <p className="text-zinc-500 text-xs font-bold tracking-tighter">Industrial Management</p>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        {sidebarMenus.map((menu, index) => (
          <a key={index} href={menu.href}>
            <SidebarButton
              icon={menu.icon}
              text={menu.text}
              href={menu.href}
              active={index === sidebarMenus.findIndex((menu) => menu.text === current)}
            />
          </a>
        ))}
      </div>
    </div>
  );
};
