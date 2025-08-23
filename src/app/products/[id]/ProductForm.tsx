"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  product: { id: string; name: string; description: string };
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    await fetch("/api/posts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: product.id, name, description }),
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
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
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
