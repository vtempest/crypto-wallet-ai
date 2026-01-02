import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

const CopilotToggle = ({
  copilotEnabled,
  setCopilotEnabled,
}: {
  copilotEnabled: boolean;
  setCopilotEnabled: (enabled: boolean) => void;
}) => {
  return (
    <div className="group flex flex-row items-center space-x-1 active:scale-95 duration-200 transition cursor-pointer">
      <Switch
        checked={copilotEnabled}
        onCheckedChange={setCopilotEnabled}
        className="h-5 w-10 sm:h-6 sm:w-11"
      />
      <p
        onClick={() => setCopilotEnabled(!copilotEnabled)}
        className={cn(
          'text-xs font-medium transition-colors duration-150 ease-in-out',
          copilotEnabled
            ? 'text-primary'
            : 'text-black/50 dark:text-white/50 group-hover:text-black dark:group-hover:text-white',
        )}
      >
        Copilot
      </p>
    </div>
  );
};

export default CopilotToggle;
