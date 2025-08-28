import prisma from "@/lib/prisma"; 

async function main() {
  await prisma.product.deleteMany({});
  console.log("✅ All products deleted");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  });
