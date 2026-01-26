import WebSocket, { WebSocketServer } from "ws";

export const initializeWebSocket = (httpServer) => {
  const wss = new WebSocketServer({ server: httpServer });
  const userSessions = new Map();
  const roomSubscriptions = new Map();

  wss.on("connection", (ws, req) => {
    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data);
        const { type, userId, handId } = message;

        if (type === "user:join") {
          userSessions.set(userId, ws);
        } else if (type === "hand:join") {
          if (!roomSubscriptions.has(handId)) {
            roomSubscriptions.set(handId, new Set());
          }
          roomSubscriptions.get(handId).add(ws);
        } else if (type === "hand:leave") {
          if (roomSubscriptions.has(handId)) {
            roomSubscriptions.get(handId).delete(ws);
          }
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });

    ws.on("close", () => {
      for (const [userId, userWs] of userSessions.entries()) {
        if (userWs === ws) {
          userSessions.delete(userId);
          break;
        }
      }
      for (const [handId, clients] of roomSubscriptions.entries()) {
        clients.delete(ws);
        if (clients.size === 0) roomSubscriptions.delete(handId);
      }
    });
  });

  return { wss, userSessions, roomSubscriptions };
};
