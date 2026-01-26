import { verifyTokenFromRequest } from "../utils/jwtHandler.js";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "No token provided" });

    const result = verifyTokenFromRequest(token);
    if (!result.valid) {
      return res.status(401).json({ error: result.error });
    }

    req.userId = result.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
};
