export let wsManager = null;

export const setWS = (wsInstance) => {
  wsManager = wsInstance;
};

const broadcast = (clients, event, data) => {
  const message = JSON.stringify({ type: event, data });
  clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
};

export const toHand = (handId, event, data) => {
  if (wsManager?.roomSubscriptions?.has(handId)) {
    broadcast(wsManager.roomSubscriptions.get(handId), event, data);
  }
};

export const toUser = (userId, event, data) => {
  if (wsManager?.userSessions?.has(userId)) {
    const userWs = wsManager.userSessions.get(userId);
    if (userWs.readyState === 1) {
      userWs.send(JSON.stringify({ type: event, data }));
    }
  }
};

export const playerHit = (handId, playerId, playerName, newCard, handValue, status) => {
  toHand(handId, "game:player-hit", {
    playerId,
    playerName,
    newCard,
    handValue,
    status
  });
};

export const playerStand = (handId, playerId, playerName) => {
  toHand(handId, "game:player-stand", { playerId, playerName });
};

export const dealerReveal = (handId, dealerCards, dealerValue) => {
  toHand(handId, "game:dealer-reveal", { dealerCards, dealerValue });
};

export const handComplete = (handId, results, dealerValue) => {
  toHand(handId, "game:hand-complete", { dealerValue, results });
};

export const handStarted = (handId, playersInfo, dealerCard) => {
  toHand(handId, "game:hand-started", { handId, playersInfo, dealerCard });
};

export const balanceUpdate = (userId, balance) => {
  toUser(userId, "player:balance-update", { balance });
};
