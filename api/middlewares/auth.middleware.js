import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

const protect = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return next(
      new AppError("You must be signed in to access this resource.", 401),
    );
  }

  const parts = header.split(" ");

  if (parts.length !== 2) {
    return next(
      new AppError("The authorization header format is invalid.", 401),
    );
  }

  const [scheme, token] = parts;

  if (scheme !== "Bearer" || !token) {
    return next(
      new AppError("A valid authentication token was not provided.", 401),
    );
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: payload.userId,
    };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(
        new AppError("Your session has expired. Please sign in again.", 401),
      );
    }

    if (err.name === "JsonWebTokenError") {
      return next(new AppError("The authentication token is invalid.", 401));
    }

    next(err);
  }
};

export default protect;
