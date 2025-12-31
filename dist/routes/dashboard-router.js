"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.default)();
router.get("/account-details", async (req, res) => {
    console.log(req.user);
    const fingerprintId = req.user?.fingerprintId;
    const user = await prisma_1.default.user.findUnique({
        where: { fingerprintId },
    });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ message: "User found", user: user });
});
router.post("/account/withdraw", async (req, res) => {
    const { amt } = req.body;
    const fingerprintId = req.user?.fingerprintId;
    if (!fingerprintId) {
        return res.status(400).json({ error: "Fingerprint ID is required" });
    }
    const user = await prisma_1.default.user.findUnique({
        where: { fingerprintId },
    });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    if (user.balance < amt) {
        return res.status(400).json({ error: "Insufficient balance" });
    }
    await prisma_1.default.transaction.create({
        data: {
            type: "withdraw",
            userId: user.id,
            amount: amt,
            fromAccountNumber: user.accountNumber,
            toAccountNumber: user.accountNumber,
        },
    });
    const updatedUser = await prisma_1.default.user.update({
        where: { fingerprintId },
        data: { balance: user.balance - amt },
    });
    return res
        .status(200)
        .json({ message: "Withdrawl successful", user: updatedUser });
});
router.post("/account/deposit", async (req, res) => {
    const { amt } = req.body;
    const fingerprintId = req.user?.fingerprintId;
    if (!fingerprintId) {
        return res.status(400).json({ error: "Fingerprint ID is required" });
    }
    if (!amt) {
        return res.status(400).json({ error: "Amount is required" });
    }
    const user = await prisma_1.default.user.findUnique({
        where: { fingerprintId },
    });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const updatedUser = await prisma_1.default.user.update({
        where: { fingerprintId },
        data: { balance: user.balance + amt },
    });
    await prisma_1.default.transaction.create({
        data: {
            type: "deposit",
            userId: user.id,
            amount: amt,
            fromAccountNumber: user.accountNumber,
            toAccountNumber: user.accountNumber,
        },
    });
    return res
        .status(200)
        .json({ message: "Deposit successful", user: updatedUser });
});
router.post("/account/transfer", async (req, res) => {
    const { receiverAccountNO, amt } = req.body;
    const senderAccountNO = req.user?.accountNumber;
    if (!senderAccountNO) {
        return res.status(400).json({ error: "Sender Account Number is required" });
    }
    if (!receiverAccountNO) {
        return res
            .status(400)
            .json({ error: "Receiver Account Number is required" });
    }
    if (!amt) {
        return res.status(400).json({ error: "Amount is required" });
    }
    const senderUser = await prisma_1.default.user.findUnique({
        where: { accountNumber: senderAccountNO },
    });
    if (!senderUser) {
        return res.status(404).json({ error: "Sender user not found" });
    }
    if (senderUser.balance < amt) {
        return res.status(400).json({ error: "Insufficient balance" });
    }
    const receiverUser = await prisma_1.default.user.findUnique({
        where: { accountNumber: receiverAccountNO },
    });
    if (!receiverUser) {
        return res.status(404).json({ error: "Receiver user not found" });
    }
    const updatedSenderUser = await prisma_1.default.user.update({
        where: { accountNumber: senderAccountNO },
        data: { balance: senderUser.balance - amt },
    });
    const updatedReceiverUser = await prisma_1.default.user.update({
        where: { accountNumber: receiverAccountNO },
        data: { balance: receiverUser.balance + amt },
    });
    const transaction = await prisma_1.default.transaction.create({
        data: {
            type: "transfer",
            fromAccountNumber: senderUser.accountNumber,
            toAccountNumber: receiverUser.accountNumber,
            amount: amt,
            userId: senderUser.id,
        },
    });
    return res.status(200).json({
        message: "Transfer successful",
        senderAccountNo: updatedSenderUser.accountNumber,
        receiverAccountNo: updatedReceiverUser.accountNumber,
        transaction: transaction,
    });
});
router.get("/account/statement", async (req, res) => {
    const accountNumber = req.user?.accountNumber;
    if (!accountNumber) {
        return res.status(400).json({ error: "Account Number is required" });
    }
    const user = await prisma_1.default.user.findUnique({
        where: { accountNumber },
    });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const transaction = await prisma_1.default.transaction.findMany({
        where: { userId: user.id },
    });
    return res.status(200).json({ transactions: transaction });
});
exports.default = router;
