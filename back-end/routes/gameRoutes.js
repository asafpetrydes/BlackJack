import express from 'express';
import * as gameController from '../controllers/gameController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateSchema.js';
import { startHandSchema, playerHitSchema, playerStandSchema, dealerPlaySchema } from '../utils/schemas.js';

const router = express.Router();

router.post('/start', verifyToken, validateRequest(startHandSchema), gameController.startHand);
router.post('/hit', verifyToken, validateRequest(playerHitSchema), gameController.playerHit);
router.post('/stand', verifyToken, validateRequest(playerStandSchema), gameController.playerStand);
router.post('/dealer-play', verifyToken, validateRequest(dealerPlaySchema), gameController.dealerPlay);
router.get('/status/:hand_id', verifyToken, gameController.getHandStatus);

export default router;
