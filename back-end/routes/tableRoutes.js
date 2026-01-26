import express from 'express';
import * as tableController from '../controllers/tableController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateSchema.js';
import { createTableSchema, updateTableSchema } from '../utils/schemas.js';

const router = express.Router();

router.get('/', tableController.getAllTables);
router.post('/', verifyToken, validateRequest(createTableSchema), tableController.createTable);
router.get('/:id', tableController.getTableById);
router.put('/:id', verifyToken, validateRequest(updateTableSchema), tableController.updateTable);
router.delete('/:id', verifyToken, tableController.deleteTable);

export default router;

