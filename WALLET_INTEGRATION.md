# Ethereum Wallet Integration with AI Chatbot

This document explains how the Ethereum wallet integration works with the AI chatbot, allowing users to interact with their wallet through natural language.

## Overview

When users sign in with MetaMask using SIWE (Sign-In with Ethereum), their wallet address is stored in the database and made available to the AI chatbot. The chatbot can then use specialized Ethereum tools to:

- Check wallet balances
- View transaction history
- Estimate gas costs
- Query blockchain data
- Interact with the user's specific wallet

## Architecture

### 1. Authentication Flow

**File**: `src/components/auth/siwe-signin.tsx`

When a user signs in with MetaMask:
1. MetaMask is detected via `window.ethereum`
2. User's wallet address and chain ID are retrieved
3. A SIWE message is created and signed by the user
4. Better-auth verifies the signature and creates a session
5. Wallet address is stored in the `walletAddress` table linked to the user

### 2. Database Schema

**File**: `src/lib/db/schema.ts`

The `walletAddresses` table stores user wallet information:
```typescript
export const walletAddresses = sqliteTable("walletAddress", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id),
  address: text("address").notNull(),
  chainId: integer("chainId").notNull(),
  isPrimary: integer("isPrimary", { mode: "boolean" }).default(false),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
}, (table) => ({
  // Composite unique constraint: same address can exist on different chains
  addressChainUnique: uniqueIndex("walletAddress_address_chainId_unique")
    .on(table.address, table.chainId),
}));
```

**Key Features**:
- Supports multiple wallet addresses per user
- Composite unique constraint on `(address, chainId)` allows the same address on different chains
- Primary wallet designation for default operations

### 3. Wallet-Aware AI Tools

**File**: `src/lib/ethereum-api/server-tools.ts`

Server-side tools that interact with the blockchain using the user's wallet context:

#### Available Tools:

1. **getMyWalletBalance**: Get the ETH balance of the connected wallet
2. **getMyTransactionCount**: Get the number of transactions sent (nonce)
3. **getMyChainInfo**: Get current network information
4. **getCurrentGasPrice**: Get current gas price in Gwei
5. **getAddressBalance**: Check any Ethereum address balance
6. **getTransaction**: Get transaction details by hash
7. **getTransactionReceipt**: Check transaction status and receipt
8. **getMyWalletSummary**: Complete wallet overview

These tools use `viem` to interact with Ethereum nodes via public RPC endpoints.

### 4. LangChain Integration

**File**: `src/lib/research/search/index.ts`

The search handlers are created dynamically with wallet context:

```typescript
export function createSearchHandlers(
  walletContext?: { address: string; chainId: number }
): Record<string, MetaSearchAgent>
```

When a user is authenticated and using the "Ethereum Wallet" focus mode:
- Their wallet address is retrieved from the database
- Wallet-aware tools are created with their specific context
- These tools are combined with generic Ethereum tools
- The AI prompt is enhanced with wallet information

### 5. Chat API Integration

**File**: `src/app/api/chat/route.ts`

The chat API automatically detects when:
1. A user is authenticated
2. The focus mode is "ethereumWallet"

It then:
- Fetches the user's wallet addresses from the database
- Selects the primary wallet (or first wallet)
- Creates wallet-aware search handlers
- Passes the wallet context to the AI agent

```typescript
// Get user's wallet info if authenticated and in ethereumWallet mode
let walletContext: { address: string; chainId: number } | undefined;
if (userId && body.focusMode === 'ethereumWallet') {
  const userWallets = await db.query.walletAddresses.findMany({
    where: eq(walletAddresses.userId, userId),
  });

  if (userWallets && userWallets.length > 0) {
    const primaryWallet = userWallets.find(w => w.isPrimary) || userWallets[0];
    walletContext = {
      address: primaryWallet.address,
      chainId: primaryWallet.chainId,
    };
  }
}

const handlers = walletContext ? createSearchHandlers(walletContext) : searchHandlers;
```

### 6. UI Components

#### Wallet Info Display

