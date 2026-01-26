import express from "express";
import { register, login, logout, getCurrentPlayer } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateSchema.js";
import { registerSchema, loginSchema } from "../utils/schemas.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logout);
router.get("/me", verifyToken, getCurrentPlayer);

export default router;