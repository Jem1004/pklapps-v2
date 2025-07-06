// Re-export the optimized prisma client from database config
export { prisma, checkDatabaseHealth, getDatabaseInfo, withQueryTiming, batchOperations, databaseCleanup } from '@/lib/database/config'
export { prisma as default } from '@/lib/database/config'