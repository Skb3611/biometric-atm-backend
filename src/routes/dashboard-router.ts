import Router from "express";
import prisma from "../lib/prisma";
import { Request, Response } from "express";
const router = Router();
router.get("/account-details", async (req: Request, res: Response) => {
  const fingerprintId = req.user?.fingerprintId;
  const user = await prisma.user.findUnique({
    where: { fingerprintId },
    include: { accounts: true, transactions: true },
  });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.status(200).json({
    message: "User found",
    user: {
      id: user.id,
      name: user.name,
      accounts: user.accounts,
      fingerprintId: user.fingerprintId,
      transactions: user.transactions,
    },
  });
});
router.post("/account/withdraw", async (req, res) => {
  const { amt, bankName, pin } = req.body;
  const fingerprintId = req.user?.fingerprintId;
  if (!fingerprintId) {
    return res.status(400).json({ error: "Fingerprint ID is required" });
  }
  const user = await prisma.user.findUnique({
    where: { fingerprintId },
    include: { accounts: true },
  });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const account = user.accounts.find((acc) => acc.bankName === bankName);
  if (!account) {
    return res.status(400).json({ error: "Account not found" });
  }
  if (account.pin !== pin) {
    return res.status(400).json({ error: "Invalid PIN" });
  }
  if (account.balance < amt) {
    return res.status(400).json({ error: "Insufficient balance" });
  }
  await prisma.transaction.create({
    data: {
      type: "withdraw",
      userId: user.id,
      amount: amt,
      fromAccountNumber: account.accountNumber,
      toAccountNumber: account.accountNumber,
    },
  });
  const updatedUser = await prisma.user.update({
    where: { fingerprintId },
    data: {
      accounts: {
        update: {
          where: { id: account.id },
          data: { balance: account.balance - amt },
        },
      },
    },
    include: { accounts: true, transactions: true },
  });
  return res
    .status(200)
    .json({ message: "Withdrawl successful", user: updatedUser });
});

router.post("/account/deposit", async (req: Request, res: Response) => {
  const { amt, bankName } = req.body;
  const fingerprintId = req.user?.fingerprintId;
  if (!fingerprintId) {
    return res.status(400).json({ error: "Fingerprint ID is required" });
  }
  if (!amt) {
    return res.status(400).json({ error: "Amount is required" });
  }
  const user = await prisma.user.findUnique({
    where: { fingerprintId },
    include: { accounts: true },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const account = user.accounts.find((acc) => acc.bankName === bankName);
  if (!account) {
    return res.status(400).json({ error: "Account not found" });
  }
  const updatedUser = await prisma.user.update({
    where: { fingerprintId },
    data: {
      accounts: {
        update: {
          where: { id: account.id },
          data: { balance: account.balance + amt },
        },
      },
    },
  });
  await prisma.transaction.create({
    data: {
      type: "deposit",
      userId: user.id,
      amount: amt,
      fromAccountNumber: account.accountNumber,
      toAccountNumber: account.accountNumber,
    },
  });
  return res
    .status(200)
    .json({ message: "Deposit successful", user: updatedUser });
});

router.post("/account/transfer", async (req, res) => {
  const { senderAccountNO, receiverAccountNO, amt, pin } = req.body;
  if (!senderAccountNO) {
    return res.status(400).json({ error: "Sender Account Number is required" });
  }
  if (!pin) {
    return res.status(400).json({ error: "PIN is required" });
  }
  if (!receiverAccountNO) {
    return res
      .status(400)
      .json({ error: "Receiver Account Number is required" });
  }
  if (!amt) {
    return res.status(400).json({ error: "Amount is required" });
  }

  const senderUser = await prisma.account.findUnique({
    where: { accountNumber: senderAccountNO },
  });
  if (!senderUser) {
    return res.status(404).json({ error: "Sender account not found" });
  }
  if (senderUser.pin !== pin) {
    return res.status(400).json({ error: "Invalid PIN" });
  }
  if (senderUser.balance < amt) {
    return res.status(400).json({ error: "Insufficient balance" });
  }
  const receiverUser = await prisma.account.findUnique({
    where: { accountNumber: receiverAccountNO },
  });
  if (!receiverUser) {
    return res.status(404).json({ error: "Receiver account not found" });
  }
  const updatedSenderUser = await prisma.account.update({
    where: { accountNumber: senderAccountNO },
    data: { balance: senderUser.balance - amt },
  });
  const updatedReceiverUser = await prisma.account.update({
    where: { accountNumber: receiverAccountNO },
    data: { balance: receiverUser.balance + amt },
  });

  const transaction = await prisma.transaction.create({
    data: {
      type: "transfer",
      fromAccountNumber: senderUser.accountNumber,
      toAccountNumber: receiverUser.accountNumber,
      amount: amt,
      user: { connect: { id: senderUser.userId } },
    },
  });
  return res.status(200).json({
    message: "Transfer successful",
    senderAccountNo: updatedSenderUser.accountNumber,
    receiverAccountNo: updatedReceiverUser.accountNumber,
    transaction: transaction,
  });
});

router.get("/account/statement/:accountNumber", async (req, res) => {
  const { accountNumber } = req.params;
  if (!accountNumber) {
    return res.status(400).json({ error: "Account Number is required" });
  }
  const account = await prisma.account.findUnique({
    where: { accountNumber },
  });
  if (!account) {
    return res.status(404).json({ error: "Account not found" });
  }

  const transaction = await prisma.transaction.findMany({
    where: { userId: account.userId },
  });
  return res.status(200).json({ transactions: transaction });
});

export default router;
