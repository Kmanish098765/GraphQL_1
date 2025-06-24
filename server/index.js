const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
require('dotenv').config();

const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { connectToDatabase } = require('./database');

async function startServer() {
  const app = express();
  
  // Enable CORS
  app.use(cors());
  
  // Connect to MSSQL database
  await connectToDatabase();
  
  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      // Add any context you need here
      user: req.user,
    }),
  });
  
  // Start the server
  await server.start();
  
  // Apply the Apollo GraphQL middleware
  server.applyMiddleware({ app, path: '/graphql' });
  
  const PORT = process.env.PORT || 4000;
  
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`📊 GraphQL Playground available at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch(error => {
  console.error('Error starting server:', error);
  process.exit(1);
}); 