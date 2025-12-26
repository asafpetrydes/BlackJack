import express from 'express';
import { body } from 'express-validator';
import * as gameController from '../controllers/gameController.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.post('/start', [
  body('table_id').notEmpty().withMessage('Table ID is required'),
  body('player_ids').isArray({ min: 1 }).withMessage('At least one player required'),
  body('bet_amounts').isArray({ min: 1 }).withMessage('Bet amounts required')
], validate, gameController.startHand);

router.post('/hit', [
  body('hand_player_id').notEmpty().withMessage('HandPlayer ID is required')
], validate, gameController.playerHit);

router.post('/stand', [
  body('hand_player_id').notEmpty().withMessage('HandPlayer ID is required')
], validate, gameController.playerStand);

router.post('/double-down', [
  body('hand_player_id').notEmpty().withMessage('HandPlayer ID is required')
], validate, gameController.doubleDown);

router.post('/split', [
  body('hand_player_id').notEmpty().withMessage('HandPlayer ID is required')
], validate, gameController.split);

router.post('/dealer-play', [
  body('hand_id').notEmpty().withMessage('Hand ID is required')
], validate, gameController.dealerPlay);

router.get('/hand/:hand_id', gameController.getHandStatus);

export default router;