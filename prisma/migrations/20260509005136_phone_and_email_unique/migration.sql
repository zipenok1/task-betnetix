/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `shop_owners` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `shop_owners` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "shop_owners_phone_key" ON "shop_owners"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "shop_owners_email_key" ON "shop_owners"("email");
