import express from 'express';
import * as playerController from '../controllers/playerController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateSchema.js';
import { updatePlayerSchema } from '../utils/schemas.js';

const router = express.Router();

router.get('/', playerController.getAllPlayers);
router.get('/:id', playerController.getPlayerById);
router.put('/:id', verifyToken, validateRequest(updatePlayerSchema), playerController.updatePlayer);
router.get('/stats/me', verifyToken, playerController.getMyStats);

export default router;

