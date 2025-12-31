import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";
const prisma = new PrismaClient();
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(req.headers);
    const fingerprintId = req.headers["fingerprintid"] as string;
    if (!fingerprintId) {
      return res.status(400).json({ error: "Fingerprint ID is required" });
    }
    const user = await prisma.user.findUnique({
      where: { fingerprintId },
    });
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
  }
}
