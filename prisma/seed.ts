import { PrismaClient } from "../src/generated/prisma/client";
import dotenv from "dotenv";
dotenv.config();
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");
  await prisma.transaction.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Abhi",
        accountNumber: "1001234567",
        pin: "1234",
        balance: 50000,
        fingerprintId: "fingerprint_abhi",
      },
    }),
    prisma.user.create({
      data: {
        name: "Rohan",
        accountNumber: "1001234568",
        pin: "5678",
        balance: 75000,
        fingerprintId: "fingerprint_rohan",
      },
    }),
    prisma.user.create({
      data: {
        name: "Jonny",
        accountNumber: "1001234569",
        pin: "9012",
        balance: 100000,
        fingerprintId: "fingerprint_jonny",
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create transactions

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
