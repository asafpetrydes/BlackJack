import express from 'express';
import { body } from 'express-validator';
import * as playerController from '../controllers/playerController.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.get('/', playerController.getAllPlayers);
router.post('/', [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('balance').optional().isNumeric().withMessage('Balance must be a number')
], validate, playerController.createPlayer);
router.get('/:id', playerController.getPlayerById);
router.put('/:id', playerController.updatePlayer);
router.delete('/:id', playerController.deletePlayer);
router.get('/:id/stats', playerController.getPlayerStats);

export default router;


