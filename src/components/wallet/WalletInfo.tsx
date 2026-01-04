'use client';

import { useEffect, useState } from 'react';
import { Wallet, Link as LinkIcon, ChevronDown, ChevronUp } from 'lucide-react';

interface WalletData {
  address: string;
  chainId: number;
  wallets: Array<{
    address: string;
    chainId: number;
    isPrimary: boolean;
  }>;
}

const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum Mainnet',
  137: 'Polygon',
  10: 'Optimism',
  42161: 'Arbitrum One',
  8453: 'Base',
  5: 'Goerli Testnet',
  11155111: 'Sepolia Testnet',
};

export function WalletInfo() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchWalletInfo();
  }, []);

  const fetchWalletInfo = async () => {
    try {
      const response = await fetch('/api/wallet/info');
      if (response.ok) {
        const data = await response.json();
        setWalletData(data);
      }
    } catch (error) {
      console.error('Failed to fetch wallet info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !walletData) {
    return null;
  }

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
        style={{ minWidth: '280px', maxWidth: '320px' }}
      >
        {/* Header - Always visible, clickable to expand/collapse */}
        <div
          className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 rounded-t-lg transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-500/10 rounded-full">
              <Wallet className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <div className="text-sm font-semibold">Connected Wallet</div>
              <div className="text-xs text-muted-foreground">
                {CHAIN_NAMES[walletData.chainId] || `Chain ${walletData.chainId}`}
              </div>
            </div>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        {/* Expandable content */}
        {isExpanded && (
          <div className="border-t border-border p-3 space-y-3">
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Primary Address
              </div>
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono bg-muted px-2 py-1 rounded flex-1">
                  {shortenAddress(walletData.address)}
                </code>
                <a
                  href={`https://etherscan.io/address/${walletData.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {walletData.wallets.length > 1 && (
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  All Wallets ({walletData.wallets.length})
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {walletData.wallets.map((wallet, index) => (
                    <div
                      key={index}
                      className="text-xs flex items-center justify-between bg-muted/50 px-2 py-1 rounded"
                    >
                      <code className="font-mono">{shortenAddress(wallet.address)}</code>
                      <span className="text-[10px] text-muted-foreground ml-2">
                        {wallet.isPrimary && '★'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
