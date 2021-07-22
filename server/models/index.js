const mongoose = require("mongoose");

const db = {};

/* istanbul ignore next */
db.connect = (HOST, PORT, DATABASE) => {
  return mongoose.connect(`mongodb://${HOST}:${PORT}/${DATABASE}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

/* istanbul ignore next */
db.disconnect = () => {
  mongoose.disconnect();
};

db.User = require("./user");
db.Tweet = require("./tweet");

module.exports = db;
