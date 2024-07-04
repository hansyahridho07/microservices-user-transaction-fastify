-- CreateEnum
CREATE TYPE "STATUS_DEFAULT" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ADMIN_TYPE" AS ENUM ('FIX', 'PERCENTAGE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "status" "STATUS_DEFAULT" NOT NULL DEFAULT 'ACTIVE',
    "admin_type" "ADMIN_TYPE" NOT NULL DEFAULT 'FIX',
    "admin" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_accounts" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "payment_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "account_info" JSONB NOT NULL,
    "status" "STATUS_DEFAULT" NOT NULL DEFAULT 'INACTIVE',

    CONSTRAINT "user_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "user_accounts" ADD CONSTRAINT "user_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_accounts" ADD CONSTRAINT "user_accounts_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payment_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
