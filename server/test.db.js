const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

const mongod = new MongoMemoryServer();

/**
 * Connect to Testing Database
 */
const connect = async () => {
  if (mongoose.connection) {
    await mongoose.disconnect();
  }
  const uri = await mongod.getUri();
  await mongoose.connect(uri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

/**
 * Disconnect from Testing Database
 */
const disconnect = async () => {
  await mongoose.connection.close();
  await mongod.stop();
};

/**
 * Clear Testing Database
 */
const clear = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

module.exports = {
  connect,
  disconnect,
  clear,
};
