const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
require('dotenv').config();

const typeDefs = require('./schema');
const resolvers = require('./resolvers-hybrid'); // Using the hybrid resolvers
const { connectToDatabase } = require('./database'); // Keep your existing working connection
const { connectHybridPrisma } = require('./hybrid-prisma'); // Add hybrid Prisma functionality

async function startServer() {
  const app = express();
  
  // Enable CORS
  app.use(cors());
  
  // Connect to MSSQL database (your existing WORKING connection)
  console.log('🔗 Connecting to your existing MSSQL database...');
  await connectToDatabase();
  
  // Initialize hybrid Prisma (uses your existing connection)
  console.log('🔗 Initializing Hybrid Prisma Client...');
  await connectHybridPrisma();
  
  // Create Apollo Server with hybrid resolvers
  const server = new ApolloServer({
    typeDefs,
    resolvers, // Now using hybrid resolvers that work with your database
    context: ({ req }) => ({
      // Add any context you need here
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
    console.log(`✅ Using Hybrid Prisma Client with your working database connection`);
    console.log(`✅ Your database: Tier1Feature26 on 18.219.203.64:56321`);
    console.log(`✅ All your database connection details are preserved and working!`);
  });
  
  // Graceful shutdown
  const gracefulShutdown = async (signal) => {
    console.log(`\n🔄 Received ${signal}. Starting graceful shutdown...`);
    
    try {
      await server.stop();
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