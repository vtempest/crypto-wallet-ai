import { ChevronDown, Sliders, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from '@headlessui/react';
import { Fragment } from 'react';
import { useChat } from '@/lib/hooks/useChat';

const OptimizationModes = [
  {
    key: 'speed',
    title: 'Speed',
    description: 'Prioritize speed and get the quickest possible answer.',
    icon: <Zap size={16} className="text-chart-1" />,
  },
  {
    key: 'balanced',
    title: 'Balanced',
    description: 'Find the right balance between speed and accuracy',
    icon: <Sliders size={16} className="text-chart-2" />,
  },
  {
    key: 'quality',
    title: 'Quality (Soon)',
    description: 'Get the most thorough and accurate answer',
    icon: (
      <Star
        size={16}
        className="text-chart-3 fill-chart-3"
      />
    ),
  },
];

const Optimization = () => {
  const { optimizationMode, setOptimizationMode } = useChat();

  return (
    <Popover className="relative w-full max-w-[15rem] md:max-w-md lg:max-w-lg">
      {({ open }) => (
        <>
          <PopoverButton
            type="button"
            className="p-2 text-muted-foreground rounded-xl hover:bg-secondary active:scale-95 transition duration-200 hover:text-foreground focus:outline-none"
          >
            <div className="flex flex-row items-center space-x-1">
              {
                OptimizationModes.find((mode) => mode.key === optimizationMode)
                  ?.icon
              }
              <ChevronDown
                size={16}
                className={cn(
                  open ? 'rotate-180' : 'rotate-0',
                  'transition duration:200',
                )}
              />
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
            <PopoverPanel className="absolute z-10 w-64 md:w-[250px] left-0">
              <div className="flex flex-col gap-2 bg-popover border rounded-lg border-border w-full p-4 max-h-[200px] md:max-h-none overflow-y-auto">
                {OptimizationModes.map((mode, i) => (
                  <PopoverButton
                    onClick={() => setOptimizationMode(mode.key)}
                    key={i}
                    disabled={mode.key === 'quality'}
                    className={cn(
                      'p-2 rounded-lg flex flex-col items-start justify-start text-start space-y-1 duration-200 cursor-pointer transition focus:outline-none',
                      optimizationMode === mode.key
                        ? 'bg-secondary'
                        : 'hover:bg-secondary',
                      mode.key === 'quality' && 'opacity-50 cursor-not-allowed',
                    )}
                  >
                    <div className="flex flex-row items-center space-x-1 text-popover-foreground">
                      {mode.icon}
                      <p className="text-sm font-medium">{mode.title}</p>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {mode.description}
                    </p>
                  </PopoverButton>
                ))}
              </div>
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default Optimization;
