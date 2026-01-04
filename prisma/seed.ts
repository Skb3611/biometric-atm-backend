import {
  BankName,
  TransactionType,
} from "../src/generated/prisma/client";
import dotenv from "dotenv";
import prisma from "../src/lib/prisma";
dotenv.config();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Pranali bagul",
        fingerprintId: "fingerprint_pranali",
      },
    }),
    prisma.user.create({
      data: {
        name: "Harshada Panchal",
        fingerprintId: "fingerprint_harshada",
      },
    }),
    prisma.user.create({
      data: {
        name: "Gayatri Waghmare",
        fingerprintId: "fingerprint_gayatri",
      },
    }),
    prisma.user.create({
      data: {
        name: "Shubhangi Waghchaure",
        fingerprintId: "fingerprint_shubhangi",
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create accounts for each user
  const accounts = await Promise.all([
    // Pranali's accounts
    prisma.account.create({
      data: {
        accountNumber: "1001234567",
        pin: 1234,
        balance: 50000,
        bankName: BankName.SBI,
        userId: users[0].id,
      },
    }),
    prisma.account.create({
      data: {
        accountNumber: "1001234570",
        pin: 1234,
        balance: 30000,
        bankName: BankName.HDFC,
        userId: users[0].id,
      },
    }),
    // Harshada's accounts
    prisma.account.create({
      data: {
        accountNumber: "1001234568",
        pin: 5678,
        balance: 75000,
        bankName: BankName.ICICI,
        userId: users[1].id,
      },
    }),
    prisma.account.create({
      data: {
        accountNumber: "1001234571",
        pin: 5678,
        balance: 45000,
        bankName: BankName.AXIS,
        userId: users[1].id,
      },
    }),
    // Gayatri's accounts
    prisma.account.create({
      data: {
        accountNumber: "1001234572",
        pin: 9012,
        balance: 60000,
        bankName: BankName.AXIS,
        userId: users[2].id,
      },
    }),
    prisma.account.create({
      data: {
        accountNumber: "1001234574",
        pin: 9012,
        balance: 35000,
        bankName: BankName.HDFC,
        userId: users[2].id,
      },
    }),
    // Shubhangi's accounts
    prisma.account.create({
      data: {
        accountNumber: "1001234573",
        pin: 3456,
        balance: 55000,
        bankName: BankName.SBI,
        userId: users[3].id,
      },
    }),
    prisma.account.create({
      data: {
        accountNumber: "1001234575",
        pin: 3456,
        balance: 40000,
        bankName: BankName.ICICI,
        userId: users[3].id,
      },
    }),
  ]);

  console.log(`✅ Created ${accounts.length} accounts`);

  // Create transactions
  const transactions = await Promise.all([
    // Pranali transfers to Harshada
    prisma.transaction.create({
      data: {
        fromAccountNumber: accounts[0].accountNumber,
        toAccountNumber: accounts[2].accountNumber,
        amount: 5000,
        type: TransactionType.transfer,
        userId: users[0].id,
      },
    }),
    // Harshada transfers to Gayatri
    prisma.transaction.create({
      data: {
        fromAccountNumber: accounts[2].accountNumber,
        toAccountNumber: accounts[4].accountNumber,
        amount: 10000,
        type: TransactionType.transfer,
        userId: users[1].id,
      },
    }),
    // Gayatri transfers to Shubhangi
    prisma.transaction.create({
      data: {
        fromAccountNumber: accounts[4].accountNumber,
        toAccountNumber: accounts[6].accountNumber,
        amount: 15000,
        type: TransactionType.transfer,
        userId: users[2].id,
      },
    }),
    // Pranali deposits to her HDFC account
    prisma.transaction.create({
      data: {
        fromAccountNumber: "",
        toAccountNumber: accounts[1].accountNumber,
        amount: 20000,
        type: TransactionType.deposit,
        userId: users[0].id,
      },
    }),
    // Harshada withdraws from Axis account
    prisma.transaction.create({
      data: {
        fromAccountNumber: accounts[3].accountNumber,
        toAccountNumber: "",
        amount: 8000,
        type: TransactionType.withdraw,
        userId: users[1].id,
      },
    }),
    // Shubhangi deposits to Bank of America account
    prisma.transaction.create({
      data: {
        fromAccountNumber: "",
        toAccountNumber: accounts[0].accountNumber,
        amount: 25000,
        type: TransactionType.deposit,
        userId: users[3].id,
      },
    }),
    // Gayatri deposits to her HDFC account
    prisma.transaction.create({
      data: {
        fromAccountNumber: "",
        toAccountNumber: accounts[5].accountNumber,
        amount: 12000,
        type: TransactionType.deposit,
        userId: users[2].id,
      },
    }),
  ]);

  console.log(`✅ Created ${transactions.length} transactions`);
  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
