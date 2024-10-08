const WebSocket = require('ws');
const logger = require('../src/lib/log')('ValidateParamsMiddleware');

const ws = new WebSocket('ws://localhost:8082'); 

ws.on('open', () => {
  console.log('Connected to WebSocket server');
  ws.send(JSON.stringify({  message: 'Hello from client!' }));
});

ws.on('message', (data) => {
  const messageString = data.toString('utf-8'); 
  try {
    const messageObject = JSON.parse(messageString);
    console.log('Parsed message:', messageObject);
  } catch (err) {
    console.error('Failed to parse message as JSON:', err);
  }
});

ws.on('close', () => {
  console.log('WebSocket connection closed');
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});
