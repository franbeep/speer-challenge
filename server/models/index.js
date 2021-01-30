const mongoose = require("mongoose");

const db = {};

db.connect = (HOST, PORT, DATABASE) => {
  return mongoose.connect(`mongodb://${HOST}:${PORT}/${DATABASE}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

db.disconnect = () => {
  mongoose.disconnect();
};

db.User = require("./user");

module.exports = db;
