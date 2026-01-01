/**
 * MetaMask Ethereum JSON-RPC API Backend Server
 *
 * This server provides a REST API wrapper around Ethereum JSON-RPC methods.
 * It can connect to any Ethereum node (Infura, Alchemy, local node, etc.)
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import jsonrpcRoutes from './jsonrpc.js';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: { code: 429, message: 'Too many requests' } }
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '1mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// ============================================
// API DOCUMENTATION
// ============================================

try {
  const swaggerDocument = YAML.load(path.join(__dirname, '../openapi.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'MetaMask Ethereum API'
  }));
} catch (error) {
  console.warn('OpenAPI spec not found, skipping Swagger UI');
}

// ============================================
// API ROUTES
// ============================================

const API_PREFIX = '/api/v1';

// Generic JSON-RPC endpoint
app.use(`${API_PREFIX}`, jsonrpcRoutes);

// Note: Individual route handlers (wallet, accounts, etc.) can be added later
// For now, all methods are accessible through the generic JSON-RPC endpoint

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    nodeUrl: process.env.ETH_NODE_URL ? 'configured' : 'not configured'
  });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: -32601,
      message: 'Method not found',
      data: { path: req.path }
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle JSON-RPC style errors
  if (err.code) {
    return res.status(400).json({
      error: {
        code: err.code,
        message: err.message,
        data: err.data
      }
    });
  }
  
  res.status(500).json({
    error: {
      code: -32603,
      message: 'Internal error',
      data: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  });
});

// ============================================
// SERVER START
// ============================================

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║     MetaMask Ethereum JSON-RPC API Server                ║
╠══════════════════════════════════════════════════════════╣
║  Server running on: http://localhost:${PORT}                ║
║  API Documentation: http://localhost:${PORT}/api-docs       ║
║  Health Check:      http://localhost:${PORT}/health         ║
╚══════════════════════════════════════════════════════════╝
  `);
  
  if (!process.env.ETH_NODE_URL) {
    console.warn('⚠️  Warning: ETH_NODE_URL not set. Using default public endpoint.');
  }
});

export default app;
