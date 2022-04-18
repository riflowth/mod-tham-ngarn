type ItemList = {
  text: String;
  icon: SVGIcon;
};
type SVGIcon = (props: React.ComponentProps<"svg">) => JSX.Element;

const SidebarItem = (props: ItemList) => {
  const Icon = props.icon;
  return (
    <div className="flex space-x-4 hover:bg-[#75659E] p-1 md:p-2 cursor-pointer transition-colors duration-200 ease-in-out rounded-xl">
      <Icon className="text-white w-7 h-7 " />
      <span className="hidden sm:inline-block text-[#CBC3D8] sm:text-md md:text-lg  font-bold">
        {props.text}
      </span>
    </div>
  );
};

export default SidebarItem;
