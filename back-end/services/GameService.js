// ===== BLACKJACK GAME SERVICE =====
// Handles all game logic - card dealing, hand calculation, win/loss determination, etc.

class GameService {
  // Card deck setup
  static createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck = [];

    for (let suit of suits) {
      for (let rank of ranks) {
        deck.push({ rank, suit, value: this.getCardValue(rank) });
      }
    }

    // Shuffle deck
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
    if (rank === 'A') return 11; // Ace is 11 by default, can be 1
    if (['J', 'Q', 'K'].includes(rank)) return 10;
    return parseInt(rank);
  }

  // Calculate hand value
  static calculateHandValue(cards) {
    let total = 0;
    let aces = 0;

    // Sum all card values
    for (let card of cards) {
      total += card.value;
      if (card.rank === 'A') aces++;
    }

    // Adjust for aces if hand is over 21
    while (total > 21 && aces > 0) {
      total -= 10; // Convert one ace from 11 to 1
      aces--;
    }

    return total;
  }

  // Check if hand is a blackjack (21 with 2 cards)
  static isBlackjack(cards) {
    return cards.length === 2 && this.calculateHandValue(cards) === 21;
  }

  // Check if hand is bust (over 21)
  static isBust(cards) {
    return this.calculateHandValue(cards) > 21;
  }

  // Deal initial cards to all players and dealer
  static dealInitialCards(deck, playerCount) {
    const hands = {
      dealer: [],
      players: {}
    };

    // Deal 2 cards to each player (round-robin style)
    for (let round = 0; round < 2; round++) {
      for (let i = 0; i < playerCount; i++) {
        if (!hands.players[i]) hands.players[i] = [];
        hands.players[i].push(deck.pop());
      }
      hands.dealer.push(deck.pop());
    }

    return { hands, deck };
  }

  // Determine winner and calculate payouts
  static determineWinner(playerCards, dealerCards) {
    const playerValue = this.calculateHandValue(playerCards);
    const dealerValue = this.calculateHandValue(dealerCards);

    // Player busts
    if (playerValue > 21) {
      return {
        result: 'BUST',
        message: 'Player busts! Dealer wins.',
        playerBusts: true
      };
    }

    // Dealer busts
    if (dealerValue > 21) {
      return {
        result: 'WIN',
        message: 'Dealer busts! Player wins.',
        dealerBusts: true
      };
    }

    // Both stand - compare values
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

  // Calculate payout
  static calculatePayout(betAmount, result, playerCards) {
    let multiplier = 0;

    if (result === 'BLACKJACK') {
      multiplier = 2.5; // 3:2 payout (1.5x bet profit)
    } else if (result === 'WIN') {
      multiplier = 2; // 1:1 payout (1x bet profit)
    } else if (result === 'PUSH') {
      multiplier = 1; // Return bet amount
    } else {
      multiplier = 0; // Lose bet
    }

    return Math.round(betAmount * multiplier);
  }

  // Hit: deal one more card
  static hit(cards, deck) {
    const newCard = deck.pop();
    cards.push(newCard);
    return { cards, deck, newCard };
  }

  // Get card string representation
  static cardToString(card) {
    return `${card.rank}${card.suit}`;
  }

  // Format cards for response
  static formatCards(cards) {
    return cards.map(card => this.cardToString(card));
  }
}

export default GameService;
