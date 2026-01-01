import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from '@headlessui/react';
import { Fragment } from 'react';
import { useChat } from '@/lib/hooks/useChat';
import { categories } from '@/lib/research/search/categories';

const Category = () => {
  const { category, setCategory } = useChat();

  const selectedCategory = categories.find((cat) => cat.code === category) || categories[0];

  return (
    <Popover className="relative w-full max-w-[15rem] md:max-w-md lg:max-w-lg">
      <PopoverButton
        type="button"
        className="active:border-none hover:bg-light-200 hover:dark:bg-dark-200 p-2 rounded-lg focus:outline-none headless-open:text-black dark:headless-open:text-white text-black/50 dark:text-white/50 active:scale-95 transition duration-200 hover:text-black dark:hover:text-white"
      >
        <div className="flex flex-row items-center space-x-1">
          <selectedCategory.icon size={16} />
        </div>
      </PopoverButton>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <PopoverPanel className="absolute z-10 w-64 md:w-[400px] -right-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-light-primary dark:bg-dark-primary border rounded-lg border-light-200 dark:border-dark-200 w-full p-4 max-h-[200px] md:max-h-none overflow-y-auto">
            {categories.map((cat, i) => (
              <PopoverButton
                onClick={() => setCategory(cat.code)}
                key={i}
                className={cn(
                  'p-2 rounded-lg flex flex-col items-center justify-center text-center space-y-2 duration-200 cursor-pointer transition focus:outline-none',
                  category === cat.code
                    ? 'bg-light-secondary dark:bg-dark-secondary'
                    : 'hover:bg-light-secondary dark:hover:bg-dark-secondary',
                )}
              >
                <div
                  className={cn(
                    'flex flex-col items-center space-y-1',
                    category === cat.code
                      ? 'text-primary'
                      : 'text-black dark:text-white',
                  )}
                >
                  <cat.icon size={20} />
                  <p className="text-sm font-medium">{cat.name}</p>
                </div>
              </PopoverButton>
            ))}
          </div>
        </PopoverPanel>
      </Transition>
    </Popover>
  );
};

export default Category;
