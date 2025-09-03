import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const latestProduct = await prisma.product.findFirst({
    orderBy: { createdAt: "desc" },
  });

  return (
     <>
      <h1 className="text-2xl font-bold">Latest Inventories</h1>
      {latestProduct ? (
        <div className="p-4 border rounded my-2">
          <h2 className="text-lg font-semibold">{latestProduct.name}</h2>
          <p>{latestProduct.description}</p>
          <p className="text-sm text-gray-600">Qty: {latestProduct.quantity}</p>
          <p className="text-xs text-gray-500">
            Created: {latestProduct.createdAt.toLocaleString()}
          </p>
        </div>
      ) : (
        <p>No items yet.</p>
      )}

      <h1 className="text-2xl font-bold mt-6">Popular Inventories</h1>
      <h1 className="text-2xl font-bold mt-6">Tag Cloud</h1>
    </>
  );
}
