'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Link as LinkIcon } from 'lucide-react';

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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Loading Wallet...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!walletData) {
    return null;
  }

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connected Wallet
        </CardTitle>
        <CardDescription>
          Your Ethereum wallet is connected to the AI assistant
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm font-medium text-muted-foreground mb-1">
            Primary Wallet Address
          </div>
          <div className="flex items-center gap-2">
            <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
              {shortenAddress(walletData.address)}
            </code>
            <a
              href={`https://etherscan.io/address/${walletData.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              <LinkIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-muted-foreground mb-1">
            Network
          </div>
          <div className="text-sm">
            {CHAIN_NAMES[walletData.chainId] || `Chain ID ${walletData.chainId}`}
          </div>
        </div>

        {walletData.wallets.length > 1 && (
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-2">
              All Connected Wallets ({walletData.wallets.length})
            </div>
            <div className="space-y-1">
              {walletData.wallets.map((wallet, index) => (
                <div
                  key={index}
                  className="text-sm flex items-center justify-between bg-muted/50 px-2 py-1 rounded"
                >
                  <code className="font-mono">{shortenAddress(wallet.address)}</code>
                  <span className="text-xs text-muted-foreground">
                    {CHAIN_NAMES[wallet.chainId] || `Chain ${wallet.chainId}`}
                    {wallet.isPrimary && ' (Primary)'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