**File**: `src/components/wallet/WalletInfo.tsx`

Displays after successful SIWE login:
- Primary wallet address
- Connected network
- All connected wallets
- Quick links to Etherscan
- Instructions on how to use the wallet features

#### Chat Homepage Integration

**File**: `src/components/research/chat/ChatHomepage.tsx`

The homepage checks if a user has a wallet connected and displays the WalletInfo component.

### 7. API Endpoints

#### GET /api/wallet/info

**File**: `src/app/api/wallet/info/route.ts`

Returns the authenticated user's wallet information:
```json
{
  "address": "0x...",
  "chainId": 1,
  "wallets": [
    {
      "address": "0x...",
      "chainId": 1,
      "isPrimary": true
    }
  ]
}
```

## Usage Examples

### For Users

After signing in with MetaMask:

1. Select "Ethereum Wallet" focus mode in the chat
2. Ask natural language questions like:
   - "What's my wallet balance?"
   - "Show me my wallet summary"
   - "What's the current gas price?"
   - "Check the balance of 0x..."
   - "Get transaction 0x..."

### For Developers

#### Adding New Wallet Tools

1. Create a new tool in `src/lib/ethereum-api/server-tools.ts`:

```typescript
tools.push(
  new DynamicStructuredTool({
    name: 'myCustomTool',
    description: 'Description of what it does',
    schema: z.object({
      // Define parameters
    }),
    func: async (params) => {
      // Use walletContext.address and walletContext.chainId
      // Interact with blockchain using viem
      return result;
    },
  })
);
```

2. The tool will automatically be available to the AI when in Ethereum Wallet mode

## Security Considerations

1. **Read-Only by Default**: The server-side tools only perform read operations. They cannot sign transactions or access private keys.

2. **User Context Isolation**: Each user only has access to their own wallet information.

3. **RPC Endpoints**: Currently using public RPC endpoints. For production:
   - Use dedicated RPC providers (Infura, Alchemy, etc.)
   - Implement rate limiting
   - Add caching for frequently accessed data

4. **No Private Key Storage**: Private keys are never stored or transmitted. MetaMask handles all signing operations.

## Environment Variables

Add these to your `.env` file for custom RPC endpoints:

```bash
ETHEREUM_RPC_URL=https://ethereum.publicnode.com
POLYGON_RPC_URL=https://polygon-rpc.com
OPTIMISM_RPC_URL=https://mainnet.optimism.io
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
```

## Future Enhancements

1. **Transaction Signing**: Allow users to sign transactions through the chat (requires frontend integration with MetaMask)
2. **Smart Contract Interactions**: Add tools for calling specific smart contract functions
3. **Token Balances**: Support for ERC-20, ERC-721, and ERC-1155 tokens
4. **DeFi Integrations**: Tools for interacting with DEXs, lending protocols, etc.
5. **Multi-Chain Support**: Enhanced support for L2s and other EVM chains
6. **Portfolio Tracking**: Aggregate wallet value across multiple chains and tokens

## Troubleshooting

### Wallet Not Showing

- Ensure the user is authenticated
- Check that the wallet address was stored in the database during SIWE login
- Verify the `/api/wallet/info` endpoint returns data

### Tools Not Working

- Check that the RPC endpoints are accessible
- Verify the chain ID is supported
- Check console logs for error messages

### Database Issues

- Run the migrations to ensure the `walletAddress` table exists
- Verify the composite unique index is created correctly
- Check that user IDs match between `user` and `walletAddress` tables

## Related Files

- Authentication: `src/lib/auth.ts`, `src/components/auth/siwe-signin.tsx`
- Database: `src/lib/db/schema.ts`, `drizzle/0008_elite_red_hulk.sql`
- Tools: `src/lib/ethereum-api/server-tools.ts`, `src/lib/ethereum-api/langchain-tools.ts`
- Chat: `src/app/api/chat/route.ts`, `src/lib/research/search/index.ts`
- UI: `src/components/wallet/WalletInfo.tsx`, `src/components/research/chat/ChatHomepage.tsx`
