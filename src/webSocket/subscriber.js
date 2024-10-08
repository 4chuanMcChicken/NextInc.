const WebSocket = require('ws');
const logger = require('../lib/log')('subscriber');
const response = require('../utils/responseUtil');

const socketServer = new WebSocket.WebSocketServer({ noServer: true });

// Use this set to store all the connected WebSocket
const connSet = new Set();

socketServer.on('connection', (clientWs, request) => {
    try {
        logger.debug('WebSocket server connection request incoming');

        // Handle incoming message from the client
        clientWs.on('message', (message) => {
            const messageString = message.toString('utf-8');
            const messageObject = JSON.parse(messageString);
            console.log(messageObject);
        });

        console.log('A new connection has established!');
        logger.info('A new connection has established!');

        // Handle WebSocket connection close event
        clientWs.on('close', () => {
            logger.debug('WebSocket connection closed');
        });

        // Send connection success response to the client
        const responseData = response.success('connection success', {});

        // Store the WebSocket connection in the map with accountId as the key

        connSet.add(clientWs);

        clientWs.send(JSON.stringify(responseData));
    } catch (err) {
        logger.error(`WebSocket connection failed: ${err}`);
    }
});

module.exports = {
    socketServer,
    connSet,

};
