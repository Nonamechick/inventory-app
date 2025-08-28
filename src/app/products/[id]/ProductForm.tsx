"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/components/products-data-table"

interface ProductFormProps {
  product: Product
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(product.quantity.toString());
  const [customId, setCustomId] = useState(product.customId);

  const handleUpdate = async () => {
    setLoading(true);
    await fetch("/api/posts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        id: product.id, 
        name, 
        description,
        quantity: quantity === "" ? 0 : Number(quantity),
        customId
      }),
    });
    setLoading(false);
    router.refresh();
  };

  const handleDelete = async () => {
    setLoading(true);
    await fetch("/api/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: product.id }),
    });
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col gap-2">
       <span className="text-sm text-gray-600">
        <strong>ID:</strong> {product.id}
      </span>
      <span className="text-sm text-gray-600">
        <strong>Created At:</strong> {new Date(product.createdAt).toLocaleString()}
      </span>
      <span className="text-sm text-gray-600">
        <strong>Created By:</strong> {product.author?.name || product.author?.email}
      </span>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded"
      />
      <textarea
        value={description ?? ""}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 rounded"
      />
       <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          value={customId}
          onChange={(e) => setCustomId(e.target.value.toUpperCase())}
          className="border p-2 rounded"
        />
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          Update
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-3 py-1 bg-red-600 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
