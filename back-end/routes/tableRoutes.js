import express from 'express';
import { body } from 'express-validator';
import * as tableController from '../controllers/tableController.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.get('/', tableController.getAllTables);
router.post('/', [
  body('name').notEmpty().trim().withMessage('Table name is required'),
  body('max_players').optional().isInt({ min: 1, max: 7 }).withMessage('Max players must be between 1 and 7')
], validate, tableController.createTable);
router.get('/:id', tableController.getTableById);
router.put('/:id', tableController.updateTable);
router.delete('/:id', tableController.deleteTable);
router.get('/:id/players', tableController.getTablePlayers);

export default router;


