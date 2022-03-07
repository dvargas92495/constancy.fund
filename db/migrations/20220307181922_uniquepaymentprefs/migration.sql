/*
  Warnings:

  - A unique constraint covering the columns `[userId,type]` on the table `PaymentPreference` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentPreferenceUuid,label]` on the table `PaymentPreferenceDetail` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `PaymentPreference_userId_type_key` ON `PaymentPreference`(`userId`, `type`);

-- CreateIndex
CREATE UNIQUE INDEX `PaymentPreferenceDetail_paymentPreferenceUuid_label_key` ON `PaymentPreferenceDetail`(`paymentPreferenceUuid`, `label`);
