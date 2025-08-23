import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "./ProductForm";

interface Props {
  params: Promise<{ id: string }>; 
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params; 
  const productId = Number(id); 

  if (isNaN(productId)) return notFound();

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) return notFound();

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <p className="mb-4">{product.description}</p>

      <h2 className="text-xl font-semibold mb-2">Edit Product</h2>
      <ProductForm product={product} />
    </main>
  );
}