export default {
  // Database connection information
  database: process.env.database,
  // Setting port for server
  port: process.env.serverPort || 3000,
  // Secret key for JWT signing and encryption
  secret: process.env.secret
};
