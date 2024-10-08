const WebSocket = require('ws');
const response = require('../utils/responseUtil');
const logger = require('../lib/log')('broadcastWS');
const ResourceService = require('../service/resourceService');
const { connSet } = require('../webSocket/subscriber');

function broadcastToAllClients(data) {
    const message = JSON.stringify(data); // Stringify the message before sending

    connSet.forEach((clientWs) => {
        if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(message); // Send the message to each connected client
        }
    });
}

async function sendAllResources() {
    try {
        const allResources = await ResourceService.getAllResources();

        // Broadcast all resources to all connected WebSocket clients
        broadcastToAllClients({
            message: 'All resources',
            data: allResources.data,
        });
    } catch (err) {
        logger.log(err);
    }
}

module.exports = async (ctx) => {
    try {
        sendAllResources();
        ctx.body = response.success('brodecast success!');
    } catch (err) {
        logger.error('addResource failed: ', err);
        ctx.body = response.operationFail('addResource failed');
    }
};
