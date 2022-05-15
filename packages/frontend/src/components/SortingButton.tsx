import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon, FilterIcon } from '@heroicons/react/outline';
import { Fragment } from 'react';

export type Sorting = {
  text: string,
  sort: (a: any, b: any) => number;
};

type SortingButtonProp = {
  sortings: Sorting[],
  sortBy: Sorting,
  setSortBy: React.Dispatch<React.SetStateAction<Sorting>>,
};

export const SortingButton = ({
  sortings,
  sortBy,
  setSortBy,
}: SortingButtonProp) => {
  return (
    <Listbox value={sortBy} onChange={setSortBy}>
      <div className="relative">
        <Listbox.Button className="h-full flex flex-row items-center text-white text-xs bg-zinc-700 hover:bg-zinc-600 rounded-md px-2 py-2 transition ease-in duration-100">
          <div className="w-3 text-zinc-400 mr-1 rounded-md"><FilterIcon /></div>
          <div className="font-medium tracking-tight mr-1 text-zinc-400">SORT:</div>
          <div className="font-medium tracking-tight text-zinc-100 mr-1">{sortBy.text}</div>
          <div className="w-3 text-zinc-400"><ChevronDownIcon /></div>
        </Listbox.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Listbox.Options className="absolute right-0 mt-2 w-56 origin-top rounded-md bg-zinc-600 border border-zinc-400 text-white shadow-lg focus:outline-none">
            {sortings.map((sorting) => (
              <Listbox.Option
                key={sorting.text}
                value={sorting}
                className={({ active }) => `
                        ${active ? 'bg-zinc-700' : ''}
                        relative rounded-md px-6 py-2
                      `}
              >
                {({ selected }) => (
                  <button className="flex w-full items-center text-white text-xs">
                    {selected && (
                      <CheckIcon className="absolute ml-1.5 left-0 h-4 w-4 text-white" />
                    )}
                    <span>{sorting.text}</span>
                  </button>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
