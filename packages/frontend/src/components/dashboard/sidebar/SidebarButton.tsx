import { ClassUtils } from 'src/utils/CommonUtils';

type SidebarButtonProp = {
  icon: React.ReactNode,
  text: string,
  active?: boolean,
};

export const SidebarButton = ({
  icon,
  text,
  active,
}: SidebarButtonProp) => {
  return (
    <div className={ClassUtils.concat(
      "flex flex-row items-center px-4 py-2 rounded-md transition ease-in duration-100",
      active 
        ? "bg-zinc-700/50 text-zinc-200 border-l-4 border-violet-500"
        : "text-zinc-500 hover:bg-zinc-700/50 hover:text-zinc-300 border-l-4 border-transparent hover:border-violet-500"
    )}>
      <div className="w-5 h-5 mr-3">{icon}</div>
      <span className="font-medium">{text}</span>
    </div>
  );
};
