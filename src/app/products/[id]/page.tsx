import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "./ProductForm";

interface Props {
  params: Promise<{ id: string }>; 
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params; 
  const productId = Number(id); 

  // if (isNaN(productId)) return notFound();

  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: isNaN(Number(id)) ? undefined : Number(id) },
        { customId: id },
      ],
    },
    include: {
    author: {
      select: {
        id: true,
        email: true,
        name: true,
      },
    },
  },
  });

  if (!product) return notFound();

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <p className="mb-4">{product.description}</p>
      <p className="mb-4">{product.customId}</p>

      <h2 className="text-xl font-semibold mb-2">Edit Product</h2>
      <ProductForm product={{
    ...product,
    description: product.description || "",
    }} />
    </main>
  );
}