export class SocketHandler {
  constructor(io) {
    this.io = io;
    this.tables = new Map();
    this.players = new Map();
  }

  initialize() {
    this.io.on('connection', (socket) => {
      console.log(`✅ Client connected: ${socket.id}`);

      socket.on('join-table', ({ tableId, playerId, playerName }) => {
        socket.join(`table-${tableId}`);

        if (!this.tables.has(tableId)) {
          this.tables.set(tableId, new Set());
        }
        this.tables.get(tableId).add(socket.id);

        this.players.set(socket.id, { playerId, playerName, tableId });

        socket.to(`table-${tableId}`).emit('player-joined', {
          playerId,
          playerName,
          socketId: socket.id
        });

        const tablePlayers = Array.from(this.tables.get(tableId))
          .map(sid => this.players.get(sid))
          .filter(p => p);

        socket.emit('table-players', tablePlayers);

        console.log(`Player ${playerName} joined table ${tableId}`);
      });

      socket.on('leave-table', ({ tableId }) => {
        this.handleLeaveTable(socket, tableId);
      });

      socket.on('hand-started', (data) => {
        socket.to(`table-${data.tableId}`).emit('hand-started', data);
      });

      socket.on('player-action', (data) => {
        socket.to(`table-${data.tableId}`).emit('player-action', data);
      });

      socket.on('hand-finished', (data) => {
        socket.to(`table-${data.tableId}`).emit('hand-finished', data);
      });

      socket.on('chat-message', ({ tableId, message, playerName }) => {
        this.io.to(`table-${tableId}`).emit('chat-message', {
          playerName,
          message,
          timestamp: new Date().toISOString()
        });
      });

      socket.on('disconnect', () => {
        const playerInfo = this.players.get(socket.id);
        if (playerInfo) {
          this.handleLeaveTable(socket, playerInfo.tableId);
        }
        this.players.delete(socket.id);
        console.log(`❌ Client disconnected: ${socket.id}`);
      });
    });
  }

  handleLeaveTable(socket, tableId) {
    if (tableId && this.tables.has(tableId)) {
      this.tables.get(tableId).delete(socket.id);

      const playerInfo = this.players.get(socket.id);
      if (playerInfo) {
        socket.to(`table-${tableId}`).emit('player-left', {
          playerId: playerInfo.playerId,
          playerName: playerInfo.playerName
        });
        console.log(`Player ${playerInfo.playerName} left table ${tableId}`);
      }

      socket.leave(`table-${tableId}`);

      if (this.tables.get(tableId).size === 0) {
        this.tables.delete(tableId);
      }
    }
  }

  broadcastToTable(tableId, event, data) {
    this.io.to(`table-${tableId}`).emit(event, data);
  }

  getTablePlayerCount(tableId) {
    return this.tables.has(tableId) ? this.tables.get(tableId).size : 0;
  }
}

