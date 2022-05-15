import { Dashboard } from '@components/dashboard/Dashboard';
import { withUser } from '@components/hoc/withUser';
import { NextPage } from 'next';
import ModThamNgarnLogo from '@publics/mtn-logo.svg';
import Image from 'next/image';

const IndexPage: NextPage = () => {
  return (
    <Dashboard current="Home">
      <div className="flex flex-col w-full justify-center items-center text-white mb-4">
        <div>
          <Image
            src={ModThamNgarnLogo}
            alt="Mod Tham Ngarn Logo"
          />
        </div>

        <div className="text-3xl font-bold">&quot;Mod Tham Ngarn&quot;</div>
        <div className="text-base font-light text-zinc-400">The Smartest Industrial Management Software!</div>
      </div>
    </Dashboard>
  );
};

export default withUser(IndexPage);
