const sql = require('mssql');

// Database configuration
const config = {
  user: process.env.DB_USER || 'web',
  password: process.env.DB_PASSWORD || 'Mir@b202L-sqlw@b',
  server: process.env.DB_SERVER || '18.219.203.64',
  port: process.env.DB_PORT || 56321,
  database: process.env.DB_NAME || 'Tier1Feature26',
  options: {
    encrypt: true, // Use this if you're on Windows Azure
    trustServerCertificate: true, // Use this if you're using self-signed certificates
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let poolPromise;

async function connectToDatabase() {
  try {
    if (!poolPromise) {
      poolPromise = new sql.ConnectionPool(config).connect();
    }
    await poolPromise;
    console.log('✅ Connected to MSSQL database');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

function getPool() {
  return poolPromise;
}

module.exports = {
  sql,
  connectToDatabase,
  getPool,
}; 