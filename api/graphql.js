// api/graphql.js
const { ApolloServer } = require('apollo-server-micro');
const mongoose = require('mongoose');
const typeDefs = require('../src/schema/typeDefs');
const resolvers = require('../src/resolvers');
const { getUserFromToken } = require('../src/utils/auth');
require('dotenv').config();

// Function to connect to MongoDB
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected');
    } catch (err) {
      console.error('MongoDB connection error:', err);
      throw err;
    }
  }
};

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    await connectToDatabase();
    const token = req.headers.authorization || '';
    const user = await getUserFromToken(token);
    return { user };
  },
});

// Start the server
const startServer = server.start();

// Export the handler
module.exports = async (req, res) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*'); // Change '*' to your frontend URL in production
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.status(200).end();
    return false;
  }

  // Set CORS headers for actual requests
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*'); // Change '*' to your frontend URL in production

  await startServer;
  await server.createHandler({
    path: '/api/graphql',
  })(req, res);
};

// Disable body parsing, as Apollo Server Micro handles it
module.exports.config = {
  api: {
    bodyParser: false,
  },
};
