Thank you for considering my application.
=================================================================================
How to use:

Start the server:

npm run dev

establish a WS connect to the server:

node webSocketClient/client.js 

Do the message broadcase:
send a POST http request: localhost:8082/broadcastWS


=================================================================================
API explanation:

Here are totally 5 APIs

1. Get All Resources
Get All Resources
URL: /resource

Method: GET

Query Parameters: None

example:  localhost:8082/resource


2. Get Resource by ID
Retrieve a specific resource by its ID.

URL: /resource

Method: GET

Query Parameters:

id (string, required): The unique identifier of the resource.

example:  localhost:8082/resource?id=1


3. Add New Resource
Create a new resource.

URL: /resource

Method: POST

Body Parameters:

content (string, required): The content tobe added

example:  localhost:8082/resource?id=1

Body Parameters:
{
    "content":"new resource"
}


4. Delete Resource by ID
Delete an existing resource by its ID.

URL: /resource

Method: DELETE

Body Parameters:

id (string, required): The unique identifier of the resource to be deleted.

example: localhost:8082/resource
Body Parameters:
{
    "id":"2"
}


5. Broadcast WebSocket Message
Broadcast a message to all connected WebSocket clients.

URL: /broadcastWS

Method: POST

example: localhost:8082/broadcastWS

=================================================================================




