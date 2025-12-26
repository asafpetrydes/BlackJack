class GameService {
  static createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck = [];

    for (let suit of suits) {
      for (let rank of ranks) {
        deck.push({ rank, suit, value: this.getCardValue(rank) });
      }
    }

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
    const hands = {
      dealer: [],
      players: {}
    };

    for (let round = 0; round < 2; round++) {
      for (let i = 0; i < playerCount; i++) {
        if (!hands.players[i]) hands.players[i] = [];
        hands.players[i].push(deck.pop());
      }
      hands.dealer.push(deck.pop());
    }

    return { hands, deck };
  }

  static determineWinner(playerCards, dealerCards) {
    const playerValue = this.calculateHandValue(playerCards);
    const dealerValue = this.calculateHandValue(dealerCards);

    if (playerValue > 21) {
      return {
        result: 'BUST',
        message: 'Player busts! Dealer wins.',
        playerBusts: true
      };
    }

    if (dealerValue > 21) {
      return {
        result: 'WIN',
        message: 'Dealer busts! Player wins.',
        dealerBusts: true
      };
    }

    if (playerValue > dealerValue) {
      return {
        result: 'WIN',
        message: `Player ${playerValue} vs Dealer ${dealerValue}. Player wins!`
      };
    } else if (playerValue < dealerValue) {
      return {
        result: 'LOSE',
        message: `Player ${playerValue} vs Dealer ${dealerValue}. Dealer wins!`
      };
    } else {
      return {
        result: 'PUSH',
        message: `Both have ${playerValue}. Push!`
      };
    }
  }

  static calculatePayout(betAmount, result) {
    let multiplier;

    if (result === 'BLACKJACK') {
      multiplier = 2.5;
    } else if (result === 'WIN') {
      multiplier = 2;
    } else if (result === 'PUSH') {
      multiplier = 1;
    } else {
      multiplier = 0;
    }

    return Math.round(betAmount * multiplier);
  }

  static hit(cards, deck) {
    const newCard = deck.pop();
    cards.push(newCard);
    return { cards, deck, newCard };
  }

  static cardToString(card) {
    return `${card.rank}${card.suit}`;
  }

  static formatCards(cards) {
    return cards.map(card => this.cardToString(card));
  }
}

export default GameService;
