/*
  Warnings:

  - You are about to drop the column `accountNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `balance` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pin` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BankName" AS ENUM ('SBI', 'HDFC', 'ICICI', 'AXIS');

-- DropIndex
DROP INDEX "User_accountNumber_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "accountNumber",
DROP COLUMN "balance",
DROP COLUMN "pin";

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "pin" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "bankName" "BankName" NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_accountNumber_key" ON "Account"("accountNumber");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
