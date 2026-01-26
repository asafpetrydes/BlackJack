import { Hand } from "../models/Hand.js";
import { HandPlayer } from "../models/HandPlayer.js";
import { Player } from "../models/Player.js";
import GameService from "../services/GameService.js";
import { 
  handStarted, 
  playerHit as emitPlayerHit, 
  playerStand as emitPlayerStand, 
  dealerReveal,
  handComplete,
  balanceUpdate
} from "../utils/socketEvents.js";

export const startHand = async (req, res) => {
  try {
    const { table_id, player_ids, bet_amounts } = req.body;

    if (player_ids.length !== bet_amounts.length) {
      return res.status(400).json({ error: "Players and bets count mismatch" });
    }

    const players = await Player.find({ _id: { $in: player_ids } });
    if (players.length !== player_ids.length) {
      return res.status(404).json({ error: "One or more players not found" });
    }

    for (let i = 0; i < players.length; i++) {
      if (players[i].balance < bet_amounts[i]) {
        return res.status(400).json({ error: `${players[i].name} has insufficient balance` });
      }
    }

    const deck = GameService.createDeck();
    const hand = await Hand.create({
      table_id,
      status: "ACTIVE",
      start_time: new Date(),
      deck,
      dealer_cards: [],
      player_ids
    });

    const handPlayers = await Promise.all(
      player_ids.map(async (pid, i) => {
        await Player.findByIdAndUpdate(pid, { $inc: { balance: -bet_amounts[i] } });
        
        return HandPlayer.create({
          hand_id: hand._id,
          player_id: pid,
          bet_amount: bet_amounts[i],
          cards: [],
          hand_value: 0,
          status: "ACTIVE"
        });
      })
    );

    const { deck: newDeck, dealer, players: dealtPlayers } = GameService.dealInitialCards(deck, player_ids.length);
    hand.deck = newDeck;
    hand.dealer_cards = dealer;

    for (let i = 0; i < handPlayers.length; i++) {
      const playerCards = dealtPlayers[i];
      const handValue = GameService.calculateHandValue(playerCards);
      const status = GameService.isBlackjack(playerCards) ? "BLACKJACK" : "ACTIVE";
      await HandPlayer.findByIdAndUpdate(handPlayers[i]._id, { cards: playerCards, hand_value: handValue, status });
    }

    await hand.save();

    const players_info = handPlayers.map((hp, i) => ({
      hand_player_id: hp._id,
      player_name: players.find(p => p._id.equals(hp.player_id)).name,
      cards: dealtPlayers[i].map(c => ({ rank: c.rank, suit: c.suit })),
      hand_value: GameService.calculateHandValue(dealtPlayers[i]),
      status: GameService.isBlackjack(dealtPlayers[i]) ? "BLACKJACK" : "ACTIVE"
    }));

    res.status(201).json({
      hand_id: hand._id,
      dealer_cards: dealer.map(c => ({ rank: c.rank, suit: c.suit, hidden: true })),
      players: players_info
    });

    handStarted(hand._id, players_info, dealer[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to start hand" });
  }
};

export const playerHit = async (req, res) => {
  try {
    const { hand_player_id } = req.body;

    const handPlayer = await HandPlayer.findById(hand_player_id);
    if (!handPlayer) return res.status(404).json({ error: "HandPlayer not found" });

    const hand = await Hand.findById(handPlayer.hand_id);
    if (!hand || hand.deck.length === 0) {
      return res.status(400).json({ error: "Invalid hand state" });
    }

    const newCard = hand.deck.pop();
    handPlayer.cards.push(newCard);
    handPlayer.hand_value = GameService.calculateHandValue(handPlayer.cards);

    if (GameService.isBust(handPlayer.cards)) {
      handPlayer.status = "BUST";
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

    const player = await Player.findById(handPlayer.player_id);
    if (player) {
      emitPlayerHit(handPlayer.hand_id, handPlayer.player_id, player.name, newCard, handPlayer.hand_value, handPlayer.status);
    }
  } catch (error) {
    res.status(500).json({ error: "Hit action failed" });
  }
};

export const playerStand = async (req, res) => {
  try {
    const { hand_player_id } = req.body;

    const handPlayer = await HandPlayer.findByIdAndUpdate(hand_player_id, { status: "STAND" }, { new: true });
    if (!handPlayer) return res.status(404).json({ error: "HandPlayer not found" });

    res.json({ hand_player_id: handPlayer._id, status: handPlayer.status });

    const player = await Player.findById(handPlayer.player_id);
    if (player) {
      emitPlayerStand(handPlayer.hand_id, handPlayer.player_id, player.name);
    }
  } catch (error) {
    res.status(500).json({ error: "Stand action failed" });
  }
};

export const dealerPlay = async (req, res) => {
  try {
    const { hand_id } = req.body;

    const hand = await Hand.findById(hand_id);
    if (!hand) return res.status(404).json({ error: "Hand not found" });

    while (GameService.calculateHandValue(hand.dealer_cards) < 17) {
      if (hand.deck.length === 0) break;
      hand.dealer_cards.push(hand.deck.pop());
    }

    const handPlayers = await HandPlayer.find({ hand_id: hand._id }).populate('player_id');
    const results = [];
    const dealerValue = GameService.calculateHandValue(hand.dealer_cards);

    for (let handPlayer of handPlayers) {
      const result = GameService.determineWinner(handPlayer.cards, hand.dealer_cards);
      const payout = GameService.calculatePayout(handPlayer.bet_amount, result.result);
      const moneyChange = payout - handPlayer.bet_amount;

      await Player.findByIdAndUpdate(handPlayer.player_id._id, { $inc: { balance: moneyChange } });
      await HandPlayer.findByIdAndUpdate(handPlayer._id, { result: result.result, money_change: moneyChange });

      const updatedPlayer = await Player.findById(handPlayer.player_id._id);
      if (updatedPlayer) {
        balanceUpdate(handPlayer.player_id._id, updatedPlayer.balance);
      }

      results.push({
        player_name: handPlayer.player_id.name,
        result: result.result,
        money_change: moneyChange
      });
    }

    hand.status = "FINISHED";
    hand.end_time = new Date();
    await hand.save();

    res.json({
      hand_id: hand._id,
      dealer_value: dealerValue,
      dealer_cards: hand.dealer_cards.map(c => ({ rank: c.rank, suit: c.suit })),
      results
    });

    dealerReveal(hand._id, hand.dealer_cards, dealerValue);
    handComplete(hand._id, results, dealerValue);
  } catch (error) {
    res.status(500).json({ error: "Dealer play failed" });
  }
};

export const getHandStatus = async (req, res) => {
  try {
    const { hand_id } = req.params;

    const hand = await Hand.findById(hand_id);
    if (!hand) return res.status(404).json({ error: "Hand not found" });

    const handPlayers = await HandPlayer.find({ hand_id: hand._id }).populate('player_id');
    const players = handPlayers.map(hp => ({
      hand_player_id: hp._id,
      player_name: hp.player_id.name,
      cards: hp.cards.map(c => ({ rank: c.rank, suit: c.suit })),
      hand_value: hp.hand_value,
      status: hp.status
    }));

    res.json({
      hand_id: hand._id,
      status: hand.status,
      dealer_cards: hand.dealer_cards.map(c => ({ rank: c.rank, suit: c.suit })),
      players
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hand status" });
  }
};
