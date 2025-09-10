import jwt from "jsonwebtoken";

import UserModel from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status({
      success: false,
      message: "Not Authorized",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findById(payload.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not Found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verification failed", err);

    return res.status(401).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
};


export default authMiddleware;