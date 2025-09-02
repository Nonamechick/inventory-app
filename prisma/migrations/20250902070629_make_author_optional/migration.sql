-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_authorId_fkey";

-- AlterTable
ALTER TABLE "public"."Product" ALTER COLUMN "authorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
