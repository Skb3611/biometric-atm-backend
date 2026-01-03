import Router from "express";
import prisma from "../lib/prisma";
const router = Router();
router.post("/verify-fingerprint", async (req, res) => {
  const { fingerprintId } = req.body;
  if (!fingerprintId) {
    return res.status(400).json({ error: "Fingerprint ID is required" });
  }
  const user = await prisma.user.findUnique({
    where: { fingerprintId },
    include: { accounts: true, transactions: true },
  });
  return user
    ? res.status(200).json({
        message: "Fingerprint verified",
        user: {
          id: user.id,
          name: user.name,
          fingerprintId: user.fingerprintId,
          accounts: user.accounts,
          transactions: user.transactions,
        },
      })
    : res.status(404).json({ error: "User not found" });
});

export default router;
