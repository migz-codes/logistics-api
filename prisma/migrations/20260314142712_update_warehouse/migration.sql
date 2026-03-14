/*
  Warnings:

  - You are about to drop the column `area` on the `Warehouse` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Warehouse` table. All the data in the column will be lost.
  - The `status` column on the `Warehouse` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `area_total` to the `Warehouse` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WarehouseStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- AlterTable
ALTER TABLE "Warehouse" DROP COLUMN "area",
DROP COLUMN "category",
ADD COLUMN     "address_complement" TEXT,
ADD COLUMN     "area_total" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "images" TEXT[],
DROP COLUMN "status",
ADD COLUMN     "status" "WarehouseStatus" NOT NULL DEFAULT 'AVAILABLE';
