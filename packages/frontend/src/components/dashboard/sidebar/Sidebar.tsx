import { SidebarButton } from '@components/dashboard/sidebar/SidebarButton';
import { ChipIcon, ClipboardListIcon, HomeIcon, UserIcon } from '@heroicons/react/outline';

const sidebarMenus = [
  { icon: <HomeIcon />, text: 'Home', href: '/' },
  { icon: <UserIcon />, text: 'Manage User', href: '/' },
  { icon: <ChipIcon />, text: 'Manage Machine', href: '/' },
  { icon: <ClipboardListIcon />, text: 'Tickets', href: '/' },
];

export const Sidebar = () => {
  return (
    <div className="h-screen bg-zinc-900 px-4 py-8">
      <div className="flex flex-row justify-center items-center space-x-4 mb-12 px-4">
        <div className="w-10 h-10 bg-white rounded-md" />
        <div className="flex flex-col justify-center">
          <h1 className="text-zinc-400 font-bold tracking-tighter">Mod Tham Ngarn</h1>
          <p className="text-zinc-600 text-xs font-bold tracking-tighter">Industrial Management</p>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        {sidebarMenus.map((menu, index) => (
          <a key={index} href={menu.href}>
            <SidebarButton
              icon={menu.icon}
              text={menu.text}
              active={index === 0}
            />
          </a>
        ))}
      </div>
    </div>
  );
};
