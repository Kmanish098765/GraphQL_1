const { PrismaClient } = require('@prisma/client');

// Create Prisma Client instance with your existing database connection details
// Using the exact same format as your working database.js connection
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "sqlserver://18.219.203.64:56321;database=Tier1Feature26;user=web;password=Mir@b202L-sqlw@b;encrypt=true;trustServerCertificate=true"
    }
  },
  log: ['query', 'info', 'warn', 'error'],
});

// Export both Prisma client and connection function
module.exports = {
  prisma,
  connectPrisma: async () => {
    try {
      await prisma.$connect();
      console.log('✅ Connected to MSSQL database via Prisma');
      console.log('✅ Using your database: Tier1Feature26 on 18.219.203.64:56321');
    } catch (error) {
      console.error('❌ Prisma database connection failed:', error);
      throw error;
    }
  },
  disconnectPrisma: async () => {
    await prisma.$disconnect();
  }
}; 