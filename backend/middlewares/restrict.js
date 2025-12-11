// middleware/auth.js
import jwt from 'jsonwebtoken';
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    console.log("Authenticating token:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded:", decoded);

    // attach user to request
    req.user = decoded;

    next();
  } catch (err) {
    const isExpired = err.name === "TokenExpiredError";
    console.error("JWT verify failed:", err.name, err.message);
    return res.status(401).json({
      success: false,
      code: isExpired ? "TOKEN_EXPIRED" : "INVALID_TOKEN",
      message: isExpired ? "Session expired. Please log in again." : "Invalid token",
    });
  }
};

export default authenticate;