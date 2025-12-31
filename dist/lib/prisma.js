"use strict";
// src/lib/prisma.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.testConnection = testConnection;
exports.disconnect = disconnect;
exports.healthCheck = healthCheck;
const client_1 = require("../generated/prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices
const globalForPrisma = global;
exports.prisma = globalForPrisma.prisma ||
    new client_1.PrismaClient({
        log: process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'warn']
            : ['error'],
    });
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = exports.prisma;
}
// Graceful shutdown
process.on('SIGINT', async () => {
    await exports.prisma.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    await exports.prisma.$disconnect();
    process.exit(0);
});
exports.default = exports.prisma;
// ==========================================
// HELPER FUNCTIONS
// ==========================================
/**
 * Test database connection
 */
async function testConnection() {
    try {
        await exports.prisma.$connect();
        console.log('✅ Database connected successfully');
        return true;
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
}
/**
 * Disconnect from database
 */
async function disconnect() {
    await exports.prisma.$disconnect();
    console.log('Database disconnected');
}
/**
 * Health check for database
 */
async function healthCheck() {
    try {
        await exports.prisma.$queryRaw `SELECT 1`;
        return { status: 'healthy', timestamp: new Date() };
    }
    catch (error) {
        return { status: 'unhealthy', error: error.message, timestamp: new Date() };
    }
}
