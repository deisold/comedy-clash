# Comedy Clash Server   
=====================

The server is a Node.js/Express application that is used to manage the Comedy Clash.

## Tech Stack 

- MERN Stack: MongoDB + Express.js + React + Node.js
- TypeScript
- Jest
- Mongoose
- Cloudinary
- WalletConnect
- Infura,
- Socket.io 
- bull/redis 

## Database

The database is a MongoDB database that is used to store the Comedy Clash data.

## API

The API is a RESTful API that is used to manage the Comedy Clash.

## Tests

The server is tested using Jest and Supertest.

## Environment Variables

The server uses environment variables to configure the application. 

The environment variables are stored in the `.env` file.

SERVER_HOST=
SERVER_PORT=
MONGO_URI=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
COMEDY_THEATER_ADDRESS=
WALLETCONNECT_PROJECT_ID=
INFURA_ENDPOINT=
INFURA_ENDPOINT_WS=
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
USE_HTTPS=true
SSL_KEY_PATH=ssl/key.pem
SSL_CERT_PATH=ssl/cert.pem
USE_MOCK_MODE= // used to auto-confirm transactions after a short delay

## HTTPS

The server uses HTTPS to secure the connection between the client and the server.

The SSL certificate and key are stored in the `ssl` folder.

# Create the ssl directory
`mkdir -p ssl`

# Generate certificates in this directory
`openssl genrsa -out ssl/key.pem 2048`
`openssl req -new -x509 -key ssl/key.pem -out ssl/cert.pem -days 365`

## Development

# Start Redis

`redis-server`

#The server is developed using Cursor.ai IDE.

Start the server with `npm run dev`



