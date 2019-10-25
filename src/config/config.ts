export default {
    // Secret key for JWT signing and encryption
    'secret': process.env.secret,
    // Database connection information
    'database': process.env.database,
    // Setting port for server
    'port': process.env.serverPort || 3000
  };