-- CreateEnum
CREATE TYPE "ACTION_TRANSACTION_ENUM" AS ENUM ('SEND', 'WITHDRAW', 'TOPUP');

-- CreateEnum
CREATE TYPE "TYPE_TRANSACTION" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "STATUS_TRANSACTION" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUND');

-- CreateTable
CREATE TABLE "wallets" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "reff_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" "ACTION_TRANSACTION_ENUM" NOT NULL,
    "type" "TYPE_TRANSACTION" NOT NULL,
    "detail_account" JSONB,
    "detail_destination" JSONB,
    "status" "STATUS_TRANSACTION" NOT NULL DEFAULT 'PENDING',
    "amount" INTEGER NOT NULL DEFAULT 0,
    "admin" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "wallet_id" INTEGER NOT NULL,
    "request_midtrans" JSONB,
    "response_midtrans" JSONB,
    "callback_midtrans" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wallets_user_id_key" ON "wallets"("user_id");

-- CreateIndex
CREATE INDEX "transactions_reff_id_user_id_idx" ON "transactions"("reff_id", "user_id");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
