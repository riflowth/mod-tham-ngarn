import { ProfileMenu } from '@components/dashboard/navbar/ProfileMenu';
import { useAuth } from '@hooks/auth/AuthContext';
import moment from 'moment';

export const Navbar = () => {
  const { user } = useAuth();
  
  return (
    <div className="w-full bg-zinc-900 px-6 py-4">
      <div className="flex flex-row justify-end space-x-6 items-center">
        <div className="flex flex-col leading-none">
          <div className="text-xs font-medium text-zinc-500">Today</div>
          <div className="font-medium text-sm text-zinc-200">{moment().format('ddd D MMM YYYY')}</div>
        </div>

        <div className="flex flex-row space-x-4">
          {/* <div className="relative text-zinc-200 w-10 h-10 border border-zinc-500 p-2 rounded-md hover:bg-violet-500 hover:text-white hover:border-violet-700 transition ease-in duration-100">
            <span className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/2 rounded-full bg-violet-500 px-2 py-1 text-xs font-medium leading-none">2</span>
            <BellIcon />
          </div> */}

          <ProfileMenu
            id={user!.staffId.toString()}
          />
        </div>
      </div>
    </div>
  );
};
