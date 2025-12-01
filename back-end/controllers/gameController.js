// ===== GAME CONTROLLER =====
// Handles all game endpoints and logic

import { Hand } from "../models/Hand.js";
import { HandPlayer } from "../models/HandPlayer.js";
import { Player } from "../models/Player.js";
import { Table } from "../models/Table.js";
import GameService from "../services/GameService.js";

// Start a new hand
export async function startHand(req, res) {
  try {
    const { table_id, player_ids, bet_amounts } = req.body;

    // Validate input
    if (!table_id || !player_ids || !bet_amounts) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Verify all players exist and have sufficient balance
    const players = await Player.find({ _id: { $in: player_ids } });
    if (players.length !== player_ids.length) {
      return res.status(400).json({ error: "One or more players not found" });
    }

    for (let i = 0; i < players.length; i++) {
      if (players[i].balance < bet_amounts[i]) {
        return res.status(400).json({ 
          error: `${players[i].name} does not have sufficient balance` 
        });
      }
    }

    // Create new hand
    const deck = GameService.createDeck();
    const hand = await Hand.create({
      table_id,
      status: "ACTIVE",
      start_time: new Date(),
      deck,
      dealer_cards: [],
      dealer_hidden: true,
      player_ids
    });

    // Deal initial cards and create HandPlayer records
    const handPlayers = [];
    for (let i = 0; i < player_ids.length; i++) {
      const playerHand = await HandPlayer.create({
        hand_id: hand._id,
        player_id: player_ids[i],
        bet_amount: bet_amounts[i],
        cards: [],
        hand_value: 0,
        status: "ACTIVE"
      });
      handPlayers.push(playerHand);
    }

    // Deal cards (2 to each player, 1 to dealer)
    const dealtCards = GameService.dealInitialCards(hand.deck, player_ids.length);
    hand.deck = dealtCards.deck;
    hand.dealer_cards = dealtCards.hands.dealer;

    // Update HandPlayer with dealt cards
    for (let i = 0; i < handPlayers.length; i++) {
      const playerCards = dealtCards.hands.players[i];
      const handValue = GameService.calculateHandValue(playerCards);
      
      let status = "ACTIVE";
      if (GameService.isBlackjack(playerCards)) {
        status = "BLACKJACK";
      }

      await HandPlayer.findByIdAndUpdate(handPlayers[i]._id, {
        cards: playerCards,
        hand_value: handValue,
        status
      });
    }

    await hand.save();

    // Format response
    const response = {
      hand_id: hand._id,
      status: hand.status,
      dealer_cards: hand.dealer_cards.map(c => ({ 
        rank: c.rank, 
        suit: c.suit,
        hidden: true // First card is hidden during play
      })),
      players: await Promise.all(handPlayers.map(async (hp) => {
        const updated = await HandPlayer.findById(hp._id).populate('player_id');
        return {
          hand_player_id: updated._id,
          player_id: updated.player_id._id,
          player_name: updated.player_id.name,
          bet_amount: updated.bet_amount,
          cards: updated.cards.map(c => ({ rank: c.rank, suit: c.suit })),
          hand_value: updated.hand_value,
          status: updated.status
        };
      }))
    };

    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Player hits (draws a card)
export async function playerHit(req, res) {
  try {
    const { hand_player_id } = req.body;

    const handPlayer = await HandPlayer.findById(hand_player_id).populate('player_id');
    if (!handPlayer) {
      return res.status(404).json({ error: "HandPlayer not found" });
    }

    const hand = await Hand.findById(handPlayer.hand_id);
    if (!hand) {
      return res.status(404).json({ error: "Hand not found" });
    }

    // Hit the player
    const newCard = hand.deck.pop();
    handPlayer.cards.push(newCard);
    handPlayer.hand_value = GameService.calculateHandValue(handPlayer.cards);

    // Check for bust
    if (GameService.isBust(handPlayer.cards)) {
      handPlayer.status = "BUST";
      handPlayer.result = "BUST";
    }

    await handPlayer.save();
    await hand.save();

    res.json({
      hand_player_id: handPlayer._id,
      cards: handPlayer.cards.map(c => ({ rank: c.rank, suit: c.suit })),
      hand_value: handPlayer.hand_value,
      status: handPlayer.status,
      new_card: { rank: newCard.rank, suit: newCard.suit }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Player stands
export async function playerStand(req, res) {
  try {
    const { hand_player_id } = req.body;

    const handPlayer = await HandPlayer.findById(hand_player_id);
    if (!handPlayer) {
      return res.status(404).json({ error: "HandPlayer not found" });
    }

    handPlayer.status = "STAND";
    await handPlayer.save();

    res.json({
      hand_player_id: handPlayer._id,
      status: handPlayer.status
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Dealer plays their hand
export async function dealerPlay(req, res) {
  try {
    const { hand_id } = req.body;

    const hand = await Hand.findById(hand_id);
    if (!hand) {
      return res.status(404).json({ error: "Hand not found" });
    }

    // Dealer reveals face-down card and plays
    hand.dealer_hidden = false;

    // Dealer must hit on 16 or less, stand on 17 or more
    while (GameService.calculateHandValue(hand.dealer_cards) < 17) {
      hand.dealer_cards.push(hand.deck.pop());
    }

    const dealerValue = GameService.calculateHandValue(hand.dealer_cards);

    // Get all hand players
    const handPlayers = await HandPlayer.find({ hand_id }).populate('player_id');

    // Determine results for each player
    const results = [];
    for (let handPlayer of handPlayers) {
      if (handPlayer.status === "BUST") {
        // Already busted
        handPlayer.result = "BUST";
        handPlayer.money_change = -handPlayer.bet_amount;
        handPlayer.payout = 0;
      } else if (GameService.isBlackjack(handPlayer.cards) && hand.dealer_cards.length === 2 && dealerValue === 21) {
        // Both have blackjack
        handPlayer.result = "PUSH";
        handPlayer.money_change = 0;
        handPlayer.payout = handPlayer.bet_amount;
      } else if (GameService.isBlackjack(handPlayer.cards)) {
        // Player has blackjack
        handPlayer.result = "BLACKJACK";
        const payout = GameService.calculatePayout(handPlayer.bet_amount, "BLACKJACK");
        handPlayer.money_change = payout - handPlayer.bet_amount;
        handPlayer.payout = payout;
      } else {
        // Normal comparison
        const winnerInfo = GameService.determineWinner(handPlayer.cards, hand.dealer_cards);
        handPlayer.result = winnerInfo.result;
        const payout = GameService.calculatePayout(handPlayer.bet_amount, winnerInfo.result);
        handPlayer.money_change = payout - handPlayer.bet_amount;
        handPlayer.payout = payout;
      }

      // Update player balance
      const player = await Player.findByIdAndUpdate(
        handPlayer.player_id._id,
        { $inc: { balance: handPlayer.money_change } },
        { new: true }
      );

      // Update hand player
      await handPlayer.save();

      results.push({
        hand_player_id: handPlayer._id,
        player_name: handPlayer.player_id.name,
        cards: handPlayer.cards.map(c => ({ rank: c.rank, suit: c.suit })),
        hand_value: GameService.calculateHandValue(handPlayer.cards),
        result: handPlayer.result,
        money_change: handPlayer.money_change,
        payout: handPlayer.payout,
        new_balance: player.balance
      });
    }

    // Finish the hand
    hand.status = "FINISHED";
    hand.end_time = new Date();
    await hand.save();

    res.json({
      hand_id: hand._id,
      status: hand.status,
      dealer_cards: hand.dealer_cards.map(c => ({ rank: c.rank, suit: c.suit })),
      dealer_value: GameService.calculateHandValue(hand.dealer_cards),
      dealer_busted: GameService.isBust(hand.dealer_cards),
      results
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get hand status
export async function getHandStatus(req, res) {
  try {
    const { hand_id } = req.params;

    const hand = await Hand.findById(hand_id);
    if (!hand) {
      return res.status(404).json({ error: "Hand not found" });
    }

    const handPlayers = await HandPlayer.find({ hand_id }).populate('player_id');

    const players = handPlayers.map(hp => ({
      hand_player_id: hp._id,
      player_id: hp.player_id._id,
      player_name: hp.player_id.name,
      bet_amount: hp.bet_amount,
      cards: hp.cards.map(c => ({ rank: c.rank, suit: c.suit })),
      hand_value: hp.hand_value,
      status: hp.status,
      result: hp.result
    }));

    res.json({
      hand_id: hand._id,
      status: hand.status,
      dealer_cards: hand.dealer_cards.map(c => ({ 
        rank: c.rank, 
        suit: c.suit,
        hidden: hand.status !== "FINISHED" && hand.dealer_hidden
      })),
      dealer_value: hand.status === "FINISHED" ? GameService.calculateHandValue(hand.dealer_cards) : null,
      players
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Double down
export async function doubleDown(req, res) {
  try {
    const { hand_player_id } = req.body;

    const handPlayer = await HandPlayer.findById(hand_player_id).populate('player_id');
    if (!handPlayer) {
      return res.status(404).json({ error: "HandPlayer not found" });
    }

    // Check if player has enough balance to double
    if (handPlayer.player_id.balance < handPlayer.bet_amount) {
      return res.status(400).json({ error: "Insufficient balance to double down" });
    }

    const hand = await Hand.findById(handPlayer.hand_id);

    // Double the bet and deal one more card
    handPlayer.bet_amount *= 2;
    const newCard = hand.deck.pop();
    handPlayer.cards.push(newCard);
    handPlayer.hand_value = GameService.calculateHandValue(handPlayer.cards);

    // Check for bust
    if (GameService.isBust(handPlayer.cards)) {
      handPlayer.status = "BUST";
      handPlayer.result = "BUST";
    } else {
      handPlayer.status = "STAND"; // Auto-stand after double down
    }

    await handPlayer.save();
    await hand.save();

    res.json({
      hand_player_id: handPlayer._id,
      cards: handPlayer.cards.map(c => ({ rank: c.rank, suit: c.suit })),
      hand_value: handPlayer.hand_value,
      bet_amount: handPlayer.bet_amount,
      status: handPlayer.status,
      new_card: { rank: newCard.rank, suit: newCard.suit }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Split hand (for pairs)
export async function split(req, res) {
  try {
    const { hand_player_id } = req.body;

    const handPlayer = await HandPlayer.findById(hand_player_id).populate('player_id');
    if (!handPlayer) {
      return res.status(404).json({ error: "HandPlayer not found" });
    }

    // Check if hand can be split (2 cards with same rank)
    if (handPlayer.cards.length !== 2 || handPlayer.cards[0].rank !== handPlayer.cards[1].rank) {
      return res.status(400).json({ error: "Can only split pairs" });
    }

    // Check balance
    if (handPlayer.player_id.balance < handPlayer.bet_amount) {
      return res.status(400).json({ error: "Insufficient balance to split" });
    }

    const hand = await Hand.findById(handPlayer.hand_id);

    // Create second hand
    const newHandPlayer = await HandPlayer.create({
      hand_id: hand._id,
      player_id: handPlayer.player_id._id,
      bet_amount: handPlayer.bet_amount,
      cards: [handPlayer.cards[1]],
      hand_value: GameService.calculateHandValue([handPlayer.cards[1]]),
      status: "ACTIVE"
    });

    // Update original hand
    handPlayer.cards = [handPlayer.cards[0]];
    handPlayer.hand_value = GameService.calculateHandValue([handPlayer.cards[0]]);
    await handPlayer.save();

    // Deal new cards to both hands
    const newCard1 = hand.deck.pop();
    const newCard2 = hand.deck.pop();
    
    handPlayer.cards.push(newCard1);
    handPlayer.hand_value = GameService.calculateHandValue(handPlayer.cards);
    await handPlayer.save();

    newHandPlayer.cards.push(newCard2);
    newHandPlayer.hand_value = GameService.calculateHandValue(newHandPlayer.cards);
    await newHandPlayer.save();

    await hand.save();

    res.json({
      original_hand_player: {
        hand_player_id: handPlayer._id,
        cards: handPlayer.cards.map(c => ({ rank: c.rank, suit: c.suit })),
        hand_value: handPlayer.hand_value
      },
      new_hand_player: {
        hand_player_id: newHandPlayer._id,
        cards: newHandPlayer.cards.map(c => ({ rank: c.rank, suit: c.suit })),
        hand_value: newHandPlayer.hand_value
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
