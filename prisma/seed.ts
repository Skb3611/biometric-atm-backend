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
    prisma.user.create({
      data: {
        name: "Prof Pooja",
        fingerprintId: "fingerprint_prof_pooja",
      },
    }),
    prisma.user.create({
      data: {
        name: "Rohan",
        fingerprintId: "fingerprint_rohan",
      },
    }),
    prisma.user.create({
      data: {
        name: "Shyam",
        fingerprintId: "fingerprint_shyam",
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create accounts
  const accounts = await Promise.all([
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
    prisma.account.create({
      data: {
        accountNumber: "1001234576",
        pin: 1111,
        balance: 90000,
        bankName: BankName.SBI,
        userId: users[4].id,
      },
    }),
    prisma.account.create({
      data: {
        accountNumber: "1001234577",
        pin: 2222,
        balance: 42000,
        bankName: BankName.HDFC,
        userId: users[5].id,
      },
    }),
    prisma.account.create({
      data: {
        accountNumber: "1001234578",
        pin: 3333,
        balance: 38000,
        bankName: BankName.ICICI,
        userId: users[6].id,
      },
    }),
  ]);

  console.log(`✅ Created ${accounts.length} accounts`);

  // Create transactions
  const transactions = await Promise.all([
    prisma.transaction.create({
      data: {
        fromAccountNumber: accounts[0].accountNumber,
        toAccountNumber: accounts[2].accountNumber,
        amount: 5000,
        type: TransactionType.transfer,
        userId: users[0].id,
      },
    }),
    prisma.transaction.create({
      data: {
        fromAccountNumber: accounts[2].accountNumber,
        toAccountNumber: accounts[4].accountNumber,
        amount: 10000,
        type: TransactionType.transfer,
        userId: users[1].id,
      },
    }),
    prisma.transaction.create({
      data: {
        fromAccountNumber: accounts[4].accountNumber,
        toAccountNumber: accounts[6].accountNumber,
        amount: 15000,
        type: TransactionType.transfer,
        userId: users[2].id,
      },
    }),
    prisma.transaction.create({
      data: {
        fromAccountNumber: "",
        toAccountNumber: accounts[1].accountNumber,
        amount: 20000,
        type: TransactionType.deposit,
        userId: users[0].id,
      },
    }),
    prisma.transaction.create({
      data: {
        fromAccountNumber: accounts[3].accountNumber,
        toAccountNumber: "",
        amount: 8000,
        type: TransactionType.withdraw,
        userId: users[1].id,
      },
    }),
    prisma.transaction.create({
      data: {
        fromAccountNumber: "",
        toAccountNumber: accounts[8].accountNumber,
        amount: 30000,
        type: TransactionType.deposit,
        userId: users[4].id,
      },
    }),
    prisma.transaction.create({
      data: {
        fromAccountNumber: accounts[9].accountNumber,
        toAccountNumber: accounts[10].accountNumber,
        amount: 5000,
        type: TransactionType.transfer,
        userId: users[5].id,
      },
    }),
    prisma.transaction.create({
      data: {
        fromAccountNumber: accounts[10].accountNumber,
        toAccountNumber: "",
        amount: 4000,
        type: TransactionType.withdraw,
        userId: users[6].id,
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
