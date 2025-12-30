import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "Unauthorized" });

    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token)
      return res.status(401).json({ error: "Unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.userId).select("_id");
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    req.user = { id: user._id.toString() };

    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
};

export default protect;
