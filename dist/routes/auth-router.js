"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.default)();
router.post("/verify-fingerprint", async (req, res) => {
    const { fingerprintId } = req.body;
    if (!fingerprintId) {
        return res.status(400).json({ error: "Fingerprint ID is required" });
    }
    const user = await prisma_1.default.user.findUnique({
        where: { fingerprintId },
    });
    return user
        ? res.status(200).json({ message: "Fingerprint verified", user: user })
        : res.status(404).json({ error: "User not found" });
});
exports.default = router;
