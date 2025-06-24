const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
require('dotenv').config();

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

// Initialize Prisma Client
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function startServer() {
  const app = express();
  
  // Enable CORS
  app.use(cors());
  
  // Connect to database via Prisma
  console.log('🔗 Connecting to Prisma Client...');
  await prisma.$connect();
  console.log('✅ Connected to MSSQL database via Prisma');
  console.log('✅ Using your database: Tier1Feature26 on 18.219.203.64:56321');
  
  // Create Apollo Server with Prisma resolvers
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      prisma,
      user: req.user,
    }),
    // Better error handling for development
    formatError: (err) => {
      console.error('GraphQL Error:', err);
      return {
        message: err.message,
        // In production, you might want to hide the stack trace
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      };
    },
  });
  
  // Start the server
  await server.start();
  
  // Apply the Apollo GraphQL middleware
  server.applyMiddleware({ 
    app, 
    path: '/graphql',
    cors: false // We're handling CORS above
  });
  
  const PORT = process.env.PORT || 4000;
  
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`📊 GraphQL Playground available at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`✅ Using Prisma Client for database operations`);
    console.log(`✅ Your existing database connection details are preserved`);
  });
  
  // Graceful shutdown
  const gracefulShutdown = async (signal) => {
    console.log(`\n🔄 Received ${signal}. Starting graceful shutdown...`);
    
    try {
      await server.stop();
      await prisma.$disconnect();
      console.log('✅ Server shut down successfully');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  };
  
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

startServer().catch(error => {
  console.error('❌ Error starting server:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}); 