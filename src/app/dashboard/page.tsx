import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user)
    return <div className="flex justify-center">Sign in to create Product</div>;

  const products = await prisma.product.findMany({
    where: { author: { clerkId: user.id } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-2xl mx-auto p-4">
      {/* Button to navigate to create-product page */}
      <Link href="/create-product">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Create New Product
        </button>
      </Link>

      <div className="mt-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-4 border border-zinc-800 rounded mt-4"
          >
            <h2 className="font-bold">{product.name}</h2>
            <p className="mt-2">{product.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
