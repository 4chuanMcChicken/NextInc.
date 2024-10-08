
# WebSocket and RESTful API Server

This project is a WebSocket server capable of handling multiple connections and broadcasting messages, as well as a RESTful API server for managing resources.

## Getting Started

### Starting the Server

To start the server, run the following command:

```bash
npm run dev
```

### WebSocket Client

To establish a WebSocket connection to the server:

```bash
node webSocketClient/client.js
```

### Broadcast a Message

To broadcast a message, send a POST request to the following endpoint:

```bash
POST localhost:8082/broadcastWS
```

## API Documentation

The application provides the following RESTful APIs:

### 1. Get All Resources

Retrieve all resources.

- **URL**: `/resource`
- **Method**: `GET`
- **Example**:
  ```bash
  curl localhost:8082/resource
  ```

### 2. Get Resource by ID

Retrieve a specific resource by its ID.

- **URL**: `/resource`
- **Method**: `GET`
- **Query Parameters**:
  - `id` (string, required): The unique identifier of the resource.
- **Example**:
  ```bash
  curl localhost:8082/resource?id=1
  ```

### 3. Add New Resource

Create a new resource.

- **URL**: `/resource`
- **Method**: `POST`
- **Body Parameters**:
  - `content` (string, required): The content to be added.
- **Example**:
  ```bash
  curl -X POST localhost:8082/resource -H 'Content-Type: application/json' -d '{"content":"new resource"}'
  ```

### 4. Delete Resource by ID

Delete an existing resource by its ID.

- **URL**: `/resource`
- **Method**: `DELETE`
- **Body Parameters**:
  - `id` (string, required): The unique identifier of the resource to be deleted.
- **Example**:
  ```bash
  curl -X DELETE localhost:8082/resource -H 'Content-Type: application/json' -d '{"id":"2"}'
  ```

### 5. Broadcast WebSocket Message

Broadcast a message to all connected WebSocket clients.

- **URL**: `/broadcastWS`
- **Method**: `POST`
- **Example**:
  ```bash
  curl -X POST localhost:8082/broadcastWS
  ```

## How to Use

1. Start the server.
2. Establish a WebSocket connection using the WebSocket client.
3. Send HTTP requests to interact with the RESTful API.

