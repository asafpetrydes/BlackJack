class GameService {
  static createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck = suits.flatMap(suit => ranks.map(rank => ({ rank, suit, value: this.getCardValue(rank) })));
    return this.shuffleDeck(deck);
  }

  static shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  static getCardValue(rank) {
    if (rank === 'A') return 11;
    if (['J', 'Q', 'K'].includes(rank)) return 10;
    return parseInt(rank);
  }

  static calculateHandValue(cards) {
    let total = 0;
    let aces = 0;

    for (let card of cards) {
      total += card.value;
      if (card.rank === 'A') aces++;
    }

    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }

    return total;
  }

  static isBlackjack(cards) {
    return cards.length === 2 && this.calculateHandValue(cards) === 21;
  }

  static isBust(cards) {
    return this.calculateHandValue(cards) > 21;
  }

  static dealInitialCards(deck, playerCount) {
    const players = [];
    for (let i = 0; i < playerCount; i++) {
      players.push([]);
    }
    const dealer = [];

    for (let i = 0; i < playerCount; i++) {
      players[i].push(deck.pop());
    }
    dealer.push(deck.pop());

    for (let i = 0; i < playerCount; i++) {
      players[i].push(deck.pop());
    }
    dealer.push(deck.pop());

    return { deck, dealer, players };
  }

  static determineWinner(playerCards, dealerCards) {
    const playerValue = this.calculateHandValue(playerCards);
    const dealerValue = this.calculateHandValue(dealerCards);

    if (playerValue > 21) return { result: 'BUST', message: 'Player busts!' };
    if (dealerValue > 21) return { result: 'WIN', message: 'Dealer busts!' };
    if (playerValue > dealerValue) return { result: 'WIN', message: 'Player wins!' };
    if (playerValue < dealerValue) return { result: 'LOSE', message: 'Dealer wins!' };
    return { result: 'PUSH', message: 'Push!' };
  }

  static calculatePayout(betAmount, result) {
    const multipliers = { BLACKJACK: 2.5, WIN: 2, PUSH: 1, BUST: 0, LOSE: 0 };
    return Math.round(betAmount * (multipliers[result] || 0));
  }
}

export default GameService;
