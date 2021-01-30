let expressWs;

/**
 * Needed function because otherwise all logic would have to be on the root index file.
 * @param {expressWs} server
 */
const setupExpressWs = (server) => {
  expressWs = server;
};

/**
 * Receives a message and send to everyone connected.
 */
const handleConnections = (ws, req) => {
  ws.on("message", (data) => {
    expressWs.getWss("/ws").clients.forEach((client) => {
      client.send(data);
    });
  });
};

module.exports = { handleConnections, setupExpressWs };
