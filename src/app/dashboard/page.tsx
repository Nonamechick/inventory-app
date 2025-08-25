import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user)
    return <div className="flex justify-center">Sign in to create Product</div>;

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
    author: {
      select: { id: true, email: true, name: true },
    },
  },
  });

  return (
    <main className="max-w-2xl mx-auto p-4">
      {/* Button to navigate to create-product page */}
      <Link href="/create-product">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Create New Product
        </button>
      </Link>

      <div className="mt-8 space-y-4">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <div className="p-4 border border-zinc-800 rounded hover:bg-zinc-900 cursor-pointer">
              <h2 className="font-bold">{product.name}</h2>
              <p className="mt-2">{product.description}</p>

              <div className="mt-2 text-sm text-gray-400 space-y-1">
                <p><strong>ID:</strong> {product.id}</p>
                <p><strong>Quantity:</strong> {product.quantity}</p>
                <p><strong>Created At:</strong> {new Date(product.createdAt).toLocaleString()}</p>
                <p><strong>Updated:</strong> {new Date(product.updatedAt).toLocaleString()}</p>
                <p><strong>Author:</strong> {product.author?.name}</p>
                <p><strong>Email:</strong> {product.author?.email}</p>
              </div>

              <p className="mt-2 text-sm text-gray-500 italic">
                Click to edit / delete
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
