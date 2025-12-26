# Blackjack Multiplayer - Backend API
ISC

## License

5. Create a Pull Request
4. Push to the branch
3. Commit your changes
2. Create a feature branch
1. Fork the repository

## Contributing

| NODE_ENV | Environment (development/production) | development |
| CLIENT_URL | Frontend URL for CORS | http://localhost:5173 |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/blackjack |
| PORT | Server port | 3000 |
|----------|-------------|---------|
| Variable | Description | Default |

## Environment Variables

- Any HTTP client
- cURL
- Postman
- Swagger UI at `/api-docs`
You can test the API using:

## Testing

```
npm run dev
```bash
**Run in development mode:**

```
npm install -g nodemon
```bash
**Install nodemon globally (optional):**

## Development

- `500` - Internal Server Error
- `404` - Not Found
- `400` - Bad Request
- `201` - Created
- `200` - Success
Status codes:

```
}
  "error": "Error message"
{
```json
All errors follow this format:

## Error Handling

- Insurance not yet implemented
- Players can hit, stand, double down, or split pairs
- Push returns bet
- Regular win pays 1:1
- Blackjack pays 3:2
- Dealer hits on 16 or less, stands on 17 or more
- Standard Blackjack rules apply

## Game Rules

   ```
   { "hand_id": "..." }
   POST /api/game/dealer-play
   ```http
5. **Dealer Plays**

   ```
   { "hand_player_id": "..." }
   POST /api/game/stand
   
   { "hand_player_id": "..." }
   POST /api/game/hit
   ```http
4. **Player Actions**

   ```
   }
     "bet_amounts": [100, 200]
     "player_ids": ["...", "..."],
     "table_id": "...",
   {
   POST /api/game/start
   ```http
3. **Start Hand**

   ```
   { "name": "VIP Table", "max_players": 4 }
   POST /api/tables
   ```http
2. **Create Table**

   ```
   { "name": "Player 1", "balance": 1000 }
   POST /api/players
   ```http
1. **Create Players**

## Game Flow

- `chat-message` - Chat message received
- `hand-finished` - Hand finished
- `hand-started` - New hand started
- `table-players` - Current players at table
- `player-left` - Player left table
- `player-joined` - Player joined table
### Server -> Client

- `chat-message` - Send chat message
- `player-action` - Player performs an action
- `leave-table` - Leave a table
- `join-table` - Join a table
### Client -> Server

## WebSocket Events

- `GET /api/game/hand/:hand_id` - Get hand status
- `POST /api/game/dealer-play` - Dealer plays their hand
- `POST /api/game/split` - Player splits a pair
- `POST /api/game/double-down` - Player doubles down
- `POST /api/game/stand` - Player stands
- `POST /api/game/hit` - Player hits (draws a card)
- `POST /api/game/start` - Start a new hand
### Game

- `GET /api/tables/:id/players` - Get players at a table
- `DELETE /api/tables/:id` - Delete table
- `PUT /api/tables/:id` - Update table
- `GET /api/tables/:id` - Get table by ID
- `POST /api/tables` - Create a new table
- `GET /api/tables` - Get all tables
### Tables

- `GET /api/players/:id/stats` - Get player statistics
- `DELETE /api/players/:id` - Delete player
- `PUT /api/players/:id` - Update player
- `GET /api/players/:id` - Get player by ID
- `POST /api/players` - Create a new player
- `GET /api/players` - Get all players
### Players

## API Endpoints

```
http://localhost:3000/api-docs
```
Once the server is running, access the Swagger documentation at:

## API Documentation

The server will start on `http://localhost:3000`

```
npm start
```bash
**Production mode:**

```
npm run dev
```bash
**Development mode (with auto-reload):**

## Running the Server

   ```
   mongod
   # If using local MongoDB
   ```bash
4. **Make sure MongoDB is running**

   ```
   CLIENT_URL=http://localhost:5173
   MONGO_URI=mongodb://localhost:27017/blackjack
   NODE_ENV=development
   PORT=3000
   ```env
3. **Configure your .env file**

   ```
   cp .env.example .env
   ```bash
2. **Set up environment variables**

   ```
   npm install
   ```bash
1. **Install dependencies**

## Installation

```
└── package.json         # Dependencies
├── index.js             # Application entry point
├── .env.example         # Environment variables template
│   └── SocketHandler.js # WebSocket handler
│   ├── GameService.js   # Game logic service
├── services/
│   └── tableRoutes.js   # Table endpoints
│   ├── playerRoutes.js  # Player endpoints
│   ├── gameRoutes.js    # Game endpoints
├── routes/
│   └── Table.js         # Table model
│   ├── Player.js        # Player model
│   ├── HandPlayer.js    # Player's hand in a game
│   ├── Hand.js          # Hand/Game session model
├── models/
│   └── validation.js     # Validation middleware
│   ├── errorHandler.js   # Error handling middleware
├── middleware/
│   └── tableController.js  # Table management
│   ├── playerController.js # Player CRUD operations
│   ├── gameController.js # Game logic endpoints
├── controllers/
│   └── swagger.js        # Swagger documentation setup
│   ├── database.js       # MongoDB configuration
├── config/
back-end/
```

## Project Structure

- **Express Validator** - Input validation
- **Swagger** - API documentation
- **Socket.IO** - Real-time WebSocket communication
- **Mongoose** - ODM for MongoDB
- **MongoDB** - Database
- **Express** - Web framework
- **Node.js** - Runtime environment

## Tech Stack

- ✅ Error handling
- ✅ Input validation
- ✅ MongoDB data persistence
- ✅ Swagger API documentation
- ✅ Table management
- ✅ Player management and statistics
- ✅ Complete Blackjack game logic
- ✅ Real-time WebSocket communication
- ✅ RESTful API for game management

## Features

A real-time multiplayer Blackjack game server built with Node.js, Express, MongoDB, and Socket.IO.


