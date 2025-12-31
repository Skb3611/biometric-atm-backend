"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const client_1 = require("../generated/prisma/client");
const prisma = new client_1.PrismaClient();
async function authMiddleware(req, res, next) {
    try {
        const fingerprintId = req.headers.fingerprintid;
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
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ error: "Internal server error" });
    }
}
