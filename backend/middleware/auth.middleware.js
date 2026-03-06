import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const parts = header.split(" ");
    if (parts.length !== 2) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [scheme, token] = parts;

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: payload.userId,
    };

    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export default protect;
