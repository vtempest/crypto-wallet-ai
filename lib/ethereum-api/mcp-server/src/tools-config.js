// Tool configurations extracted from OpenAPI spec
// Generated: 2026-01-01T20:46:53.464Z

export const toolConfigs = [
  {
    "name": "walletAddEthereumChain",
    "description": "Add Ethereum Chain",
    "method": "post",
    "pathTemplate": "/wallet/addEthereumChain",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "walletSwitchEthereumChain",
    "description": "Switch Ethereum Chain",
    "method": "post",
    "pathTemplate": "/wallet/switchEthereumChain",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "walletWatchAsset",
    "description": "Watch Asset",
    "method": "post",
    "pathTemplate": "/wallet/watchAsset",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "walletRequestPermissions",
    "description": "Request Permissions",
    "method": "post",
    "pathTemplate": "/wallet/requestPermissions",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "walletGetPermissions",
    "description": "Get Permissions",
    "method": "get",
    "pathTemplate": "/wallet/getPermissions",
    "executionParameters": [],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "walletRevokePermissions",
    "description": "Revoke Permissions",
    "method": "post",
    "pathTemplate": "/wallet/revokePermissions",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "walletSendCalls",
    "description": "Send Batched Calls",
    "method": "post",
    "pathTemplate": "/wallet/sendCalls",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "walletGetCallsStatus",
    "description": "Get Calls Status",
    "method": "post",
    "pathTemplate": "/wallet/getCallsStatus",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "walletGetCapabilities",
    "description": "Get Wallet Capabilities",
    "method": "get",
    "pathTemplate": "/wallet/getCapabilities",
    "executionParameters": [],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethRequestAccounts",
    "description": "Request Accounts",
    "method": "post",
    "pathTemplate": "/eth/requestAccounts",
    "executionParameters": [],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethAccounts",
    "description": "Get Accounts",
    "method": "get",
    "pathTemplate": "/eth/accounts",
    "executionParameters": [],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethSendTransaction",
    "description": "Send Transaction",
    "method": "post",
    "pathTemplate": "/eth/sendTransaction",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethSendRawTransaction",
    "description": "Send Raw Transaction",
    "method": "post",
    "pathTemplate": "/eth/sendRawTransaction",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethGetTransactionByHash",
    "description": "Get Transaction by Hash",
    "method": "get",
    "pathTemplate": "/eth/getTransactionByHash",
    "executionParameters": [
      {
        "name": "hash",
        "in": "query"
      }
    ],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethGetTransactionReceipt",
    "description": "Get Transaction Receipt",
    "method": "get",
    "pathTemplate": "/eth/getTransactionReceipt",
    "executionParameters": [
      {
        "name": "hash",
        "in": "query"
      }
    ],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethGetTransactionCount",
    "description": "Get Transaction Count",
    "method": "get",
    "pathTemplate": "/eth/getTransactionCount",
    "executionParameters": [
      {
        "name": "address",
        "in": "query"
      },
      {
        "name": "block",
        "in": "query"
      }
    ],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethEstimateGas",
    "description": "Estimate Gas",
    "method": "post",
    "pathTemplate": "/eth/estimateGas",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "personalSign",
    "description": "Personal Sign",
    "method": "post",
    "pathTemplate": "/eth/personalSign",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethSignTypedDataV4",
    "description": "Sign Typed Data V4",
    "method": "post",
    "pathTemplate": "/eth/signTypedDataV4",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethDecrypt",
    "description": "Decrypt (Deprecated)",
    "method": "post",
    "pathTemplate": "/eth/decrypt",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethGetEncryptionPublicKey",
    "description": "Get Encryption Public Key (Deprecated)",
    "method": "post",
    "pathTemplate": "/eth/getEncryptionPublicKey",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethChainId",
    "description": "Get Chain ID",
    "method": "get",
    "pathTemplate": "/eth/chainId",
    "executionParameters": [],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethBlockNumber",
    "description": "Get Block Number",
    "method": "get",
    "pathTemplate": "/eth/blockNumber",
    "executionParameters": [],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethSyncing",
    "description": "Get Syncing Status",
    "method": "get",
    "pathTemplate": "/eth/syncing",
    "executionParameters": [],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethCoinbase",
    "description": "Get Coinbase",
    "method": "get",
    "pathTemplate": "/eth/coinbase",
    "executionParameters": [],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethGasPrice",
    "description": "Get Gas Price",
    "method": "get",
    "pathTemplate": "/eth/gasPrice",
    "executionParameters": [],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethFeeHistory",
    "description": "Get Fee History",
    "method": "get",
    "pathTemplate": "/eth/feeHistory",
    "executionParameters": [
      {
        "name": "blockCount",
        "in": "query"
      },
      {
        "name": "newestBlock",
        "in": "query"
      },
      {
        "name": "rewardPercentiles",
        "in": "query"
      }
    ],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethGetBlockByHash",
    "description": "Get Block by Hash",
    "method": "get",
    "pathTemplate": "/eth/getBlockByHash",
    "executionParameters": [
      {
        "name": "hash",
        "in": "query"
      },
      {
        "name": "fullTransactions",
        "in": "query"
      }
    ],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethGetBlockByNumber",
    "description": "Get Block by Number",
    "method": "get",
    "pathTemplate": "/eth/getBlockByNumber",
    "executionParameters": [
      {
        "name": "blockNumber",
        "in": "query"
      },
      {
        "name": "fullTransactions",
        "in": "query"
      }
    ],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethGetBlockTransactionCountByHash",
    "description": "Get Block Transaction Count by Hash",
    "method": "get",
    "pathTemplate": "/eth/getBlockTransactionCountByHash",
    "executionParameters": [
      {
        "name": "hash",
        "in": "query"
      }
    ],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethGetBlockTransactionCountByNumber",
    "description": "Get Block Transaction Count by Number",
    "method": "get",
    "pathTemplate": "/eth/getBlockTransactionCountByNumber",
    "executionParameters": [
      {
        "name": "blockNumber",
        "in": "query"
      }
    ],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethGetUncleCountByBlockHash",
    "description": "Get Uncle Count by Block Hash",
    "method": "get",
    "pathTemplate": "/eth/getUncleCountByBlockHash",
    "executionParameters": [
      {
        "name": "hash",
        "in": "query"
      }
    ],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethGetUncleCountByBlockNumber",
    "description": "Get Uncle Count by Block Number",
    "method": "get",
    "pathTemplate": "/eth/getUncleCountByBlockNumber",
    "executionParameters": [
      {
        "name": "blockNumber",
        "in": "query"
      }
    ],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethGetBalance",
    "description": "Get Balance",
    "method": "get",
    "pathTemplate": "/eth/getBalance",
    "executionParameters": [
      {
        "name": "address",
        "in": "query"
      },
      {
        "name": "block",
        "in": "query"
      }
    ],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethGetStorageAt",
    "description": "Get Storage At",
    "method": "get",
    "pathTemplate": "/eth/getStorageAt",
    "executionParameters": [
      {
        "name": "address",
        "in": "query"
      },
      {
        "name": "position",
        "in": "query"
      },
      {
        "name": "block",
        "in": "query"
      }
    ],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethGetCode",
    "description": "Get Code",
    "method": "get",
    "pathTemplate": "/eth/getCode",
    "executionParameters": [
      {
        "name": "address",
        "in": "query"
      },
      {
        "name": "block",
        "in": "query"
      }
    ],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethGetProof",
    "description": "Get Proof",
    "method": "get",
    "pathTemplate": "/eth/getProof",
    "executionParameters": [
      {
        "name": "address",
        "in": "query"
      },
      {
        "name": "storageKeys",
        "in": "query"
      },
      {
        "name": "block",
        "in": "query"
      }
    ],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethCall",
    "description": "Call",
    "method": "post",
    "pathTemplate": "/eth/call",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethGetLogs",
    "description": "Get Logs",
    "method": "post",
    "pathTemplate": "/eth/getLogs",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethNewFilter",
    "description": "New Filter",
    "method": "post",
    "pathTemplate": "/eth/newFilter",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethNewBlockFilter",
    "description": "New Block Filter",
    "method": "post",
    "pathTemplate": "/eth/newBlockFilter",
    "executionParameters": [],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethNewPendingTransactionFilter",
    "description": "New Pending Transaction Filter",
    "method": "post",
    "pathTemplate": "/eth/newPendingTransactionFilter",
    "executionParameters": [],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethGetFilterChanges",
    "description": "Get Filter Changes",
    "method": "get",
    "pathTemplate": "/eth/getFilterChanges",
    "executionParameters": [
      {
        "name": "filterId",
        "in": "query"
      }
    ],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethGetFilterLogs",
    "description": "Get Filter Logs",
    "method": "get",
    "pathTemplate": "/eth/getFilterLogs",
    "executionParameters": [
      {
        "name": "filterId",
        "in": "query"
      }
    ],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethUninstallFilter",
    "description": "Uninstall Filter",
    "method": "delete",
    "pathTemplate": "/eth/uninstallFilter",
    "executionParameters": [
      {
        "name": "filterId",
        "in": "query"
      }
    ],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethSubscribe",
    "description": "Subscribe",
    "method": "post",
    "pathTemplate": "/eth/subscribe",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "ethUnsubscribe",
    "description": "Unsubscribe",
    "method": "post",
    "pathTemplate": "/eth/unsubscribe",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "web3ClientVersion",
    "description": "Get Client Version",
    "method": "get",
    "pathTemplate": "/web3/clientVersion",
    "executionParameters": [],
    "baseUrl": "http://localhost:3000/api/v1"
  },
  {
    "name": "jsonRpc",
    "description": "Generic JSON-RPC",
    "method": "post",
    "pathTemplate": "/jsonrpc",
    "executionParameters": [],
    "requestBodyContentType": "application/json",
    "baseUrl": "http://localhost:3000/api/v1"
  }
];

// Create a map for quick lookup
export const toolConfigMap = new Map(toolConfigs.map(t => [t.name, t]));
