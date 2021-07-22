const express = require("express");
const db = require("./models");
const app = express();
const { setupExpressWs } = require("./controllers/webchat");
const expressWs = require("express-ws")(app);
require("dotenv").config();

/* istanbul ignore next */
const dbStart = () => {
  db.connect(process.env.DB_HOST, process.env.DB_PORT, process.env.DB_NAME)
    .catch((err) => {
      console.error("Error connecting to the database.");
      process.exit();
    })
    .then(() => {
      console.log("Successfully connected to the database.");

      // add gracefulness on closing app
      process.on("SIGTERM", () => {
        console.log("Disconnecting database...");
        db.disconnect();
      });
    });
};

/* istanbul ignore next */
if (!process.env.TESTING) {
  dbStart();
}

// for reference
setupExpressWs(expressWs);

// add middleware and routes after connecting to the db
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(require("morgan")("combined"));

app.use("/", require("./routes"));

module.exports = app;
