const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers');
const { getUserFromToken } = require('./utils/auth');

dotenv.config();

const startServer = async () => {
  const app = express();
  app.use(cors());

  // Connect to MongoDB
  try {
    await mongoose.connect('=mongodb+srv://24aaryan00:XE1lgXbpxaEs3elB@cluster0.qsbsm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      // Get the user token from the headers
      const token = req.headers.authorization || '';
      // Try to retrieve a user with the token
      const user = await getUserFromToken(token);
      // Add the user to the context
      return { user };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer();
