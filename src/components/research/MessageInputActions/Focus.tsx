import { Wallet } from 'lucide-react';

const Focus = () => {
  // Focus mode is now always ethereumWallet - this component just shows the wallet icon
  return (
    <div className="p-2 rounded-lg text-black/70 dark:text-white/70">
      <Wallet size={16} />
    </div>
  );
};

export default Focus;
